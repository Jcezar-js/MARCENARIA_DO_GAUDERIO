import {Request, Response, NextFunction} from 'express';


//global error handling middleware
//custom error class
export class appError extends Error {
  statusCode:  number;
  isOperational: boolean;

  constructor (message:string , statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}


export const error_handling_middleware = (
  err: appError | Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('Error:', err.message); //log the error stack
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  if (err instanceof appError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
  }
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Registro duplicado',
    });
  }
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
}