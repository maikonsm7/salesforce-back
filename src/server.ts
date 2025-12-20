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
    origin: process.env.ORIGIN_URL as string,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
});
app.register(fastifyJwt, {
    secret: process.env.SECRET_JWT as string,
})

app.register(appRoutes, {prefix: "/api"})

app.listen({port: 3000}).then(()=>{
    console.log('🚀 Http server running!')
})