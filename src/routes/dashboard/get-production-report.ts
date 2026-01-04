import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getProductionReport(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/", async (request, reply) => {
            const currentUser = request.user;

            const productions = await prisma.production.findMany({
                where: {
                    companyId: currentUser.companyId,
                },
            });

            return reply.status(200).send({ productions });
        });
}