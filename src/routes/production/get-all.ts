import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";

export async function getAllProductions(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get("/", async (request, reply) => {
        const currentUser = request.user;

        if(currentUser.role === 'ADMIN' || 'MASTER'){
        const productions = await prisma.production.findMany({
            where: {
                companyId: currentUser.companyId,
            }
        });
        return reply.status(200).send({ productions });    
        }

        const productions = await prisma.production.findMany({
            where: {
                createdById: currentUser.sub,
                companyId: currentUser.companyId,
            }
        });
        return reply.status(200).send({ productions });    
    });
}