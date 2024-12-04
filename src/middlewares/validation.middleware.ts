import { Request, Response, NextFunction } from "express";

interface RegisterUserBody {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}
interface LoginUserBody {
  phoneNumber: string;
  password: string;
}

export const validateRegister = (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name, phoneNumber, password, confirmPassword } = req.body;

    phoneNumber = String(phoneNumber);

    // name
    if (!name)
      return res
        .status(400)
        .json({ type: "faild", message: "Name is required" });

    // phone
    if (!phoneNumber)
      return res
        .status(400)
        .json({ type: "faild", message: "Phone number is required" });

    // password
    if (!password)
      return res
        .status(400)
        .json({ type: "faild", message: "Password number is required" });

    if (!confirmPassword)
      return res.status(400).json({
        type: "faild",
        message: "Confirm password number is required",
      });

    // Regex

    const phoneNumberRegex = /^[0-9]{12}$/;
    const minLengthRegex = /^.{8,}$/;
    const regex = /\d/;

    // name regex
    if (regex.test(name))
      return res.status(400).json({
        message: "Atinizda san paydalanban",
      });

    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.slice(1);
      req.body.phoneNumber = phoneNumber;
    }

    if (!phoneNumberRegex.test(phoneNumber))
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number is wrong" });

    if (!minLengthRegex.test(password))
      return res.status(400).json({
        message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
      });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords aren't the same" });

    next();
  } catch (error) {
    console.log(error);
  }
};

export const validateLogin = (
  req: Request<{}, {}, LoginUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { phoneNumber, password } = req.body;

    phoneNumber = String(phoneNumber);

    const phoneNumberRegex = /^[0-9]{12}$/;

    // phone
    if (!phoneNumber)
      return res
        .status(400)
        .json({ type: "faild", message: "Phone number is required" });

    // password
    if (!password)
      return res
        .status(400)
        .json({ type: "faild", message: "Password number is required" });

    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.slice(1);
      req.body.phoneNumber = phoneNumber;
    }

    if (!phoneNumberRegex.test(phoneNumber))
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number is wrong" });

    next();
  } catch (error) {
    console.log(error);
  }
};
