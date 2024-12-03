import { Request, Response, NextFunction } from "express";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers.authorization;
  console.log(headers);
  next();
};

export default verifyJWT;
