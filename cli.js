#!/usr/bin/env node

const startServer = require("./index.js");

const args = process.argv.slice(2);

const config = {
    clearCache: false
};

const server_usage = "Usage: `caching-proxy --port <number> --origin <url>`";
const clear_cache_usage =  "Usage: `caching-proxy --clear-cache`";

function exitWithError(message, Usage) {
    console.error(`Error: ${message}`);
    console.error(Usage);
    process.exit(1);
}

async function validateArguments() {
    

    for(let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg == "--clear-cache") {
            if (config.clearCache) {
                    exitWithError("Option '--clear-cache' specified more than once.", clear_cache_usage);
                }
            config.clearCache = true;
            continue;
        }

        if (arg === "--port") {

            //check for duplicate arguments
            if (config.port !== undefined) {
                exitWithError("Option '--port' specified more than once.", server_usage)
            }
            
            const value = args[i+1];
            
            //check if value is provided 
            if (!value || value.startsWith("--")) {
                exitWithError("Missing value for --port", server_usage);
            } 

            const port = Number(value);

            //check if value is a valid number
            if (!Number.isInteger(port) || port <= 0 ) {
                exitWithError("Invalid value for '--port'. Expected a positive integer.", server_usage)
            }

            config.port = port;

            //skip the port number 
            i++;

            continue;
        }
        

        if (arg === "--origin") {
            
            
            if (config.origin !== undefined) {
                exitWithError("Option '--origin' specified more than once.", server_usage)
            }

            const value = args[i+1];

            if (!value || value.startsWith("--")) {
                exitWithError("Missing value for --origin", server_usage);
            }

            try {
                new URL(value);
            } catch {
                exitWithError("Invalid value for '--origin'. Expected a valid URL.", server_usage);
            }

            config.origin = value;

            i++;

            continue;
        }

        //check for unknown argumetns
        console.error(`unknown option ${arg}`);
        process.exit(1);

    }

    if (config.clearCache) {
        try {
            const response = await  fetch("http://localhost:3000/cache", {
                method: "DELETE"
            })

            if (!response.ok) {
                console.error("Failed to clear cache");
                process.exit(1);
            }

            const data = await response.json();

            console.log(data.message);
            return;

        } catch {
            console.error( "Unable to connect to the caching proxy. Make sure it is running on port 3000.")
            process.exit(1);
        }
    }

    //check if port/origin is provided
    if (!config.port) {
        exitWithError("Missing required option '--port'.", server_usage);
    }

    if (!config.origin) {
        exitWithError("Missing required option '--origin'.", server_usage);
    }


    startServer({
        port: config.port,
        origin: config.origin,
    })

}

validateArguments();