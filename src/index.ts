import express, { Express } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

const app: Express = express();

app.listen(3000, () => {
  console.log(`the server is running on port 3000`);
});
