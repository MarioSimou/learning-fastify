import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import JwksClient from 'jwks-rsa'

async function jwksClientPlugin(fastify: FastifyInstance) {
    const client = JwksClient({
        // jwksUri: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_vDH0WTKHh/.well-known/jwks.json',
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
    })

    fastify.decorate('jwksClient', client)
}

export default fp(jwksClientPlugin)
