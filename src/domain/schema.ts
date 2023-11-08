export interface TokenType {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  verify_token?: string | null;
}

export interface DataToken {
  _id: string;
  email: string;
  fullname: string;
  role: string;
  is_refresh_token: boolean;
}
