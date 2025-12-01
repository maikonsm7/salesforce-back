import type { FastifyInstance } from "fastify";
// auth routes
import { register } from "./auth/register.js";
import { login } from "./auth/login.js";
import { getProfile } from "./auth/get-profile.js";
import { passwordRecover } from "./auth/password-recover.js";
import { passwordReset } from "./auth/password-reset.js";

export async function appRoutes(app: FastifyInstance){

    // auth routes group
    app.register(async authGroup => {
        
        /* authGroup.addHook('onRequest', (request, reply, next) => {
            console.log('middlewere group: auth');
            next()
        }) */

        authGroup.register(register)
        authGroup.register(login)
        authGroup.register(getProfile)
        authGroup.register(passwordRecover)
        authGroup.register(passwordReset)

    }, {prefix: '/auth'})
    
}