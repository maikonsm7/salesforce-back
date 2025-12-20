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
                conta: z.coerce.number().optional(),
                cartao: z.coerce.number().optional(),
                lime: z.coerce.number().optional(),
                chess: z.coerce.number().optional(),
                microsseguro: z.coerce.number().optional(),
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