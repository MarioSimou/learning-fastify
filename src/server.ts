import Fastify from 'fastify'
import { Logger } from './logger.js'
import autoload from '@fastify/autoload'
import { resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'

const getPath = (...args: string[]) => resolve(process.cwd(), ...args)

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const logger = new Logger()

const createServer = async () => {
  try {
    const fastify = Fastify({
      logger: true,
    })

    fastify.register(autoload, {
      dir: getPath('dist', 'routes'),
    })

    const prisma = new PrismaClient()
    fastify.decorate('prisma', prisma)

    await fastify.listen({ port })

    logger.info(`The app is listening on http://localhost:${port}`)
    console.info(fastify.printRoutes())
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

createServer()
