import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { auth } from "@/middlewares/auth.js";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function createClient(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post("/", {
        schema: {
            body: z.object({
                name: z.string().min(2),
                cpf: z.string().min(11).max(11),
                phone: z.string().min(10).max(11),
                observation: z.string().optional(),
            })
        },
    }, async (request, reply) => {
        const { name, cpf, phone, observation } = request.body;
        const currentUser = request.user;

        const existingClient = await prisma.client.findFirst({
            where: {
                cpf,
                companyId: currentUser.companyId,
            }
        });

        if(existingClient){
            throw new BadRequestError('Client with this CPF already exists!');
        }
        const newClient = await prisma.client.create({
            data: {
                name,
                cpf,
                phone,
                observation,
                companyId: currentUser.companyId,
                createdById: currentUser.sub,
            }
        });
        return reply.status(201).send({ message: "Client created successfully!", client: newClient });
        
    });
}