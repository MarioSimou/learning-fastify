import type { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/v1/todos', async (_, reply) => {
    const todos = await fastify.prisma.todo.findMany()
    if (todos.length === 0) {
      return reply.code(404).send({
        message: 'items not found',
      })
    }

    return reply.send({
      data: todos,
    })
  })
}
