import Fastify, { errorCodes } from "fastify";

let users = [
    {
        id: 1,
        username: "rafael",
        country: "PH"
    },
    {
        id: 3,
        username: "maria",
        country: "PH"
    },
    {
        id: 4,
        username: "alex",
        country: "US"
    },
    {
        id: 2,
        username: "john",
        country: "US"
    },
    {
        id: 5,
        username: "kory",
        country: "US"
    }
];

const fastify = Fastify({
    logger: true
});

fastify.get("/hello", async (request, reply) => {
    return {
        message: "Hello World!"
    };

});

fastify.get("/users", {
    schema: {
        querystring: {
            type: "object",
            properties: {
                country: {
                    type: "string",
                    minLength: 1
                },
                limit: {
                    type: "integer",
                    minimum: 1
                }
            }
        }
    }
}, async (request,reply) => {
    const limit = request.query.limit;
    const country = request.query.country;
    let outUsers = users;
    if (country) {
        outUsers = users.filter(user => user.country === country);
    }

    if (limit !== undefined) {
        return outUsers.slice(0,limit);
    }
    return outUsers;
});

fastify.get("/users/:id", {
    schema: {
        params: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "integer",
                    minimum: 1
                }
            }
        }
    }
}, async (request,reply) => {
    console.log(request.params);
    const userFound =  users.find(
        user => user.id === request.params.id
    );
    return userFound
        ? userFound 
        : reply.code(404).send({
            error: "No user found"
        });
    
});

fastify.get("/health", async (request, reply) => {
    return {
        status: "ok"
    };

});

fastify.post("/test-schema", {
    schema: {
        body: {
            type: "object",
            required: ["username", "country"],
            additionalProperties: false,
            properties: {
                username: {
                    type: "string",
                    minLength: 1
                },
                country: {
                    type: "string",
                    minLength: 1
                }
            }
        }
    }
}, async (request, reply) => {
    return {
        received: request.body
    };
});

fastify.get("/test-query", {
    schema: {
        querystring: {
            type: "object",
            properties: {
                country: {
                    type: "string"
                },
                limit: {
                    type: "integer",
                    minimum: 1
                }
            }
        }
    }
}, async (request, reply) => {
    console.log(request.query);
    console.log(typeof request.query.limit);

    return request.query;
});

fastify.get("/test-params/:id", {
    schema: {
        params: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "integer",
                    minimum: 1
                }
            }
        }
    }
}, async (request, reply) => {
    console.log(request.params);
    console.log(typeof request.params.id);

    return {
        id: request.params.id
    };
});

fastify.post("/users",{
    schema: {
        body: {
            type: "object",
            required: ["username", "country"],
            additionalProperties: false,
            properties: {
                username: {
                    type: "string",
                    minLength: 1
                },
                country: {
                    type: "string",
                    minLength: 1
                }
            }
        }
    }
}, async (request, reply) => {
    console.log(request.body);

    const body = request.body;

    let newId = 1;
    while ((users.find(user => user.id === newId))) {
        newId++;
    }

    const user = {
        id: newId,
        username : body.username,
        country : body.country
    };

    users.push(user);
    reply.code(201);
    return user;
});

fastify.setErrorHandler((error, request, reply) => {
    console.log("ERROR CODE:", error.code);
    console.log("VALIDATION:", error.validation);
    console.log("STATUS:", error.statusCode);

    return reply.code(error.statusCode || 500).send({
        error: error.message
    });
});

fastify.get("/test-error", async (request, reply) => {
    throw new Error("Something exploded");
});

try {
    await fastify.listen({
        port: 3000
    });

} catch (error) {
    fastify.log.error(error);
    process.exit(1);

};