import { KEYWORDS } from './keywords';
import { createToken, Token } from './token';
import { TokenType } from './types';

export interface Scanner {
  scan(): Token[];
  scanToken(): void;
  advance(): string;
  isAtEnd(): boolean;
}

export function createScanner(text: string): Scanner {
  const source: string = text;
  let startIndex: number = 0;
  let currentIndex: number = 0;
  let column: number = 1;
  let line: number = 1;
  const tokens: Token[] = [];

  function scan(): Token[] {
    while (!isAtEnd()) {
      startIndex = currentIndex;
      scanToken();
    }

    startIndex = currentIndex;
    currentIndex += 1;
    addToken(TokenType.EOF);

    return tokens;
  }

  function nextLine() {
    line++;
    column = 1;
  }

  function scanToken(): void {
    const next = advance();
    switch (next) {
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        nextLine();
        break;

      case '(':
        addToken(TokenType.LEFT_PAREN);
        break;

      case ')':
        addToken(TokenType.RIGHT_PAREN);
        break;

      case '{':
        addToken(TokenType.LEFT_BRACE);
        break;

      case '}':
        addToken(TokenType.RIGHT_BRACE);
        break;

      case ';':
        addToken(TokenType.SEMICOLON);
        break;

      case ',':
        addToken(TokenType.COMMA);
        break;

      case '"':
        string();
        break;

      case '+':
        addToken(TokenType.PLUS);
        break;

      case '-':
        addToken(TokenType.MINUS);
        break;

      default:
        if (isDigit(next)) {
          number();
        }
        else if (isAlpha(next)) {
          identifier();
        }
        else {
          throw new Error('Unexpected token');
        }
    }
  }

  function identifier(): void {
    while (!isAtEnd() && peek() !== '\n' && isAlphaNumeric(peek())) {
      advance();
    }

    const literal: string = source.substring(startIndex, currentIndex);
    const type: TokenType = KEYWORDS[literal];

    if (type == null) {
      addToken(TokenType.IDENTIFIER, literal);
    } else {
      addToken(type, literal);
    }
  }

  function number(): void {
    while (!isAtEnd() && peek() !== '\n' && isDigit(peek())) {
      advance();
    }

    const literal: string = source.substring(startIndex, currentIndex);
    addToken(TokenType.NUMBER, literal);
  }

  function string(): void {
    while (!isAtEnd() && peek() !== '"') {
      if (peek() === '\n') {
        nextLine();
      }

      advance();
    }

    if (isAtEnd() && previous() !== '"') {
      throw new Error(`Strings must be terminated with '"'`);
    }
    else {
      // advance past last "
      advance();

      const literal: string = source.substring(startIndex + 1, currentIndex - 1);
      addToken(TokenType.STRING, literal);
    }
  }

  function addToken(tokenType: TokenType, value: string = ''): void {
    tokens.push(createToken(tokenType, value, line, startIndex, (currentIndex - 1)));
  }

  function previous(): string {
    return source.charAt(currentIndex - 2);
  }

  function peek(): string {
    return source.charAt(currentIndex);
  }

  function peekNext(): string {
    return source.charAt(currentIndex + 1);
  }

  function advance(): string {
    currentIndex++;
    return source.charAt(currentIndex - 1);
  }

  function isAtEnd(): boolean {
    return currentIndex >= source.length;
  }

  function isDigit(value: string): boolean {
    return (
      value >= '0' &&
      value <= '9'
    );
  }

  function isAlpha(value: string): boolean {
    return (
      (value >= 'a' && value <= 'z') ||
      (value >= 'A' && value <= 'Z')
    );
  }

  function isAlphaNumeric(value: string): boolean {
    return isDigit(value) || isAlpha(value);
  }

  return {
    scan,
    scanToken,
    advance,
    isAtEnd,
  };
}
