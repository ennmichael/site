import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { TSMap } from 'typescript-map';

export interface CoreRouterFiles {
    badRequestFile: string;
    gameFile: string;
}

export class MimeMap {
    public static readonly defaultingTo = (contentType: string): MimeMap => new MimeMap(contentType);
    
    private constructor(private readonly defaultContentType: string) {
    }
    
    public readonly addMapping = (extension: string, contentType: string): MimeMap => {
        this.extensionToTypeMap.set(extension, contentType);
        return this;
    }
    
    public readonly getTypeForFile = (fileName: string): string => this.extensionToTypeMap.get(path.extname(fileName)) || this.defaultContentType;
    
    private readonly extensionToTypeMap = new TSMap<string, string>();
}

export class Router {    
    public constructor(private readonly coreFiles: CoreRouterFiles, private readonly mimeMap: MimeMap) {
    }
    
    public readonly allowAccessToFile = (fileNamePattern: string): Router => {
        this.allowedFilePatterns.push(new RegExp('/'+fileNamePattern));
        return this;
    }
    
    public readonly handleRequest = (url: string, response: http.ServerResponse): void => {
        if (url == '/') {
            serveFileFromWorkingDirectory(this.coreFiles.gameFile, 'text/html', response);
        } else if (url == '/favicon.ico') {
            serveFileFromWorkingDirectory('favicon.ico', 'image/x-icon', response);
        } else {
            this.tryServingRawFile(url, response);
        }
    }
    
    private readonly tryServingRawFile = (url: string, response: http.ServerResponse) => {
        if (this.isFileAllowed(url)) {
            this.serveFile(url, response);
        }
        else {
            this.serveFile(this.coreFiles.badRequestFile, response);
        }
    }
    
    private readonly isFileAllowed = (filename: string): boolean => {
        for (let pattern of this.allowedFilePatterns)
            if (pattern.test(filename)) return true;
        return false;
    }
    
    private readonly serveFile = (fileName: string, response: http.ServerResponse) => {
        serveFileFromWorkingDirectory(fileName, this.mimeMap.getTypeForFile(fileName), response)
    }
    
    private readonly allowedFilePatterns: RegExp[] = [];
}

const serveFileFromWorkingDirectory = (file: string, contentType: string, response: http.ServerResponse) => {
    const onFileRead = (content: Buffer): void => {
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(content);
        response.end();
    }
    
    const onError = (err: any): void => {
        console.log("Error reading file.");
        console.log(err);
        response.end();
    }
    
    fs.readFile('./'+file, (err, content) => {
        if (err) {
            onError(err);
        } else {
            onFileRead(content);
        }
    });
}
