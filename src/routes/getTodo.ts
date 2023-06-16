import type { FastifyInstance } from 'fastify'
import { newApiResponse, StatusNotFound, StatusOk } from '../newApiResponse.js'

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/v1/todos/:id', async (req, reply) => {
    // @ts-expect-error
    const { id } = req.params

    const todoItem = await fastify.prisma.todo.findFirst({ where: { id } })
    if (!todoItem) {
      return reply
        .code(StatusNotFound)
        .send(newApiResponse(StatusNotFound, 'Item not found'))
    }

    return reply.send(newApiResponse(StatusOk, todoItem))
  })
}
