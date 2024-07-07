export interface PayloadType {
  email: string;
  userId: number;
  artistId?: number;
}

export interface ExtendedUser extends Express.User {
  userId: number;
  password: string;
}

export interface ExtendedRequest extends Express.Request {
  user?: ExtendedUser | undefined;
}

export type Enable2FAType = {
  secret: string;
};
