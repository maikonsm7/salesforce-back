import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function updateClient(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch("/:id", {
        schema: {
            body: z.object({
                name: z.string().min(1).optional(),
                cpf: z.string().min(11).max(14).optional(),
                phone: z.string().min(10).max(15).optional(),
                observation: z.string().max(500).optional(),
            }),
            params: z.object({
                id: z.uuid(),
            }),
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = await request.getCurrentUserId();
        const {cpf} = request.body;
        
        const existingClient = await prisma.client.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingClient) {
            throw new BadRequestError("Client not found.");
        }

        const cpfInUse = await prisma.client.findFirst({
            where: {
                cpf,
                userId,
                id: {
                    not: id,
                },
            },
        });

        if (cpfInUse) {
            throw new BadRequestError("CPF already in use by another client.");
        }

        const updatedClient = await prisma.client.update({
            where: {
                id,
            },
            data: {
                ...request.body,
            },
        });
        return reply.status(200).send({ message: "Client updated successfully", client: updatedClient });
    });
}