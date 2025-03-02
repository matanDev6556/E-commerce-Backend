require('dotenv').config();
const express = require('express');

const app = express();

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log(`server running at https//${host}:${port}`);
});
