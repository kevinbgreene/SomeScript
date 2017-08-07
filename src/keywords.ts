import { TokenType } from './types';

export interface KeywordMap {
  [name: string]: TokenType;
}

export const KEYWORDS: KeywordMap = {
  val: TokenType.VAL,
  func: TokenType.FUNCTION,
  if: TokenType.IF,
  else: TokenType.ELSE,
  elseif: TokenType.ELSE_IF,
  type: TokenType.TYPE,
  typealias: TokenType.TYPE_ALIAS,
  module: TokenType.MODULE,
  exports: TokenType.EXPORTS,
  import: TokenType.IMPORT,
};
