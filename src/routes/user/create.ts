import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { hash } from "bcryptjs";

export async function createUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .post("/", {
        schema: {
            body: z.object({
                name: z.string().min(2),
                email: z.email(),
            })
        },
    }, async (request, reply) => {
        const { name, email } = request.body;
        const currentUser = request.user;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if(existingUser){
            throw new BadRequestError('Email em uso!');
        }

        const firstName = name.split(' ')[0]
        const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        const newPass = `${firstName}${randomNumbers}`
        const hashedPassword = await hash(newPass, 6)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ATTENDANT',
                companyId: currentUser.companyId,
            }
        });
        console.log(newPass)
        return reply.status(201).send({ message: "Usuário criado com sucesso!"});
        
    });
}