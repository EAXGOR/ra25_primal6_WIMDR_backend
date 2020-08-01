import { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';
import jwt from 'jsonwebtoken';

import config from './config';

export interface ContextInput {
  res: Response;
  req: Request;
  client: MongoClient;
  db: Db;
}

export interface JWTPayload {
  email: string;
  id: string;
}

export interface Context {
  res: Response;
  req: Request;
  client: MongoClient;
  db: Db;
  isValid: boolean;
  jwt: JWTPayload;
}

const context = ({ req, res, client, db }: ContextInput): Context => {
  const payload: Context = {
    res,
    req,
    client,
    db,
    isValid: false,
    jwt: null,
  };

  const token = req.cookies.token || '';

  try {
    const decoded = jwt.verify(token, config.JWTSecret, {
      algorithms: ['HS512'],
      subject: 'login',
    });

    payload.isValid = true;
    payload.jwt = {
      email: (decoded as JWTPayload).email,
      id: (decoded as JWTPayload).id,
    };
  } catch (err) {
    // continue regardless of error
  }

  return payload;
};

export default context;
