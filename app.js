const createServer = require('./server');
const connectToDb = require('./config/db');
require('dotenv').config();

const host = process.env.HOST;
const port = process.env.PORT;

(async () => {
  await connectToDb();
  const app = createServer();
  app.listen(port, host, () => {
    console.log(`server running at https//${host}:${port}`);
  });
})();
