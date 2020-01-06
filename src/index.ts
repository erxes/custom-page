import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { connect } from './connection';
import { checkTrigger } from './data/utils';

// load environment variables
dotenv.config();

// connect to mongo database
connect();

const app = express();

app.use((req: any, _res, next) => {
  req.rawBody = '';

  req.on('data', chunk => {
    req.rawBody += chunk;
  });

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(`/check-trigger`, async (req: any, res) => {
  // require login
  console.log('****************************************************************************');
  const postData = JSON.parse(req.body.postData);

  if (!postData.userId) {
    return res.end('foribidden');
  }

  const triggerResponse = await checkTrigger(postData);
  const zz = res.end(JSON.stringify(triggerResponse));
  return zz;
});

// Once the bot has booted up its internal services, you can use them to do stuff.

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Automations server is running on port ${PORT}`);
});
