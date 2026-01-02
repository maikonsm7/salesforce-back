import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getAllAlerts(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/", async (request, reply) => {
            const currentUser = request.user;

            const alerts = await prisma.alert.findMany({
                where: {
                    createdById: currentUser.sub,
                },
                orderBy: {
                    createdAt: 'desc',
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