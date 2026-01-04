import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function updateClient(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .patch("/:id", {
            schema: {
                body: z.object({
                    name: z.string().min(1),
                    cpf: z.string().min(11).max(14),
                    phone: z.string().min(10).max(15),
                }),
                params: z.object({
                    id: z.uuid(),
                }),
            },
        }, async (request, reply) => {
            const { id } = request.params as { id: string };
            const { cpf } = request.body;
            const currentUser = request.user;
            const existingClient = await prisma.client.findFirst({
                where: {
                    id,
                    companyId: currentUser.companyId,
                },
            });

            if (!existingClient) {
                throw new BadRequestError("Cliente não encontrado");
            }

            const cpfInUse = await prisma.client.findFirst({
                where: {
                    cpf,
                    companyId: currentUser.companyId,
                    id: {
                        not: id,
                    },
                },
            });

            if (cpfInUse) {
                throw new BadRequestError("CPF já em uso");
            }

            const updatedClient = await prisma.client.update({
                where: {
                    id,
                },
                data: {
                    ...request.body,
                },
            });
            return reply.status(200).send({ message: "Cliente atualizado com sucesso", client: updatedClient });
        });
}