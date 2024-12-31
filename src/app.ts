import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'],credentials:true }));

// application routes
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  // Promise.reject()
  res.send('😎server running');
};

app.get('/', test);

app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
