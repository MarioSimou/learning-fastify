import 'fastify'
import type { PrismaClient, Prisma } from '@prisma/client'

declare module 'fastify' {
    import type { FastifyRequest, FastifyReply } from 'fastify'

    export interface FastifyInstance {
        prisma: PrismaClient
        authenticate: (req: FastifyRequest, res: FastifyReply) => Promise<void>
    }
}
