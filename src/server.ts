import * as http from 'http';
import * as routing from './routing';

export const start = (port: number, router: routing.Router): void => {
    const onRequest = (request: http.IncomingMessage, response: http.ServerResponse) => {
        if (request.url)
            router.handleRequest(request.url, response);
    }
    
    http.createServer(onRequest).listen(port);
}
