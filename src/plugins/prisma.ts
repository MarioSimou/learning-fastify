import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'

async function prismaPlugin(fastify: FastifyInstance) {
    const prisma = new PrismaClient()
    fastify.decorate('prisma', prisma)

    fastify.addHook('onClose', async () => {
        await prisma.$disconnect()
    })
}

export default fp(prismaPlugin)
