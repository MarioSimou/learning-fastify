import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import autoload from '@fastify/autoload'
import envPlugin from '@fastify/env'
import jwtPlugin, { TokenOrHeader, JwtHeader } from '@fastify/jwt'

const envSchema = {
    type: 'object',
    properties: {
        PLUGINS_DIR: { type: 'string' },
        ROUTES_DIR: { type: 'string' },
        AUTH0_DOMAIN: { type: 'string' },
    },
    required: ['AUTH0_DOMAIN', 'PLUGINS_DIR', 'ROUTES_DIR'],
} as const

const createServer = async () => {
    try {
        const fastify = Fastify({
            logger: true,
        })

        const isDecodedComplete = (token: TokenOrHeader): token is { header: JwtHeader; payload: unknown } => {
            return Boolean((token as any)?.header && (token as any)?.payload)
        }

        await fastify.register(envPlugin, { schema: envSchema, dotenv: true })
        await fastify.register(autoload, { dir: process.env.PLUGINS_DIR as string })
        await fastify.register(autoload, { dir: process.env.ROUTES_DIR as string })
        await fastify.register(jwtPlugin, {
            decode: { complete: true },
            secret: async (_: FastifyRequest, token: TokenOrHeader): Promise<string | Buffer> => {
                if (isDecodedComplete(token)) {
                    const {
                        header: { kid },
                    } = token

                    if (!kid) {
                        throw new Error('Unauthorized')
                    }

                    const signingKey = await fastify.jwksClient.getSigningKey(kid)
                    if (!signingKey) {
                        throw new Error('Unauthorized')
                    }
                    return signingKey.getPublicKey()
                }

                throw new Error('Token is not decoded complete')
            },
            verify: {
                allowedIss: `https://${process.env.AUTH0_DOMAIN}/`,
            },
        })

        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

        await fastify.listen({ port })

        fastify.log.info(`The app is listening on http://localhost:${port}`)
        console.info(fastify.printRoutes())
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

createServer()
