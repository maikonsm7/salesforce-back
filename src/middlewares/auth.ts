import type { FastifyInstance } from "fastify";
import { UnauthorizedError } from "@/routes/_errors/unauthorization-error.js";
import fastifyPlugin from "fastify-plugin";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
    app.addHook("preHandler", async (request) => {
        request.getCurrentUserId = async () => {
            try {
                const { sub } = await request.jwtVerify<{ sub: string }>();
                return sub;
            } catch {
                throw new UnauthorizedError('Invalid token!');
            }
        };
    });
});