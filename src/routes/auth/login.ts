import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {prisma} from "@/lib/prisma.js";
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
            }
        });

        if(!user){
            throw new BadRequestError("Invalid email or password!");
        }

        const isPasswordValid = await compare(password, user.password);

        if(!isPasswordValid){
            throw new BadRequestError("Invalid email or password!");
        }

        const token = await reply.jwtSign({
            sub: user.id,
            email: user.email,
            role: user.role,
        }, {
            sign: { expiresIn: "1d" }
        });

        return reply.status(200).send({ message: "Login successful!", token });
    });
}