import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getTodayAlerts(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/today-alerts", async (request, reply) => {
            const currentUser = request.user;

            // const inicioDoDia = new Date();
            // inicioDoDia.setUTCHours(0, 0, 0, 0);

            const fimDoDia = new Date();
            fimDoDia.setUTCHours(23, 59, 59, 999);

            const alerts = await prisma.alert.findMany({
                where: {
                    createdById: currentUser.sub,
                    completed: false,
                    date: {
                        // gte: inicioDoDia,
                        lte: fimDoDia,
                    },
                },
                select: {
                    id: true,
                    date: true,
                    description: true,
                    clientId: true,
                    client: {
                        select: {
                            name: true,
                        }
                    },
                }
            });
            return reply.status(200).send({ alerts });
        });
}