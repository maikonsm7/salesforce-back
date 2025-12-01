import type { FastifyInstance } from "fastify";
// auth routes
import { register } from "./auth/register.js";
import { login } from "./auth/login.js";
import { getProfile } from "./auth/get-profile.js";
import { passwordRecover } from "./auth/password-recover.js";
import { passwordReset } from "./auth/password-reset.js";

// client routes
import { createClient } from "./client/create.js";
import { getById } from "./client/get-by-id.js";
import { getAll } from "./client/get-all.js";
import { updateClient } from "./client/update.js";

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

    // client routes group
    app.register(async clientGroup => {
        clientGroup.register(createClient);
        clientGroup.register(getById);
        clientGroup.register(getAll);
        clientGroup.register(updateClient);
    }, {prefix: '/clients'});
    
}