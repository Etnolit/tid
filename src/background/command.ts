import { ParseError } from './errors'


export function processCommandString(command: string): number {

    const reRelTime = /(\d+)([hms])/
    const reAbsTime = /(\d{2}):(\d{2})/
  
    if (reRelTime.test(command)) {
      //console.log('Valid relative time.')
      const match = <Array<string>>reRelTime.exec(command)
      
      let time = Number(match[1])
  
      if (match[2] === 'm') {
        time *= 60
      }
  
      if (match[2] === 'h') {
        time *= 3600
      }
  
      return time;
    }
    
    if (reRelTime.test(command)) {
      console.log('Valid absolute time.')
      //const match = <Array<string>>reAbsTime.exec(command)
  
    }
    
    return 300
}


interface Token {
  type: string
  value: string
}

interface Stream {
  peek(): string | null
  match(pattern: RegExp, consume: boolean): string | null
  next(): string | null
  isEnd(): boolean
}

interface Tokenizer {
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
  stream.next()
  return 'error'   // raise TokenError ?
}


// https://andrewstevens.dev/posts/formula-parser-in-javascript/
// https://www.booleanworld.com/building-recursive-descent-parsers-definitive-guide/
