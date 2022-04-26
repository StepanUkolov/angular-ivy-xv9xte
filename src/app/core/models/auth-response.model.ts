export class AuthResponse {
  result?: Result | undefined;
  token?: string | undefined;
}

export class Result {
  succeeded?: boolean;
  errors?: string[] | undefined;
}
