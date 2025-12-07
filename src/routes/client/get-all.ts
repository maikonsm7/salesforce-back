import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getAllClients(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get("/", async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const company = await prisma.company.findUnique({
            where: {
                userId,
            }
        });

        if(!company){
            throw new BadRequestError('Company not found!');
        }
        const clients = await prisma.client.findMany({
            where: {
                companyId: company.id,
            },
            select: {
                id: true,
                name: true,
                cpf: true,
                phone: true,
                observation: true,
            }
        });
        return reply.status(200).send({ clients });
    });
}