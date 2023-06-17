import type { FastifyInstance } from 'fastify'
import { newApiResponse, StatusInternalServerError, StatusOk, StatusUnauthorized, toError } from '../newApiResponse.js'
import type { FromSchema } from 'json-schema-to-ts'

const bodySchema = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
    },
    required: ['username', 'password'],
} as const

export default async function signIn(fastify: FastifyInstance) {
    fastify.post<{ Body: FromSchema<typeof bodySchema> }>(
        '/sign-in',
        { schema: { body: bodySchema } },
        async (req, reply) => {
            try {
                const { username, password } = req.body
                const user = await fastify.prisma.user.findUnique({
                    where: { username: username },
                })

                if (!user) {
                    return reply.code(StatusUnauthorized).send(newApiResponse(StatusUnauthorized, 'Unauthorized'))
                }

                if (user.password !== password) {
                    return reply.code(StatusUnauthorized).send(newApiResponse(StatusUnauthorized, 'Unauthorized'))
                }

                const token = fastify.jwt.sign({ username, email: user.email, id: user.id }, { expiresIn: 3600 })
                return reply.code(StatusOk).send(newApiResponse(StatusOk, token))
            } catch (e) {
                return reply
                    .code(StatusInternalServerError)
                    .send(newApiResponse(StatusInternalServerError, toError(e).message))
            }
        }
    )
}
