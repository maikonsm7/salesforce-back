import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function deleteGrantDate(app: FastifyInstance) {
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

            const existsGrantDate = await prisma.grantDate.findUnique({
                where: {
                    id,
                    createdById: currentUser.sub,
                },
            });

            if (!existsGrantDate) {
                throw new BadRequestError("Data de concessão não encontrada");
            }

            const deletedGrantDate = await prisma.grantDate.delete({
                where: {
                    id,
                }
            });
            return reply.status(200).send({ message: "Data de concessão removida com sucesso", grantDate: deletedGrantDate });
        });
}