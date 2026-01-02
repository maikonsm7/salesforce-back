import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";

export async function getProductionReport(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get("/", async (request, reply) => {
            const currentUser = request.user;
            let productions = [];
            let report = {
                consignado: 0,
                parcelado: 0,
                conta: 0,
                cartao: 0,
                lime: 0,
                chess: 0,
                microsseguro: 0,
                consorcio: 0,
            };

            if (['MASTER', 'ADMIN'].includes(currentUser.role)) {
                productions = await prisma.production.findMany({
                    where: {
                        companyId: currentUser.companyId,
                    },
                });
            }else{
                productions = await prisma.production.findMany({
                where: {
                    createdById: currentUser.sub,
                },
            });
            }

            productions.forEach((production) => {
                report.consignado += production.consignado || 0;
                report.parcelado += production.parcelado || 0;
                report.conta += production.conta || 0;
                report.cartao += production.cartao || 0;
                report.lime += production.lime || 0;
                report.chess += production.chess || 0;
                report.microsseguro += production.microsseguro || 0;
                report.consorcio += production.consorcio || 0;
            });

            return reply.status(200).send({ report });
        });
}