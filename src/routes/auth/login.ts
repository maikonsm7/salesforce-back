import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.js";
import { compare } from "bcryptjs";
import { BadRequestError } from "../_errors/bad-request-error.js";

export async function login(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().post("/login", {
        /* onRequest:[
            (req, res, next)=>{
                console.log('middlewere route: auth -> login');
                next()
            }
        ], */
        schema: {
            body: z.object({
                email: z.email(),
                password: z.string().min(6),
            })
        },
    }, async (request, reply) => {
        const { email, password } = request.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
                password: true,
                companyId: true,
                company: {
                    select: {
                        name: true,
                    }
                },
            }
        });

        if (!user) {
            throw new BadRequestError("Email ou senha inválidos");
        }

        if (!user.active) {
            throw new BadRequestError("Usuário inativo");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestError("Email ou senha inválidos");
        }

        const token = await reply.jwtSign({
            sub: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        }, {
            sign: { expiresIn: "1d" }
        });

        const dataUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            company: {
                name: user.company.name,
            },
        }

        return reply.status(200).send({ message: "Usuário autenticado", token, user: dataUser });
    });
}