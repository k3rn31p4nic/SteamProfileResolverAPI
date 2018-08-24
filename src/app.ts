"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";

import * as indexRoute from "./routes/index";
import * as profileRoute from "./routes/profile";
import * as resolverRoute from "./routes/resolver";

/**
 * The server.
 *
 * @class Server
 */
class Server {
  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // Create Express.js application
    this.app = express();

    // Configure application
    this.config();

    // Configure routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    // Use logger for server side logging
    this.app.use(logger("dev"));

    // Mount json form parser
    this.app.use(bodyParser.json());

    // Mount query string parser
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  /**
   * Configure routes
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    // Get router
    let router: express.Router;
    router = express.Router();

    // Create routes
    const index: indexRoute.Index = new indexRoute.Index();
    const resolver: resolverRoute.Resolver = new resolverRoute.Resolver();
    const profile: profileRoute.Profile = new profileRoute.Profile();

    // Home page
    router.get("/", index.main.bind(index.main));
    router.get("/api/:vanityname", resolver.main.bind(resolver.main));
    router.get("/profile/:vanityname", profile.main.bind(profile.main));

    // Use router middleware
    this.app.use(router);

    // Catch 404 and forward to error handler
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {    
      res.json({
        error: "404",
        message: "Not Found"
      });

      next();
    });
  }
}

const server = Server.bootstrap();
export = server.app;
