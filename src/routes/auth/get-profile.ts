import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {prisma} from "@/lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { auth } from "@/middlewares/auth.js";

export async function getProfile(app: FastifyInstance) {
    
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get("/profile", async (request, reply) => {
        const currentUser = request.user;
        const user = await prisma.user.findUnique({
            where: {
                id: currentUser.sub,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true,
            }
        });

        if(!user){
            throw new BadRequestError('Usuário não encontrado.');
        }

        return reply.status(200).send({user});
    });
}