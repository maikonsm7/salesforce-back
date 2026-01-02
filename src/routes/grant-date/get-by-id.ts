import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getGrantDateById(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/:id", {
            schema: {
                params: z.object({
                    id: z.uuid(),
                }),
            },
        }, async (request, reply) => {
            const { id } = request.params as { id: string };
            const currentUser = request.user;

            if (currentUser.role === 'ADMIN' || 'MASTER') {
                const grantDate = await prisma.grantDate.findUnique({
                    where: {
                        id,
                        companyId: currentUser.companyId,
                    },
                    select: {
                        id: true,
                        date: true,
                        releaseDate: true,
                        createdAt: true,
                        updatedAt: true,
                        createdById: true,
                        clientId: true,
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
                if (!grantDate) {
                    throw new BadRequestError('Data de concessão não encontrada');
                }
                return reply.status(200).send({ grantDate });
            }

            const grantDate = await prisma.grantDate.findUnique({
                where: {
                    id,
                    companyId: currentUser.companyId,
                },
                select: {
                    id: true,
                    date: true,
                    releaseDate: true,
                    createdAt: true,
                    updatedAt: true,
                    clientId: true,
                    client: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            if (!grantDate) {
                throw new BadRequestError('Data de concessão não encontrada');
            }
            return reply.status(200).send({ grantDate });
        });
}