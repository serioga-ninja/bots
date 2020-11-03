import bodyParser from 'body-parser';
import * as express from 'express';
import http from 'http';
import config from './core/config';

export class App {
  private readonly _express: express.Application;

  get express() {
    return this._express;
  }

  constructor() {
    this._express = express();
  }

  init() {
    this.middleware();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
  }

  public start() {
    const server = http.createServer(this.express);
    const port = config.PORT;
    server.listen(port);

    server.on('error', (error: NodeJS.ErrnoException): void => {
      if (error.syscall !== 'listen') throw error;
      const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    server.on('listening', (): void => {
      const addr = server.address();
      const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
      console.log(`Listening on ${bind}`);
    });
  }
}

const app = new App();
app.init();
app.start();
