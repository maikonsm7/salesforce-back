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
app.register(fastifyCors);
app.register(fastifyJwt, {
    secret: process.env.SECRET_JWT as string,
})

app.register(appRoutes)

app.listen({port: 3001}).then(()=>{
    console.log('🚀 Http server running!')
})