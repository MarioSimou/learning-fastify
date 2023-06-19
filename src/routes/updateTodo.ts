import type { FastifyInstance } from 'fastify'
import { StatusNotFound, newApiResponse, StatusOk, StatusInternalServerError, toError } from '../newApiResponse.js'
import type { FromSchema } from 'json-schema-to-ts'

const paramsSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
    },
    required: ['id'],
} as const

const bodySchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        completed: { type: 'boolean' },
    },
} as const

export default async function (fastify: FastifyInstance) {
    fastify.put<{
        Params: FromSchema<typeof paramsSchema>
        Body: FromSchema<typeof bodySchema>
    }>('/api/v1/todos/:id', { schema: { params: paramsSchema, body: bodySchema } }, async (req, reply) => {
        try {
            const currentTodoItem = await fastify.prisma.todo.findFirst({ where: { id: req.params.id } })
            if (!currentTodoItem) {
                return reply.code(StatusNotFound).send(newApiResponse(StatusNotFound, 'Todo item not found'))
            }

            const newTodoItem = await fastify.prisma.todo.update({
                where: { id: currentTodoItem.id },
                data: {
                    title: req.body.title,
                    completed: req.body.completed,
                    // @ts-expect-error
                    authorId: req.user.id,
                },
            })

            return reply.send(newApiResponse(StatusOk, newTodoItem))
        } catch (e) {
            return reply
                .code(StatusInternalServerError)
                .send(newApiResponse(StatusInternalServerError, toError(e).message))
        }
    })
}
