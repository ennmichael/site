"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class MimeMap {
    constructor(defaultContentType) {
        this.defaultContentType = defaultContentType;
        this.addMapping = (extension, contentType) => {
            this.extensionToTypeMap.set(extension, contentType);
            return this;
        };
        this.getTypeForFile = (fileName) => this.extensionToTypeMap.get(path.extname(fileName)) || this.defaultContentType;
        this.extensionToTypeMap = new Map();
    }
}
MimeMap.defaultingTo = (contentType) => new MimeMap(contentType);
exports.MimeMap = MimeMap;
class Router {
    constructor(coreFiles, mimeMap) {
        this.coreFiles = coreFiles;
        this.mimeMap = mimeMap;
        this.allowAccessToFile = (fileNamePattern) => {
            this.allowedFilePatterns.push(new RegExp('/' + fileNamePattern));
            return this;
        };
        this.handleRequest = (url, response) => {
            if (url == '/') {
                serveFileFromWorkingDirectory(this.coreFiles.gameFile, 'text/html', response);
            }
            else if (url == '/favicon.ico') {
                serveFileFromWorkingDirectory('favicon.ico', 'image/x-icon', response);
            }
            else {
                this.tryServingRawFile(url, response);
            }
        };
        this.tryServingRawFile = (url, response) => {
            console.log(url);
            console.log(this.allowedFilePatterns.find((filePattern) => filePattern.test(url)));
            if (this.allowedFilePatterns.find((filePattern) => filePattern.test(url))) {
                this.serveFile(url, response);
            }
            else {
                this.serveFile(this.coreFiles.badRequestFile, response);
            }
        };
        this.serveFile = (fileName, response) => {
            serveFileFromWorkingDirectory(fileName, this.mimeMap.getTypeForFile(fileName), response);
        };
        this.allowedFilePatterns = [];
    }
}
exports.Router = Router;
const serveFileFromWorkingDirectory = (file, contentType, response) => {
    const onFileRead = (content) => {
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(content);
        response.end();
    };
    const onError = (err) => {
        console.log("Error reading file.");
        console.log(err);
        response.end();
    };
    const fileReadPromise = new Promise((resolve, reject) => {
        fs.readFile('./' + file, (err, content) => {
            if (err)
                reject(err);
            else
                resolve(content);
        });
    });
    fileReadPromise
        .then(onFileRead)
        .catch(onError);
};
