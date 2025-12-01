import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
export async function createClient(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post("/", {
        schema: {
            body: z.object({
                name: z.string().min(2),
                cpf: z.string().min(11).max(11),
                phone: z.string().min(10).max(11),
                observation: z.string().optional(),
                userId: z.string().min(1),
            })
        },
    }, async (request, reply) => {
        const { name, cpf, phone, observation } = request.body;
        const existingClient = await prisma.client.findUnique({
            where: {
                cpf,
            }
        });

        if(existingClient){
            return reply.status(400).send({ message: "Client with this cpf already exists!" });
        }
        const newClient = await prisma.client.create({
            data: {
                name,
                cpf,
                phone,
                observation,
                userId: request.user.sub,
            }
        });
        });

        return reply.status(201).send({ message: "Client created successfully!", client: newClient });
    });
}