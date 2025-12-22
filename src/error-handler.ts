// src/error-handler.ts (Corrigido)
import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { UnauthorizedError } from "./routes/_errors/unauthorization-error.js";
import { BadRequestError } from "./routes/_errors/bad-request-error.js";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {

    if (error instanceof ZodError || (error as any).code === 'FST_ERR_VALIDATION') {

        let fieldErrors: Record<string, string[] | undefined> = {};

        if (error instanceof ZodError) {
            fieldErrors = error.flatten().fieldErrors;
        }

        else {

            const validationErrors = (error as any).validation || [];
            validationErrors.forEach((valError: any) => {

                const fieldName = valError.instancePath.replace('/', '');
                if (fieldName) {
                    fieldErrors[fieldName] = fieldErrors[fieldName] || [];

                    fieldErrors[fieldName]?.push(valError.message);
                }
            });
        }

        return reply.status(400).send({
            message: "Erro ao validar",
            errors: fieldErrors,
        });
    }

    
    if (error instanceof BadRequestError) {
        return reply.status(400).send({
            message: error.message,
        });
    }

    if (error instanceof UnauthorizedError) {
        return reply.status(401).send({
            message: error.message,
        });
    }

    
    console.error(error);

    return reply.status(500).send({
        message: "Internal server error.",
    });
}
