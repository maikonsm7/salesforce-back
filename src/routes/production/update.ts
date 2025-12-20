import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function updateProduction(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .patch("/:id", {
            schema: {
                body: z.object({
                    consignado: z.coerce.number().optional(),
                    conta: z.coerce.number().optional(),
                    cartao: z.coerce.number().optional(),
                    lime: z.coerce.number().optional(),
                    chess: z.coerce.number().optional(),
                    microsseguro: z.number().optional(),
                }),
                params: z.object({
                    id: z.uuid(),
                }),
            },
        }, async (request, reply) => {
            const { id } = request.params as { id: string };
            const currentUser = request.user;

            if (currentUser.role === 'ADMIN') {
                throw new BadRequestError("Unauthorized!");
            }

            const existingProduction = await prisma.production.findUnique({
                where: {
                    id,
                    createdById: currentUser.sub,
                },
            });

            if (!existingProduction) {
                throw new BadRequestError("Product not found.");
            }

            const updatedProduction = await prisma.production.update({
                where: {
                    id,
                },
                data: {
                    ...request.body,
                },
            });
            return reply.status(200).send({ message: "Product updated successfully", product: updatedProduction });
        });
}