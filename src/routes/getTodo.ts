import type { FastifyInstance } from 'fastify'
import { newApiResponse, StatusInternalServerError, StatusNotFound, StatusOk, toError } from '../newApiResponse.js'
import { FromSchema } from 'json-schema-to-ts'

const paramsSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
    },
    required: ['id'],
} as const

export default async function (fastify: FastifyInstance) {
    fastify.addHook('onRequest', fastify.authenticate)
    fastify.get<{ Params: FromSchema<typeof paramsSchema> }>(
        '/api/v1/todos/:id',
        { schema: { params: paramsSchema } },
        async (req, reply) => {
            try {
                const todoItem = await fastify.prisma.todo.findFirst({ where: { id: req.params.id } })
                if (!todoItem) {
                    return reply.code(StatusNotFound).send(newApiResponse(StatusNotFound, 'Item not found'))
                }

                return reply.send(newApiResponse(StatusOk, todoItem))
            } catch (e) {
                return reply
                    .code(StatusInternalServerError)
                    .send(newApiResponse(StatusInternalServerError, toError(e).message))
            }
        }
    )
}
