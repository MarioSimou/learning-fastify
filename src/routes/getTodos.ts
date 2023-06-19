import type { FastifyInstance } from 'fastify'
import { newApiResponse, StatusInternalServerError, StatusNotFound, StatusOk, toError } from '../newApiResponse.js'

export default async function (fastify: FastifyInstance) {
    fastify.get('/api/v1/todos', async (_, reply) => {
        try {
            const todos = await fastify.prisma.todo.findMany()
            if (todos.length === 0) {
                return reply.code(StatusNotFound).send(newApiResponse(StatusNotFound, 'items not found'))
            }

            return reply.send(newApiResponse(StatusOk, todos))
        } catch (e) {
            return reply
                .code(StatusInternalServerError)
                .send(newApiResponse(StatusInternalServerError, toError(e).message))
        }
    })
}
