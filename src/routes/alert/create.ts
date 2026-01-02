import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";

export async function createAlert(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .post("/", {
        schema: {
            body: z.object({
                date: z.coerce.date(),
                description: z.string(),
                clientId: z.uuid(),
            })
        },
    }, async (request, reply) => {
        const currentUser = request.user; 
        const newAlert = await prisma.alert.create({
            data: {
                ...request.body,
                createdById: currentUser.sub,
                companyId: currentUser.companyId,
            }
        });
        return reply.status(201).send({ message: "Alerta criado com sucesso", alert: newAlert });
        
    });
}