import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { compare, hash } from "bcryptjs";
import z from "zod";
import { prisma } from "src/lib/prisma.js";
import { auth } from "src/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function passwordUpdate(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch("/password-update", {
            schema: {
                body: z.object({
                    password: z.string().min(6),
                    newPassword: z.string().min(6),
                }),
            },
        },
            async (request, reply) => {
                const { password, newPassword } = request.body;
                const currentUser = request.user

                const user = await prisma.user.findUnique({
                    where: {
                        id: currentUser.sub,
                    }
                });

                if (!user) {
                    throw new BadRequestError('Usuário não encontrado.');
                }

                const isPasswordValid = await compare(password, user.password);
                if (!isPasswordValid) {
                    throw new BadRequestError("Senha atual inválida");
                }

                const hashedPassword = await hash(newPassword, 6);
                await prisma.user.update({
                    where: {
                        id: currentUser.sub,
                    },
                    data: {
                        password: hashedPassword,
                    },
                });

                return reply.status(200).send({ message: "Senha alterada com sucesso" });
            });
}