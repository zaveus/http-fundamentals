import { createServer } from "node:http";

const server = createServer((request, response) =>{

    console.log("Method:", request.method);
    console.log("URL:", request.url);

    response.statusCode = 200;

    response.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
    );

    const data = {
        message: "Hello from my server"
    };

    response.end(JSON.stringify(data));


});


server.listen(4000, () => {
    console.log("Server listening on http://localhost:4000")

});

{/* node server.mjs */}

{/* In Powershell:
    curl.exe -i http://localhost:3000 */}