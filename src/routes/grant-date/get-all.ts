import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getAllGrantDates(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/", async (request, reply) => {
            const currentUser = request.user;

            if (['MASTER', 'ADMIN'].includes(currentUser.role)) {
                const grantDates = await prisma.grantDate.findMany({
                    where: {
                        companyId: currentUser.companyId,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        id: true,
                        date: true,
                        createdAt: true,
                        updatedAt: true,
                        createdById: true,
                        createdBy: {
                            select: {
                                name: true,
                            },
                        },
                        client: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });
                return reply.status(200).send({ grantDates });
            }

            const grantDates = await prisma.grantDate.findMany({
                where: {
                    companyId: currentUser.companyId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                        id: true,
                        date: true,
                        createdAt: true,
                        updatedAt: true,
                        client: {
                            select: {
                                name: true,
                            },
                        },
                    },
            });
            return reply.status(200).send({ grantDates });
        });
}