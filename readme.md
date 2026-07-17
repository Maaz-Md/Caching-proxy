# Caching Proxy 

A simple CLI tool from [caching-proxy](https://roadmap.sh/projects/caching-server) that starts a caching proxy server, 
it will forward requests to the actual server and cache the responses in memory. 
If the same request is made again, it will return the cached response instead of forwarding the request to the server.

## Prerequisites

- Node.js installed on your system.

## Installation

 ```bash
# clone the repository
git clone https://github.com/Maaz-Md/Caching-proxy.git

# Navigate to the project Directory
cd Caching-proxy

# Install dependencies
npm install

# Link the package globally:
npm link

 ```

## Usage
- **Start the proxy server**
```bash
caching-proxy --port 3000 --origin https://dummyjson.com
```

- **Example:** 
**Send a GET Request to  http://localhost:3000/products**

## Clearing Cache
```bash
caching-proxy --clear-cache
```
