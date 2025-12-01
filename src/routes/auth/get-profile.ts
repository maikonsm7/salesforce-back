import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {prisma} from "@/lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { auth } from "@/middlewares/auth.js";

export async function getProfile(app: FastifyInstance) {
    
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get("/profile", async (request, reply) => {
        const userId = await request.getCurrentUserId();
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        if(!user){
            throw new BadRequestError('User not found!');
        }

        return reply.status(200).send({user});
    });
}