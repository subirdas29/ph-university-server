import { Response } from 'express';

//ekhane request thik moto kaj howar por database theke paowa response ta asbe

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    data: data.data,
  });
};

export default sendResponse;
