import type { FastifyInstance } from 'fastify'
import {
    newApiResponse,
    StatusCreated,
    StatusInternalServerError,
    StatusOk,
    StatusUnauthorized,
    toError,
} from '../newApiResponse.js'
import type { FromSchema } from 'json-schema-to-ts'

const bodySchema = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
    },
    required: ['username', 'email', 'password'],
} as const

export default async function signUp(fastify: FastifyInstance) {
    fastify.post<{ Body: FromSchema<typeof bodySchema> }>(
        '/sign-up',
        { schema: { body: bodySchema } },
        async (req, reply) => {
            try {
                const user = await fastify.prisma.user.create({
                    select: { username: true, email: true, createdAt: true, updatedAt: true },
                    data: req.body,
                })

                return reply.code(StatusCreated).send(newApiResponse(StatusOk, user))
            } catch (e) {
                return reply
                    .code(StatusInternalServerError)
                    .send(newApiResponse(StatusInternalServerError, toError(e).message))
            }
        }
    )
}
