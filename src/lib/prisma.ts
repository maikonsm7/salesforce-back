import dotenv from 'dotenv'
dotenv.config()
import { PrismaClient } from '../../generated/prisma/client.js'
const connectionString = `${process.env.DATABASE_URL}`

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString,
        },
    },
})

export { prisma }