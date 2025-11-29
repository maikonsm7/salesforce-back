import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {prisma} from '../../lib/prisma.js'

export async function register(app: FastifyInstance) {
    
    app.withTypeProvider<ZodTypeProvider>().post("/register", {
        onRequest:[
            (req, res, next)=>{
                console.log('middlewere route: auth -> register');
                next()
            }
        ],
        schema: {
            body: z.object({
                name: z.string(),
                cnpj: z.string().min(14).max(14),
            })
        },
    }, async (request, reply) => {
        const { name, cnpj } = request.body;
        const newCompany = await prisma.company.create({
            data: {
                name,
                cnpj,
            }
        });
        return reply.status(201).send({ message: "Company created!" });
    });
}