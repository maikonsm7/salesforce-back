import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma.js";
import z from "zod";

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
                    return reply.status(200).send()
                }

                const {id: code} = await prisma.token.create({
                    data: {
                        userId: user.id,
                    }
                })

                // send email with link to reset password
                console.log('Recover password link: ', code);
                return reply.status(201).send();
            });
}