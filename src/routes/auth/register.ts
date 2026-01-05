import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { hash } from "bcryptjs";
import { BadRequestError } from "../_errors/bad-request-error.js";
import randomPass from "../../helpers/random-pass.js";
import sendEmail from "../../helpers/send-email.js";

export async function register(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().post("/register", {
        schema: {
            body: z.object({
                name: z.string(),
                nameUser: z.string(),
                cnpj: z.string().min(14).max(14),
                phone: z.string(),
                email: z.email(),
            })
        },
    }, async (request, reply) => {
        const { name, nameUser, cnpj, phone, email } = request.body;

        // validations
        const existingCompany = await prisma.company.findUnique({
            where: {
                cnpj,
            }
        });
        if (existingCompany) {
            throw new BadRequestError("CNPJ já em uso");
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (existingUser) {
            throw new BadRequestError("Email já em uso");
        }

        // create company and user
        const newCompany = await prisma.company.create({
            data: {
                name,
                cnpj,
                phone,
            }
        });

        const password = randomPass(nameUser);
        const hashedPassword = await hash(password, 6);
        await prisma.user.create({
            data: {
                name: nameUser,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                companyId: newCompany.id,
            }
        });
        await sendEmail({
            to: email,
            subject: 'Bem vindo(a)!',
            text: 'Olá ' + nameUser + '!\nSeu cadastro foi efetuado com sucesso.\n\nSua senha temporária é: ' + password + '\n\nAcesse: salesforce.maikonsm.com.br',
        });

        return reply.status(201).send({ message: "Cadastro efetuado com sucesso" });
    });
}