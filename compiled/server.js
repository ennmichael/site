"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
exports.start = (port, router) => {
    const onRequest = (request, response) => {
        if (request.url)
            router.handleRequest(request.url, response);
    };
    http.createServer(onRequest).listen(port);
};
