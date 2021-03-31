export class ParseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ParseError'
    }
}

export class TokenError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'TokenError'
    }
}
