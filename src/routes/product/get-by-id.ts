import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function getProductById(app: FastifyInstance){
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
        const product = await prisma.product.findFirst({
            select: {
                id: true,
                name: true,
                qty: true,
                price: true,
            }
        });
        if(!product){  
            throw new BadRequestError('Product not found.');
        }
        
        return reply.status(200).send({ product });
    });
}