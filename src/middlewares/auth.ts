import type { FastifyInstance } from "fastify";
import { UnauthorizedError } from "@/routes/_errors/unauthorization-error.js";
import fastifyPlugin from "fastify-plugin";

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
                request.user = userPayload;
            } catch {
                throw new UnauthorizedError('Invalid or missing token!');
            }
    });
});