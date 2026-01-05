import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { hash } from "bcryptjs";
import randomPass from "../../helpers/random-pass.js";

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

        const newPass = randomPass(name);
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