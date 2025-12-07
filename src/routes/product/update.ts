import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function updateProduct(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch("/:id", {
        schema: {
            body: z.object({
                name: z.string().min(1).optional(),
                qty: z.number().int().optional(),
                price: z.number().optional(),
            }),
            params: z.object({
                id: z.uuid(),
            }),
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const existingProduct = await prisma.product.findFirst({
            where: {
                id,
            },
        });

        if (!existingProduct) {
            throw new BadRequestError("Product not found.");
        }
        
        const updatedProduct = await prisma.product.update({
            where: {
                id,
            },
            data: {
                ...request.body,
            },
        });
        return reply.status(200).send({ message: "Product updated successfully", product: updatedProduct });
    });
}