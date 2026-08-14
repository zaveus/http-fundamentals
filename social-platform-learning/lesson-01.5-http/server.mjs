import { createServer } from "node:http";


const server = createServer((request,response) => {
    
    const url = new URL(request.url, "http://localhost"); 

    console.log("Method:", request.method);
    console.log("URL:", url.pathname);


    response.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
    );


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
        });

        try {
            
            const data = JSON.parse(body);
            const user = {
                id: 1,
                "username": data.username,
                "country": data.country
            };

            response.statusCode = 201;
            response.end(JSON.stringify(user));

        } catch {
            response.statusCode = 400;
            const data = {
                    "error": "Bad Request"
                };
            response.end(JSON.stringify(data));

        }

    }


    else {
        response.statusCode = 201; {/* 201 = Created */}
        response.end(JSON.stringify(user));
    }

});


server.listen(3000, () => {
    console.log("Server listening on http://localhost:3000")

});