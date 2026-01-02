import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getAlertById(app: FastifyInstance) {
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

            const alert = await prisma.alert.findUnique({
                where: {
                    id,
                    createdById: currentUser.sub,
                },
                select: {
                    id: true,
                    date: true,
                    description: true,
                    clientId: true,
                    client: {
                        select: {
                            name: true,
                        }
                    },
                },
            });
            if (!alert) {
                throw new BadRequestError('Alerta não encontrado');
            }
            return reply.status(200).send({ alert });
        });
}