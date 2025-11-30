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
                phone: z.string(),
                email: z.email(),
                password: z.string().min(6),
            })
        },
    }, async (request, reply) => {
        const { name, cnpj, phone, email, password } = request.body;
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        });
        const newCompany = await prisma.company.create({
            data: {
                name,
                cnpj,
                phone,
                userId: newUser.id,
            }
        });
        return reply.status(201).send({ message: "Company created!" });
    });
}