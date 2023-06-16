import type { FastifyInstance } from 'fastify'
import { StatusNotFound, newApiResponse, StatusOk } from '../newApiResponse.js'

export default async function (fastify: FastifyInstance) {
  fastify.delete('/api/v1/todos/:id', async (req, reply) => {
    // @ts-expect-error
    const { id } = req.params

    const todoItem = await fastify.prisma.todo.delete({
      where: {
        id: id,
      },
    })
    if (!todoItem) {
      return reply
        .code(StatusNotFound)
        .send(newApiResponse(StatusNotFound, 'Todo item not found'))
    }

    return reply.send(newApiResponse(StatusOk, todoItem))
  })
}
