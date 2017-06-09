"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var typescript_map_1 = require("typescript-map");
var MimeMap = (function () {
    function MimeMap(defaultContentType) {
        var _this = this;
        this.defaultContentType = defaultContentType;
        this.addMapping = function (extension, contentType) {
            _this.extensionToTypeMap.set(extension, contentType);
            return _this;
        };
        this.getTypeForFile = function (fileName) { return _this.extensionToTypeMap.get(path.extname(fileName)) || _this.defaultContentType; };
        this.extensionToTypeMap = new typescript_map_1.TSMap();
    }
    MimeMap.defaultingTo = function (contentType) { return new MimeMap(contentType); };
    return MimeMap;
}());
exports.MimeMap = MimeMap;
var Router = (function () {
    function Router(coreFiles, mimeMap) {
        var _this = this;
        this.coreFiles = coreFiles;
        this.mimeMap = mimeMap;
        this.allowAccessToFile = function (fileNamePattern) {
            _this.allowedFilePatterns.push(new RegExp('/' + fileNamePattern));
            return _this;
        };
        this.handleRequest = function (url, response) {
            if (url == '/') {
                serveFileFromWorkingDirectory(_this.coreFiles.gameFile, 'text/html', response);
            }
            else if (url == '/favicon.ico') {
                serveFileFromWorkingDirectory('favicon.ico', 'image/x-icon', response);
            }
            else {
                _this.tryServingRawFile(url, response);
            }
        };
        this.tryServingRawFile = function (url, response) {
            if (_this.isFileAllowed(url)) {
                _this.serveFile(url, response);
            }
            else {
                _this.serveFile(_this.coreFiles.badRequestFile, response);
            }
        };
        this.isFileAllowed = function (filename) {
            for (var _i = 0, _a = _this.allowedFilePatterns; _i < _a.length; _i++) {
                var pattern = _a[_i];
                if (pattern.test(filename))
                    return true;
            }
            return false;
        };
        this.serveFile = function (fileName, response) {
            serveFileFromWorkingDirectory(fileName, _this.mimeMap.getTypeForFile(fileName), response);
        };
        this.allowedFilePatterns = [];
    }
    return Router;
}());
exports.Router = Router;
var serveFileFromWorkingDirectory = function (file, contentType, response) {
    var onFileRead = function (content) {
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(content);
        response.end();
    };
    var onError = function (err) {
        console.log("Error reading file.");
        console.log(err);
        response.end();
    };
    fs.readFile('./' + file, function (err, content) {
        if (err) {
            onError(err);
        }
        else {
            onFileRead(content);
        }
    });
};
