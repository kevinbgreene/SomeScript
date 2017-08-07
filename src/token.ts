import { TokenType } from './types';

export interface Postion {
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  text: string;
  line: number;
  start: number;
  end: number;
}

export function createToken(type: TokenType, text: string, line: number, start: number = 0, end: number = 0): Token {
  return {
    type,
    text,
    line,
    start,
    end,
  };
}
