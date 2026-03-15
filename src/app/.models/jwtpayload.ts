export interface JWTPayload {
    aud: string;
    exp: number;
    iss: string;
    username: string;
    user_id: string
    role: string;
}
