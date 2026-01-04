import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function completeAlert(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .patch("/complete/:id", {
            schema: {
                params: z.object({
                    id: z.uuid(),
                }),
            },
        }, async (request, reply) => {
            const { id } = request.params as { id: string };
            const currentUser = request.user;

            const existsAlert = await prisma.alert.findUnique({
                where: {
                    id,
                    createdById: currentUser.sub,
                },
            });

            if (!existsAlert) {
                throw new BadRequestError("Alerta não encontrado");
            }

            const updatedAlert = await prisma.alert.update({
                where: {
                    id,
                },
                data: {
                    completed: true,
                },
            });
            return reply.status(200).send({ message: "Alerta concluído com sucesso", alert: updatedAlert });
        });
}