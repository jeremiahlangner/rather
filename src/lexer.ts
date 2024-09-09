import { Token, Keyword, KeywordMap, TokenMap } from './token';

export default class Lexer {
  ch: string = '';
  input: string = '';
  position: number = 0;
  readPosition: number = 0;

  public lex(input: string) {
    this.ch = '';
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.readChar();
  }

  public next(): Extract<Token | Keyword, { type: string }> | undefined {
    let token: Extract<Token | Keyword, { type: string }> | undefined;

    this.skipWs();

    switch (this.ch) {
      case '':
        return;
      case "'":
      case '"':
        token = {
          type: 'string',
          literal: this.readString(this.ch),
          prefix: true
        };
        break;
      default:
        const ch = this.peek();
        if (this.ch in TokenMap) {
          if (`${this.ch}${ch}` in TokenMap) {
            const position = this.position;
            this.readChar();
            token = TokenMap[this.input.slice(position, this.position + 1)];
          } else {
            token = TokenMap[this.ch];
          }
        } else if (letter(this.ch) && !digit(this.ch)) {
          if (letter(ch as string) || ws(ch as string) || typeof ch === 'undefined') {
            const literal = this.readIdentifier();
            if (KeywordMap[literal]) {
              token = KeywordMap[literal];
            } else {
              token = {
                type: 'ident',
                literal,
                prefix: true,
                infix: true,
              };
            }
          }
        } else if (digit(this.ch)) {
          if (digit(ch as string) || ws(ch as string) || (ch as string) in TokenMap || typeof ch === 'undefined') {
            token = {
              type: 'number',
              literal: this.readNumber(),
              prefix: true,
            };
          }
        } else {
          console.error(`Syntax Error at position ${this.position} - Unrecognized character '${this.ch}'.`);
          return;
        }
        break;
    }

    this.readChar();
    return token;
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = '';
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private readIdentifier(): string {
    const position = this.position;
    while (letter(this.ch)) {
      this.readChar();
    }
    const ident = this.input.slice(position, this.position);
    this.position--;
    this.readPosition--;
    return ident;
  }

  private readNumber(): string {
    const position = this.position;
    while (digit(this.ch)) {
      this.readChar();
    }
    const num = this.input.slice(position, this.position);
    this.position--;
    this.readPosition--;
    return num;
  }

  private readString(mark?: "'" | '"'): string {
    const position = this.position;
    do {
      this.readChar();
    } while (this.ch !== mark && this.readPosition < this.input.length);
    return this.input.slice(position + 1, this.ch === mark ? this.position : this.readPosition);
  }

  private skipWs() {
    while (ws(this.ch)) {
      this.readChar();
    }
  }

  private peek(): string | undefined {
    if (this.readPosition >= this.input.length) {
      return;
    } else {
      return this.input[this.readPosition];
    }
  }
}

function ws(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

function letter(ch: string): boolean {
  return ('a' <= ch && ch <= 'z') ||
    ('A' <= ch && ch <= 'Z') ||
    ('0' <= ch && ch <= '9') ||
    ch === '_' ||
    ch === '.'
}

function digit(ch: string): boolean {
  return '0' <= ch && ch <= '9' || ch === '.';
}

