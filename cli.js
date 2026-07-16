const startServer = require("./index.js");

const args = process.argv.slice(2);

const config = {};

const Usage = "Usage: caching-proxy --port <number> --origin <url>";

function exitWithError(message) {
    console.error(`Error: ${message}`);
    console.error(Usage);
    process.exit(1);
}

for(let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--port") {

        if (config.port !== undefined) {
            exitWithError("Option '--port' specified more than once.")
        }
        
        const value = args[i+1];
        
        if (!value || value.startsWith("--")) {
            exitWithError("Missing value for --port");
        } 

        const port = Number(value);

        if (!Number.isInteger(port) || port <= 0 ) {
            exitWithError("Invalid value for '--port'. Expected a positive integer.")
        }

        config.port = port;

        i++;
        continue;
    }
    

    if (arg === "--origin") {
        
        
        if (config.origin !== undefined) {
            exitWithError("Option '--origin' specified more than once.")
        }

        const value = args[i+1];

        if (!value || value.startsWith("--")) {
            exitWithError("Missing value for --origin");
        }

        try {
            new URL(value);
        } catch {
            exitWithError("Invalid value for '--origin'. Expected a valid URL.");
        }

        config.origin = value;

        i++;
        continue;
    }

    exitWithError(`unknown option ${arg}`);

}

if (!config.port) {
    exitWithError("Missing required option '--port'.");
}

if (!config.origin) {
    exitWithError("Missing required option '--origin'.");
}


startServer(config)