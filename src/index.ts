import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { createServer } from 'http';
import * as mongoose from 'mongoose';
import apolloServer from './apolloClient';
import { connect } from './connection';
import { getEnv } from './data/actions/utils';
import { debugInit } from './debuggers';
import './messageBroker';
import { initRedis } from './redisClient';

initRedis();

// load environment variables
dotenv.config();

const { NODE_ENV } = process.env;

const MAIN_APP_DOMAIN = getEnv({ name: 'MAIN_APP_DOMAIN', defaultValue: '' });

// connect to mongo database
connect();

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    limit: '15mb',
  }),
);

const corsOptions = {
  credentials: true,
  origin: [MAIN_APP_DOMAIN],
};

app.use(cors(corsOptions));

apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions });

// Error handling middleware
app.use((error, _req, res, _next) => {
  console.error(error.stack);
  res.status(500).send(error.message);
});

// Wrap the Express server
const httpServer = createServer(app);

// subscriptions server
const PORT = getEnv({ name: 'PORT' });

apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
  PORT;
  debugInit(`GraphQL Server is now running on ${PORT}`);
});

// GRACEFULL SHUTDOWN
process.stdin.resume(); // so the program will not close instantly

// If the Node process ends, close the Mongoose connection
if (NODE_ENV === 'production') {
  (['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach(sig => {
    process.on(sig, () => {
      // Stops the server from accepting new connections and finishes existing connections.
      httpServer.close(error => {
        if (error) {
          console.error(error.message);
          process.exit(1);
        }

        mongoose.connection.close(() => {
          console.log('Mongoose connection disconnected');
          process.exit(0);
        });
      });
    });
  });
}
