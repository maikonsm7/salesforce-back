import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function updateUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .patch("/:id", {
            schema: {
                body: z.object({
                    name: z.string().min(2),
                    email: z.email(),
                }),
                params: z.object({
                    id: z.uuid(),
                }),
            },
        }, async (request, reply) => {
            const { id } = request.params as { id: string };
            const { email } = request.body;
            const currentUser = request.user;

            const existingUser = await prisma.user.findUnique({
                where: {
                    id,
                    companyId: currentUser.companyId,
                },
            });

            if (!existingUser) {
                throw new BadRequestError("Usuário não encontrado");
            }

            const emailInUse = await prisma.user.findUnique({
                where: {
                    email,
                    NOT: {
                        id
                    },
                },
            });

            if (emailInUse) {
                throw new BadRequestError("Email em uso");
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    ...request.body,
                },
            });
            return reply.status(200).send({ message: "Usuário atualizado com sucesso" });
        });
}