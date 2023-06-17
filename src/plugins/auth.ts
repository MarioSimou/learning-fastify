import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { StatusUnauthorized, newApiResponse, toError } from '../newApiResponse.js'

async function authenticatePlugin(fastify: FastifyInstance) {
    fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify()
        } catch (e) {
            reply.code(StatusUnauthorized).send(newApiResponse(StatusUnauthorized, toError(e).message))
        }
    })
}

export default fp(authenticatePlugin)
