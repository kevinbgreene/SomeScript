import { TokenType } from './types';
import { Token, createToken } from './token';
import { KEYWORDS } from './keywords';


export interface Scanner {
  scan(): Array<Token>;
  scanToken(): void;
  advance(): string;
  isAtEnd(): boolean;
}


export function createScanner(text: string): Scanner {
  var source: string = text;
  var startIndex: number = 0;
  var currentIndex: number = 0;
  var column: number = 1;
  var line: number = 1;
  var tokens: Array<Token> = [];

  function scan(): Array<Token> {
    while (!isAtEnd()) {
      startIndex = currentIndex;
      scanToken();
    }

    addToken(TokenType.EOF);

    return tokens;
  }

  function nextLine() {
    line++;
    column = 1;
  }

  function scanToken(): void {
    const next = advance();
    console.log('next: ', next);
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
    while(!isAtEnd() && peek() !== '\n' && isAlphaNumeric(peek())) {
      advance();
    }

    const text: string = source.substring(startIndex, currentIndex);
    const type: TokenType = KEYWORDS[text];

    console.log('tokenType: ', type);

    if (type == null) {
      addToken(TokenType.IDENTIFIER, text);
    } else {
      addToken(type, text);
    }
  }

  function number(): void {
    while(!isAtEnd() && peek() !== '\n' && isDigit(peek())) {
      advance();
    }

    const text: string = source.substring(startIndex, currentIndex);
    addToken(TokenType.NUMBER, text);
  }

  function string(): void {
    while (!isAtEnd() && peek() !== '"') {
      if (peek() === '\n') {
        nextLine();
      }

      advance();
    }

    if (isAtEnd() && previous() !== '"') {
      console.log('tokens: ', tokens);
      throw new Error(`Strings must be terminated with '"'`);
    }
    else {
      // advance past last "
      advance();

      const text: string = source.substring(startIndex + 1, currentIndex - 1);
      addToken(TokenType.STRING, text);
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

  function isDigit(text: string): boolean {
    return (
      text >= '0' &&
      text <= '9'
    );
  }

  function isAlpha(text: string): boolean {
    return (
      (text >= 'a' && text <= 'z') ||
      (text >= 'A' && text <= 'Z')
    );
  }

  function isAlphaNumeric(text: string): boolean {
    return isDigit(text) || isAlpha(text);
  }

  return {
    scan,
    scanToken,
    advance,
    isAtEnd
  };
}
