import { assert } from 'chai';
import { createScanner, Scanner } from './scanner';
import { Token } from './token';
import { TokenType } from './types';

const testFunctionText = `
func add(a, b) {
  a + b
}`;

describe('Scanner', () => {
  it('should correctly recognize an identifier', () => {
    const scanner: Scanner = createScanner('hello');
    const tokens: Token[] = scanner.scan();
    const expected: Token[] = [
      {
        type: TokenType.IDENTIFIER,
        text: 'hello',
        line: 1,
        start: 0,
        end: 4,
      },
      {
        type: TokenType.EOF,
        text: '',
        line: 1,
        start: 5,
        end: 5,
      },
    ];

    assert.deepEqual(tokens, expected);
  });

  it('should correctly handle tokens for a function declaration', () => {
    const scanner: Scanner = createScanner(testFunctionText);
    const tokens: Token[] = scanner.scan();
    const expected: Token[] = [
      {
        type: TokenType.FUNCTION,
        text: 'func',
        line: 2,
        start: 1,
        end: 4,
      },
      {
        type: TokenType.IDENTIFIER,
        text: 'add',
        line: 2,
        start: 6,
        end: 8,
      },
      {
        type: TokenType.LEFT_PAREN,
        text: '',
        line: 2,
        start: 9,
        end: 9,
      },
      {
        type: TokenType.IDENTIFIER,
        text: 'a',
        line: 2,
        start: 10,
        end: 10,
      },
      {
        type: TokenType.COMMA,
        text: '',
        line: 2,
        start: 11,
        end: 11,
      },
      {
        type: TokenType.IDENTIFIER,
        text: 'b',
        line: 2,
        start: 13,
        end: 13,
      },
      {
        type: TokenType.RIGHT_PAREN,
        text: '',
        line: 2,
        start: 14,
        end: 14,
      },
      {
        type: TokenType.LEFT_BRACE,
        text: '',
        line: 2,
        start: 16,
        end: 16,
      },
      {
        type: TokenType.IDENTIFIER,
        text: 'a',
        line: 3,
        start: 20,
        end: 20,
      },
      {
        type: TokenType.PLUS,
        text: '',
        line: 3,
        start: 22,
        end: 22,
      },
      {
        type: TokenType.IDENTIFIER,
        text: 'b',
        line: 3,
        start: 24,
        end: 24,
      },
      {
        type: TokenType.RIGHT_BRACE,
        text: '',
        line: 4,
        start: 26,
        end: 26,
      },
      {
        type: TokenType.EOF,
        text: '',
        line: 4,
        start: 27,
        end: 27,
      },
    ];

    assert.deepEqual(tokens, expected);
  });
});
