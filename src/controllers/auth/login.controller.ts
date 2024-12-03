import { Request, Response } from "express";

const loginUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    res.send("");
  } catch (error) {
    console.error(error);
  }
};

export default loginUser;
