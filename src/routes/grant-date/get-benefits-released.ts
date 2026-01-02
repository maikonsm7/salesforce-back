import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getBenefitsReleased(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/benefits-released", async (request, reply) => {
            const currentUser = request.user;

            const inicioDoDia = new Date();
            inicioDoDia.setUTCHours(0, 0, 0, 0);

            const fimDoDia = new Date();
            fimDoDia.setUTCHours(23, 59, 59, 999);

            const benefitsReleased = await prisma.grantDate.findMany({
                where: {
                    companyId: currentUser.companyId,
                    releaseDate: {
                        gte: inicioDoDia,
                        lte: fimDoDia,
                    },
                },
                select: {
                        id: true,
                        releaseDate: true,
                        clientId: true,
                        createdAt: true,
                        updatedAt: true,
                        client: {
                            select: {
                                name: true,
                            },
                        },
                    },
            });
            return reply.status(200).send({ benefitsReleased });
        });
}