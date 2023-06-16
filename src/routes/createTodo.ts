import type { FastifyInstance } from 'fastify'
import { newApiResponse, StatusCreated } from '../newApiResponse.js'

export default async function (fastify: FastifyInstance) {
  fastify.post('/api/v1/todos/:id', async (req, reply) => {
    const todoItem = await fastify.prisma.todo.create({
      // @ts-expect-error
      data: req.body,
    })

    reply.header('Location', `/api/v1/todos/${todoItem.id}`)
    return reply
      .code(StatusCreated)
      .send(newApiResponse(StatusCreated, todoItem))
  })
}
