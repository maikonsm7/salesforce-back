import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function deleteProduction(app: FastifyInstance) {
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

            const existingProduction = await prisma.production.findUnique({
                where: {
                    id,
                    companyId: currentUser.companyId,
                },
            });

            if (!existingProduction) {
                throw new BadRequestError("Produção não encontrada");
            }

            const deletedProduction = await prisma.production.delete({
                where: {
                    id,
                }
            });
            return reply.status(200).send({ message: "Produção removida com sucesso", product: deletedProduction });
        });
}