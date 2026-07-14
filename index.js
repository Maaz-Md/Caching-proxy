const express = require("express");

// function to remove content-encoding header 
function getFilteredHeaders(headers) {
    const filteredHeaders = {};

    headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();

        if(lowerKey !== "content-encoding") {
            filteredHeaders[key] = value;
        }
    })

    return filteredHeaders;
}

function startServer({ port, origin }) {

    const app = express();

    const cache = new Map();

    app.get("/:resource", async (req, res) => {

        try {
            
            const { resource } = req.params;

            if (cache.has(resource)) {
                
                console.log("Cache Hit");

                const cachedResponse = cache.get(resource);
                
                for (const [key, value] of Object.entries(cachedResponse.headers)) {
                    res.setHeader(key, value);
                }

                // custom header 
                res.setHeader("X-Cache", "HIT");

                return res.json(cachedResponse.body);
            }

            console.log("Cache Miss");


            // fetch from origin server
            const response = await fetch(`${origin}/${resource}`);


            if (!response.ok) {

                const error = await response.json();
                
                return res.status(response.status).json(error);
            }

            // converts JSON to js object
            const body = await response.json();

            const filteredHeaders = getFilteredHeaders(response.headers);

            const responseToCache = {
                headers: filteredHeaders,
                body
            }

            //Caches response
            cache.set(resource, responseToCache);

            //forward headers to client
            for (const [key, value] of Object.entries(filteredHeaders)) {
                res.setHeader(key, value);
            }

            // custom header
            res.setHeader("X-Cache", "MISS");

            res.json(body);


        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Something went wrong."
            });
        }
    });

    app.listen(port, () => {
        console.log(`Proxy Server is running on  http://localhost:${port}`);
    });

}

module.exports = startServer;
