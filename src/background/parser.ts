import { ParseError, TokenError } from './errors'

const MILLIS_IN_24H = 86400000  // 24 * 60 * 60 * 1000
const UNITS_IN_MILLIS: { [unit: string]: number} = {
  h: 3600000,
  m: 60000,
  s: 1000
}

type Token = {
  type: string
  value: string
}

type Stream = {
  peek(): string | null
  match(pattern: RegExp, consume: boolean): string | null
  next(): string | null
  isEnd(): boolean
}

type Tokenizer = {
  (stream: Stream): string
}


export function Lexer(text: string, tokenizer: Tokenizer): Token[] {
  let position = 0
  const tokens: Token[] = []

  const isEnd = function(): boolean {
    return position >= text.length
  }

  const peek = function(): string | null {
    if (isEnd()) {
      return null
    }
    return text.substring(position, position + 1)
  }

  const match = function(pattern: RegExp, consume: boolean): string | null {
    const restOfText = text.substring(position)
    const match = restOfText.match(pattern)

    if (!match || match.length > 1) {
      return null
    }

    if (consume) {
      position += match[0].length
    }

    return match[0]
  }


  const next = function(): string | null {
    position += 1
    return peek()
  }


  while (!isEnd()) {
    const startingPosition = position
    const tokenType = tokenizer({peek, match, next, isEnd})

    if (startingPosition === position) {
      throw new ParseError('Tokenizer did not move forward')
    }

    const token: Token = {
      type: tokenType,
      value: text.substring(startingPosition, position)
    }

    tokens.push(token)
  }

  return tokens
}


export function Tokenizer(stream: Stream): string {
  const peek: string = stream.peek() || ''

  // time, 12:00
  if (stream.match(/^\d+:\d+/, true)) {
    return 'time'
  }

  // numbers (only integers)
  if (stream.match(/^[-]?\d+/, true)) {
    return 'number'
  }

  // units
  if (['h', 'm', 's'].indexOf(peek) > -1) {
    stream.next()
    return 'unit'
  }

  // operators
  if (['+', '-', '%'].indexOf(peek) > -1) {
    stream.next()
    return 'operator'
  }
  
  // whitespace
  if (stream.match(/^ +/, true)) {
    return 'whitespace'
  }

  // everything else is error
  throw new TokenError('Invalid token')
}


export function Parser(tokens: Token[], now?: number): number {
  /**
   * Recursive Descent Parser for time calculations.
   */

  now = now || Date.now()
  tokens = tokens.filter( token => token.type !== 'whitespace' )  // Remove all whitespace

  const currentToken = tokens[0]
  const nextToken = tokens[1] || null
  
  if (currentToken.type === 'number') {
    // number
    if (nextToken === null) {
      return Number(currentToken.value)
    }

    // number +
    if (nextToken.type === 'operator' && nextToken.value === '+') {
      return Number(currentToken.value) + Parser(tokens.slice(2), now)
    }

    // number -
    if (nextToken.type === 'operator' && nextToken.value === '-') {
      return Number(currentToken.value) - Parser(tokens.slice(2), now)
    }

    // number unit +
    if (nextToken.type === 'unit' && tokens.length > 2 && tokens[2].type === 'operator' && tokens[2].value === '+') {
      return Number(currentToken.value) * UNITS_IN_MILLIS[nextToken.value] + Parser(tokens.slice(3), now)
    }

    // number unit -
    if (nextToken.type === 'unit' && tokens.length > 2 && tokens[2].type === 'operator' && tokens[2].value === '-') {
      return Number(currentToken.value) * UNITS_IN_MILLIS[nextToken.value] - Parser(tokens.slice(3), now)
    }
    
    // number unit
    if (nextToken.type === 'unit') {
      return Number(currentToken.value) * UNITS_IN_MILLIS[nextToken.value]
    }
  }

  if (currentToken.type === 'time') {
    const [hours, minutes] = currentToken.value.split(':').map(val => Number(val))
    const offset = new Date().getTimezoneOffset()
    let delta = hours * 3600000 + (minutes + offset) * 60000 - now % MILLIS_IN_24H
    delta =  delta > 0 ? delta : delta + MILLIS_IN_24H

    if (tokens.slice(1).map(t => t.type).indexOf('time') !== -1) {
      throw new ParseError('Only one absolute time reference allowed.')
    }

    // time
    if (nextToken === null) {
      return delta
    }

    // time +
    if (nextToken.type === 'operator' && nextToken.value === '+') {
      return delta + Parser(tokens.slice(2), now)
    }

    // time -
    if (nextToken.type === 'operator' && nextToken.value === '-') {
      return delta - Parser(tokens.slice(2), now)
    }
  }

  // %
  if (currentToken.type === 'operator' && currentToken.value === '%') {
    const interval = Parser(tokens.slice(1), now)
    return interval - now % interval 
  }

  // ERROR
  if (currentToken.type === 'error') {
    throw new ParseError(currentToken.value)
  }

  throw new ParseError('Invalid expression.')
}


// Implementation inspired by: https://andrewstevens.dev/posts/formula-parser-in-javascript/
