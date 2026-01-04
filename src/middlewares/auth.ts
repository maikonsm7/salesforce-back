import type { FastifyInstance } from "fastify";
import { UnauthorizedError } from "../routes/_errors/unauthorization-error.js";
import fastifyPlugin from "fastify-plugin";
import { prisma } from "../lib/prisma.js"

interface UserPayload {
    sub: string;
    email: string;
    role: string;
    companyId: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user: UserPayload;
    }
}

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
    app.addHook("preHandler", async (request) => {
        try {
            const userPayload = await request.jwtVerify<UserPayload>();
            const userData = await prisma.user.findUnique({
                where: {
                    id: userPayload.sub
                }
            })
            if (!userData?.active) {
                throw new UnauthorizedError('Usuário inativo');
            }
            request.user = userPayload;
        } catch {
            throw new UnauthorizedError('Token inválido ou expirado');
        }
    });
});