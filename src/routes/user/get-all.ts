import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getAllUsers(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .get("/", async (request, reply) => {
        const currentUser = request.user;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: currentUser.sub
                },
                companyId: currentUser.companyId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                name: 'asc'
            }
        });
        return reply.status(200).send({ users });
    });
}