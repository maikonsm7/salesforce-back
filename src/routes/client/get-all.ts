import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getAllClients(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .get("/", async (request, reply) => {
        const currentUser = request.user;
        const clients = await prisma.client.findMany({
            where: {
                companyId: currentUser.companyId,
            },
            select: {
                id: true,
                name: true,
                cpf: true,
                phone: true,
            }
        });
        return reply.status(200).send({ clients });
    });
}