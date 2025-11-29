import type { FastifyInstance } from "fastify";
// auth routes
import { register } from "./auth/register.js";

export async function appRoutes(app: FastifyInstance){

    // auth routes group
    app.register(async authGroup => {
        
        authGroup.addHook('onRequest', (request, reply, next) => {
            console.log('middlewere group: auth');
            next()
        })

        authGroup.register(register)

    }, {prefix: '/auth'})
    
}