import net from 'net';
import fs from 'fs';
import path from 'path';

/**
 * 
 *    Very Basic 'net' example. 
 * 
 *    When a client connects and sends data we log out the data as a string
 *    and send back the message 'Hello World' and then close the socket,
 *    ending the client's connection to the server.
 * 
 *    If we get an error: close the socket, log the message and continue on.
 * 
 */
const basicExample = (port: number) => {
  const server = net.createServer((socket: net.Socket): void => {

    // When we get data
    socket.on('data', data => {
      console.log(`Got Data: ${data.toString()}`);
      socket.write('Hello World');
      socket.end();
    });

    // When we get an error
    socket.on('error', (err: Error) => {
      socket.end();
      console.error(`Got Error: ${err.message}`);
    });
  });

  // Start the TCP server on port ${port}
  server.listen(port);
}

/**
 * 
 * 
 * This section is about building an HTTP server from a TCP server
 * 
 * 
 *  UTILS:
 * 
 *    createHeader -- This builds our HTTP header to the HTTP spec.
 *                    It also appends headers according to spec.
 * 
 * 
 *    getDataFile -- Uses fs.readFileSync to synchronously read a
 *                   file and returns a stringified version of the
 *                   data.
 * 
 */

const createHeader = (status: number, headers: Record<string, string | number>): string => {
  const statusLine = `HTTP/1.1 ${status}`;
  const headerList = Object.keys(headers).reduce(
    (acc: string, cur: string) => acc.concat(`${cur}: ${headers[cur]}\n`),
    '');
  return statusLine + '\n' + headerList + '\n';
}

const getDataFile = (name: string) => {
  const filePath = path.resolve(__dirname, '..', '..', 'static', '.' + name);
  return fs.readFileSync(filePath).toString();
}


/**
 * 
 * Basic HTTP Example
 * 
 *    This creates a basic HTTP server that extracts route information
 *    and uses it to decide between sending a JSON payload and an HTML
 *    payload.
 * 
 */
const basicHTTPExample = (port: number) => {
  const jsonBody = { 'hello': 'world' };
  const htmlBody = `<html>
  <head></head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`;

  const server = net.createServer(socket => {
    socket.on('data', data => {

      // Extract Route Data
      const route = data
        .toString()
        .split('\r\n')[0]
        .replace('GET ', '')
        .replace(' HTTP/1.1', '');

      // HOME ROUTE
      if (route === '/') {
        const jsonHeader = createHeader(200, { 'Content-Type': 'application/json' });
        const jsonResponse = jsonHeader + JSON.stringify(jsonBody);
        socket.write(jsonResponse);

        // ANY OTHER ROUTE
      } else {
        const htmlHeader = createHeader(200, { 'Content-Type': 'text/html' });
        const htmlResponse = htmlHeader + htmlBody;
        socket.write(htmlResponse);
      }

      // Close Socket
      socket.end();
    });
  });

  server.listen(port);
}

/**
 * 
 * Basic HTTP File Server Example
 * 
 * 
 *    This creates a simple file server over HTTP on top of a TCP server.
 *    Like last time, we are extracting the route information and serving
 *    different data depending on the route.
 * 
 *    This time we add fetching files from our filesystem and serving them
 *    based on a 'public' or 'static' files folder.
 * 
 *    There is a 'static' folder at the root of the repo where I have a couple
 *    of HTML files and an empty .ico file. We will map the route we get from
 *    the url path to the 'static' folder. If the url path is /index.html then
 *    we find ./static/index.html and return its data.
 * 
 *    We also add a try/catch to catch any filesystem errors that may come up,
 *    like trying to access a file that doesn't exist. We just serve up a generic
 *    404 not found page.
 * 
 */
const basicHTMLFileExample = (port: number) => {
  const server = net.createServer(socket => {
    socket.on('data', (data: Buffer) => {
      try {
        const route = data
          .toString()
          .split('\r\n')[0]
          .replace('GET ', '')
          .replace('POST', '')
          .replace('PUT', '')
          .replace('PATCH', '')
          .replace('DELETE', '')
          .replace('HTTP/1.1', '')
          .trim();

        // Use the URL class to extract a pathname from the route we extracted
        const url = new URL(`http://localhost:${port}${route}`);

        const htmlHeader = createHeader(200, { 'Content-Type': 'text/html' });
        const htmlResponse = htmlHeader + getDataFile(url.pathname);
        socket.write(htmlResponse);
        socket.end();
      } catch (e) {

        // Generic 404 page
        const htmlHeader = createHeader(200, { 'Content-Type': 'text/html' });
        const htmlBody = '<html><body><h1>404 not found</h1></body></html>';
        socket.write(htmlHeader + htmlBody);
        socket.end();
      }
    });
  });

  server.listen(port);
}

basicHTMLFileExample(8080);
