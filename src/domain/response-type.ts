import { TokenType } from '../domain/schema';

export class Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  verify_token: string;
  constructor({
    access_token,
    token_type = 'bearer',
    verify_token,
    refresh_token,
  }: TokenType) {
    this.access_token = access_token;
    this.token_type = token_type;
    this.verify_token = verify_token;
    this.refresh_token = refresh_token;
  }
}
