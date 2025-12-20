import type { FastifyInstance } from "fastify";
import { auth } from "@/middlewares/auth.js";

// auth routes
import { register } from "./auth/register.js";
import { login } from "./auth/login.js";
import { getProfile } from "./auth/get-profile.js";
import { passwordRecover } from "./auth/password-recover.js";
import { passwordReset } from "./auth/password-reset.js";

// user routes
import { createUser } from "./user/create.js";
import { getUserById } from "./user/get-by-id.js";
import { getAllUsers } from "./user/get-all.js";
import { updateUser } from "./user/update.js";

// client routes
import { createClient } from "./client/create.js";
import { getClientById } from "./client/get-by-id.js";
import { getAllClients } from "./client/get-all.js";
import { updateClient } from "./client/update.js";

// production routes
import { createProduction } from "./production/create.js";
import { getProductionById } from "./production/get-by-id.js";
import { getAllProductions } from "./production/get-all.js";
import { updateProduction } from "./production/update.js";

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

    // user routes group
    app.register(async userGroup => {
        userGroup.register(auth);
        userGroup.register(createUser);
        userGroup.register(getUserById);
        userGroup.register(getAllUsers);
        userGroup.register(updateUser);
    }, {prefix: '/users'});

    // client routes group
    app.register(async clientGroup => {
        clientGroup.register(createClient);
        clientGroup.register(getClientById);
        clientGroup.register(getAllClients);
        clientGroup.register(updateClient);
    }, {prefix: '/clients'});

    // production routes group
    app.register(async productionGroup => {
        productionGroup.register(createProduction)
        productionGroup.register(getProductionById)
        productionGroup.register(getAllProductions)
        productionGroup.register(updateProduction)
    }, {prefix: 'productions'})
    
}