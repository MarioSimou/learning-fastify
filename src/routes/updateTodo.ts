import type { FastifyInstance } from 'fastify'
import { StatusNotFound, newApiResponse, StatusOk } from '../newApiResponse.js'

export default async function (fastify: FastifyInstance) {
  fastify.put('/api/v1/todos/:id', async (req, reply) => {
    // @ts-ignore
    const { id } = req.params
    const todoItem = fastify.prisma.todo.update({
      where: { id: id },
      // @ts-expect-error
      data: req.body,
    })
    if (!todoItem) {
      return reply
        .code(StatusNotFound)
        .send(newApiResponse(StatusNotFound, 'Todo item not found'))
    }
    return reply.send(newApiResponse(StatusOk, todoItem))
  })
}
