import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getProductionById(app: FastifyInstance) {
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
                const production = await prisma.production.findUnique({
                    where: {
                        id,
                        companyId: currentUser.companyId,
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
                        updatedAt: true,
                        clientId: true,
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
                if (!production) {
                    throw new BadRequestError('Produção não encontrada');
                }
                return reply.status(200).send({ production });
            }

            const production = await prisma.production.findUnique({
                where: {
                    id,
                    createdById: currentUser.sub
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
                    clientId: true,
                    client: {
                        select: {
                            name: true,
                        }
                    }
                }
            });
            if (!production) {
                throw new BadRequestError('Produção não encontrada');
            }
            return reply.status(200).send({ production });
        });
}