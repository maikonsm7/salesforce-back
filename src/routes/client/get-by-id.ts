import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getClientById(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get("/:id", {
        schema: {
            params: z.object({
                id: z.uuid(),
            }),
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = await request.getCurrentUserId();
        const company = await prisma.company.findUnique({
            where: {
                userId,
            },
        });
        if (!company) {
            throw new BadRequestError('Company not found!');
        }
        const client = await prisma.client.findFirst({
            where: {
                id,
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
        if (!client) {
            throw new BadRequestError('Client not found!');
        }
        return reply.status(200).send({ client });
    });
}