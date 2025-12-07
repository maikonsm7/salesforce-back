import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getProductionById(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
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
                        id
                    }
                });
                if (!production) {
                    throw new BadRequestError('Product not found.');
                }
                return reply.status(200).send({ production });
            }

            const production = await prisma.production.findUnique({
                where: {
                    id,
                    createdById: currentUser.sub
                }
            });
            if (!production) {
                throw new BadRequestError('Product not found.');
            }
            return reply.status(200).send({ production });
        });
}