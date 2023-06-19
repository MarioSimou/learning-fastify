import 'jwk-to-pem'
declare module 'jwk-to-pem' {
    import { RSA, EC, ECPrivate } from 'jwk-to-pem'
    export interface RSA {
        kid?: string
        use: string
    }

    export type JWK = RSA | EC | ECPrivate
}
