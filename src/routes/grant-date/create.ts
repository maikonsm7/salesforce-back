import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";

export async function createGrantDate(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .post("/", {
        schema: {
            body: z.object({
                date: z.coerce.date(),
                clientId: z.uuid(),
            })
        },
    }, async (request, reply) => {
        const currentUser = request.user; 
        const newGrantDate = await prisma.grantDate.create({
            data: {
                ...request.body,
                createdById: currentUser.sub,
                companyId: currentUser.companyId,
            }
        });
        return reply.status(201).send({ message: "Data de concessão inserida com sucesso", grantDate: newGrantDate });
        
    });
}