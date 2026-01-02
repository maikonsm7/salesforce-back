import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function deleteAlert(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .delete("/:id", {
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
                throw new BadRequestError("Alerta não encontrado ou usuário sem permissão");
            }

            const deletedAlert = await prisma.alert.delete({
                where: {
                    id,
                }
            });
            return reply.status(200).send({ message: "Alerta removido com sucesso", alert: deletedAlert });
        });
}