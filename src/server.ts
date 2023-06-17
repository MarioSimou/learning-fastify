import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import { resolve } from 'node:path'
import jwtPlugin from '@fastify/jwt'
import envPlugin from '@fastify/env'

const envSchema = {
    type: 'object',
    properties: {
        JWT_SECRET: { type: 'string' },
        PLUGINS_DIR: { type: 'string' },
        ROUTES_DIR: { type: 'string' },
    },
    required: ['JWT_SECRET'],
} as const

const createServer = async () => {
    try {
        const fastify = Fastify({
            logger: true,
        })

        await fastify.register(envPlugin, { schema: envSchema, dotenv: true })
        await fastify.register(jwtPlugin, { secret: process.env.JWT_SECRET as string })
        await fastify.register(autoload, { dir: process.env.PLUGINS_DIR as string })
        await fastify.register(autoload, { dir: process.env.ROUTES_DIR as string })

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
