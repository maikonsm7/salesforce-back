import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";

export async function getAllProducts(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get("/", async (request, reply) => {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                qty: true,
                price: true,
            }
        });
        return reply.status(200).send({ products });
    });
}