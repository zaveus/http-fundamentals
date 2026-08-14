import { createServer } from "node:http";

const users = [
    {
        id: 1,
        username: "rafael",
        country: "PH"
    },
    {
        id: 2,
        username: "maria",
        country: "PH"
    },
    {
        id: 3,
        username: "alex",
        country: "US"
    }
];


const server = createServer((request, response) =>{
        response.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
    );

    const url = new URL(request.url, "http://localhost");  {/*Treat request.url as a path relative to http://localhost. */}

    console.log("Method:", request.method);
    console.log("URL:", url.pathname);



    if (
        request.method === "POST" &&
        url.pathname === "/users"
    ) {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;
        });

        request.on("end", () => {
            console.log("Raw body:", body);

            try {
                console.log(typeof body);
                const data = JSON.parse(body);
                response.statusCode = 201;

                if (data.username == null) {
                    const data = {
                        error: "Missing username"
                    };

                    response.statusCode = 400;
                    return response.end(JSON.stringify({
                        error: "Missing username"
                    }));
                }
                
                if (data.country == null) {

                    const data = {
                        error: "Missing country"
                    };
                    response.statusCode = 400;
                    return response.end(JSON.stringify({
                        error: "Missing username"
                    }));
                }

                const user = {
                    id: 1,
                    "username": data.username,
                    "country": data.country
                };

                response.end(JSON.stringify(user));

            } catch (error) {
                console.error("Parsing error:", error.message);
                console.error("Body received:", body);
                response.statusCode = 400;

                const data = {
                    error: "Bad Request"
                };

                response.end(JSON.stringify(data));
            };
        });
    }


    if (request.method === "GET") {
        
        const parts = url.pathname.split("/"); {/* localhost + /users + /id */}
        if (parts[1] === "users"){
            
            const country = url.searchParams.get("country");
            
            const idPart = parts[2];

            if (country){
                const limitString = url.searchParams.get("limit");
                const outUsers = users.filter(user => user.country == country);
                response.statusCode = 200;

                if (limitString !== null) {
                    const limit = Number(limitString);
                    
                    if (!Number.isInteger(limit) || limit < 1) {
                        response.statusCode = 400;

                        return response.end(JSON.stringify({
                            error: "Invalid limit"
                        }));
                    }
                    return response.end(JSON.stringify(outUsers.slice(0,limit)));
                }
                else {
                    return response.end(JSON.stringify(outUsers));
                }

            }
            if (idPart !== undefined) {
                const id = Number(idPart);

                if (!Number.isInteger(id)) {
                    response.statusCode = 400;

                    return response.end(JSON.stringify({
                        error: "Invalid user ID"
                    }));
                }

                const user = users.find(user => user.id === id);

                if (!user) {
                    response.statusCode = 404;

                    return response.end(JSON.stringify({
                        error: "User not found"
                    }));
                }

                response.statusCode = 200;
                return response.end(JSON.stringify(user));
            }
            else {
                response.statusCode = 200;
                response.end(JSON.stringify(users));
            }
        }

        

        else if (parts[1] === "hello") {

            response.statusCode = 200;

            const name = url.searchParams.get("name");
            const age = url.searchParams.get("age")

            let data = {};

            if (name && age) {
                data.message = `Hello, ${name}! You are ${age} years old.`;
            } else if (name) {
                data.message = `Hello, ${name}!`;
            }
            else {
                data.message = "Hello!"
            }

            response.end(JSON.stringify(data));
        }

        else if (parts[1] === "health") {
            response.statusCode = 200;
            const data = {
                    "status": "ok",
                    "uptime": process.uptime()
                };
                    response.end(JSON.stringify(data));
        }

        else {
            response.statusCode = 404;
            const data = {
                    "error": "Not Found"
                };
            response.end(JSON.stringify(data));

        }
    }

});


server.listen(3000, () => {
    console.log("Server listening on http://localhost:3000")

});




/* node server.mjs */

/* In Powershell:
    curl.exe -i http://localhost:3000 */


/*     request arrives
            ↓
        your code executes
            ↓
        status determined
            ↓
        headers added
            ↓
        body created
            ↓
        response ends
 */