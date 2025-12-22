import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getAllProductions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/", async (request, reply) => {
            const currentUser = request.user;

            if (['MASTER', 'ADMIN'].includes(currentUser.role)) {
                const productions = await prisma.production.findMany({
                    where: {
                        companyId: currentUser.companyId,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select: {
                        id: true,
                        consignado: true,
                        conta: true,
                        cartao: true,
                        lime: true,
                        chess: true,
                        microsseguro: true,
                        createdAt: true,
                        updatedAt: true,
                        createdById: true,
                        createdBy: {
                            select: {
                                name: true,
                            }
                        },
                        client: {
                            select: {
                                name: true,
                            }
                        }
                    }
                });
                return reply.status(200).send({ productions });
            }

            const productions = await prisma.production.findMany({
                where: {
                    createdById: currentUser.sub,
                    companyId: currentUser.companyId,
                },
                orderBy: {
                    createdAt: 'asc',
                },
                select: {
                    id: true,
                    consignado: true,
                    conta: true,
                    cartao: true,
                    lime: true,
                    chess: true,
                    microsseguro: true,
                    createdById: true,
                    createdAt: true,
                    client: {
                        select: {
                            name: true,
                        }
                    }
                }
            });
            return reply.status(200).send({ productions });
        });
}