import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  return fastify.get('/api/v1/ping', (_, reply) => {
    return reply.send('pong')
  })
}
