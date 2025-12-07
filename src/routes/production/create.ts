import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";

export async function createProduction(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post("/", {
        schema: {
            body: z.object({
                consignado: z.number().optional(),
                conta: z.number().optional(),
                cartao: z.number().optional(),
                lime: z.number().optional(),
                chess: z.number().optional(),
                microsseguro: z.number().optional(),
                clientId: z.uuid(),
            })
        },
    }, async (request, reply) => {
        const currentUser = request.user; 
        const newProduction = await prisma.production.create({
            data: {
                ...request.body,
                createdById: currentUser.sub,
                companyId: currentUser.companyId,
            }
        });
        return reply.status(201).send({ message: "Product created successfully!", product: newProduction });
        
    });
}