"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
exports.start = function (port, router) {
    var onRequest = function (request, response) {
        if (request.url)
            router.handleRequest(request.url, response);
    };
    http.createServer(onRequest).listen(port);
};
