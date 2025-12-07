import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";

export async function createProduct(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post("/", {
        schema: {
            body: z.object({
                name: z.string().min(2),
                qty: z.number().min(1),
                price: z.number().optional(),
            })
        },
    }, async (request, reply) => {
        const { name, qty, price } = request.body;
        
        const newProduct = await prisma.product.create({
            data: {
                name,
                qty,
                price,
            }
        });
        return reply.status(201).send({ message: "Product created successfully!", product: newProduct });
        
    });
}