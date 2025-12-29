import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma.js";
import bcrypt from "bcryptjs";
import z from "zod";

export async function passwordReset(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>()
        .post("/password-reset", {
            schema: {
                body: z.object({
                    code: z.string(),
                    password: z.string().min(6),
                }),
            },
        },
            async (request, reply) => {
                const { code, password } = request.body;

                const token = await prisma.token.findUnique({
                    where: {
                        id: code,
                    },
                    select: {
                        userId: true,
                    }
                });

                if (!token) {
                    throw new Error('Código inválido ou expirado');
                }

                const hashedPassword = await bcrypt.hash(password, 6);

                await prisma.user.update({
                    where: {
                        id: token.userId,
                    },
                    data: {
                        password: hashedPassword,
                    }
                });

                await prisma.token.deleteMany({
                    where: {
                        userId: token.userId,
                    }
                });

                return reply.status(200).send({message: 'Senha cadastrada com sucesso'});
            });
}