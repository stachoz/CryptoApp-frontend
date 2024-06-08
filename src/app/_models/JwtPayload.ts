export interface JwtPayload {
    sub: string,
    iat: number,
    authorities: string[],
    exp: number
}