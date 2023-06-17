import type { FastifyInstance } from 'fastify'
import { newApiResponse, StatusCreated, StatusInternalServerError, toError } from '../newApiResponse.js'
import { FromSchema } from 'json-schema-to-ts'

const bodySchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        completed: { type: 'boolean' },
    },
    required: ['title'],
} as const

export default async function (fastify: FastifyInstance) {
    fastify.addHook('onRequest', fastify.authenticate)
    fastify.post<{
        Body: FromSchema<typeof bodySchema>
    }>('/api/v1/todos', { schema: { body: bodySchema } }, async (req, reply) => {
        try {
            const todoItem = await fastify.prisma.todo.create({
                data: {
                    title: req.body.title,
                    completed: req.body.completed,
                    author: {
                        connect: {
                            // @ts-expect-error
                            id: req.user.id,
                        },
                    },
                },
            })

            reply.header('Location', `/api/v1/todos/${todoItem.id}`)
            return reply.code(StatusCreated).send(newApiResponse(StatusCreated, todoItem))
        } catch (e) {
            return reply
                .code(StatusInternalServerError)
                .send(newApiResponse(StatusInternalServerError, toError(e).message))
        }
    })
}
