import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../routes/_errors/unauthorization-error.js";

export const verifyRole = ((allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user;
        if(!user || !allowedRoles.includes(user.role)){
            throw new UnauthorizedError('Você não tem permissão para acessar este recurso');
        }
            
    }
});