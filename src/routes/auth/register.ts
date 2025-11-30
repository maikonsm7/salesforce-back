import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {prisma} from "@/lib/prisma.js";
import { hash } from "bcryptjs";

export async function register(app: FastifyInstance) {
    
    app.withTypeProvider<ZodTypeProvider>().post("/register", {
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

        // validations
        const existingCompany = await prisma.company.findUnique({
            where: {
                cnpj,
            }
        });
        if(existingCompany){
            return reply.status(400).send({ message: "Company with this CNPJ already exists!" });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        if(existingUser){
            return reply.status(400).send({ message: "Email already exists!" });
        }

        // create user and company
        const hashedPassword = await hash(password, 6);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
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