import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getUserById(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .get("/:id", {
        schema: {
            params: z.object({
                id: z.uuid(),
            }),
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user;
        
        const user = await prisma.user.findUnique({
            where: {
                id,
                companyId: currentUser.companyId
            },
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
                createdAt: true,
            }
        });
        if (!user) {
            throw new BadRequestError('Usuário não encontrado!');
        }
        return reply.status(200).send({ user });
    });
}