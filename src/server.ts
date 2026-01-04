import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { appRoutes } from "./routes/index.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyJwt from "@fastify/jwt";
import { errorHandler } from "./error-handler.js";

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)
app.register(fastifyCors, {
    origin: (origin, cb) => {
        const allowed = (process.env.ORIGIN_URL || "").split(',');
        if (process.env.NODE_ENV === 'development') {
            allowed.push('http://localhost:3000', 'http://127.0.0.1:3000');
        }
        if (!origin || allowed.includes(origin)) {
            cb(null, true);
            return;
        }
        cb(new Error("Não permitido por CORS"), false);
    },
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 86400,
});
app.register(fastifyJwt, {
    secret: process.env.SECRET_JWT as string,
})

app.register(appRoutes, { prefix: "/api" })

app.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
    console.log('🚀 Http server running!')
})