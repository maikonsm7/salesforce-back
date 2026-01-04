import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function updateProduction(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .patch("/:id", {
            schema: {
                body: z.object({
                    consignado: z.coerce.number().optional(),
                    parcelado: z.coerce.number().optional(),
                    conta: z.coerce.number().optional(),
                    cartao: z.coerce.number().optional(),
                    lime: z.coerce.number().optional(),
                    chess: z.coerce.number().optional(),
                    microsseguro: z.coerce.number().optional(),
                    consorcio: z.coerce.number().optional(),
                    clientId: z.uuid(),
                }),
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

            const updatedProduction = await prisma.production.update({
                where: {
                    id,
                },
                data: {
                    ...request.body,
                },
            });
            return reply.status(200).send({ message: "Produção atualizada com sucesso", product: updatedProduction });
        });
}