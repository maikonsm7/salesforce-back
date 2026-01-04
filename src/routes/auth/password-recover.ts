import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "src/lib/prisma.js";
import z from "zod";
import sendEmail from "src/helpers/send-email.js";

export async function passwordRecover(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>()
        .post("/password-recover", {
            schema: {
                body: z.object({
                    email: z.email(),
                }),
            },
        },
            async (request, reply) => {
                const { email } = request.body;

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                });

                if (!user) {
                    return reply.status(201).send({message: 'Email enviado com sucesso'});
                }

                const {id: code} = await prisma.token.create({
                    data: {
                        userId: user.id,
                    }
                })

                await sendEmail({
                    to: user.email,
                    subject: 'Recuperação de senha',
                    text: `Olá ${user.name}, clique no link para recuperar sua senha: ${process.env.SITE_URL}/password-reset/${code}`,
                    });

                return reply.status(201).send({message: 'Email enviado com sucesso'});
            });
}