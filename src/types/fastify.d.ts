import 'fastify'
import type { PrismaClient, Prisma } from '@prisma/client'
import { JwksClient } from 'jwks-rsa'

declare module 'fastify' {
    import type { FastifyRequest, FastifyReply } from 'fastify'

    export interface FastifyInstance {
        prisma: PrismaClient
        jwksClient: JwksClient
    }
}
