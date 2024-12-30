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

    req.body.name = name = String(name);
    req.body.phoneNumber = phoneNumber = String(phoneNumber);
    req.body.password = password = String(password);
    req.body.confirmPassword = confirmPassword = String(confirmPassword);

    const phoneNumberRegex = /^[0-9]{12}$/;
    const minLengthRegex = /^.{8,}$/;
    const maxLengthRegex = /^.{0,16}$/;
    const regex = /\d/;

    // Name ------------------------------------
    if (!name)
      return res.status(400).json({ type: "faild", message: "Atinizdi jazin" });

    if (name.length < 3)
      return res.status(400).json({
        type: "faild",
        message: "Atiniz keminde 3 belgiden ibarat boliwi kerek",
      });

    if (name.length > 20)
      return res.status(400).json({
        type: "faild",
        message: "Atiniz en kobi 20 belgiden ibarat boliwi kerek",
      });

    // Name regex
    if (regex.test(name))
      return res.status(400).json({
        message: "Atinizda san paydalanban",
      });

    // Phone Number ----------------------------
    if (!phoneNumber)
      return res
        .status(400)
        .json({ type: "faild", message: "Telefon nomer jazin" });

    // Phone regex
    if (phoneNumber.startsWith("+")) {
      req.body.phoneNumber = phoneNumber = phoneNumber.slice(1);
    }

    if (!phoneNumber.startsWith("998") && phoneNumber.length == 9) {
      phoneNumber = req.body.phoneNumber = "998" + phoneNumber;
    }

    if (!phoneNumberRegex.test(phoneNumber))
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number is wrong" });

    // Password --------------------------------
    if (!password)
      return res
        .status(400)
        .json({ type: "faild", message: "Password number is required" });

    if (!minLengthRegex.test(password))
      return res.status(400).json({
        message: "Parol kamida 8 belgidan ibarat boliwi kerek",
      });

    if (!maxLengthRegex.test(password))
      return res.status(400).json({
        message: "Parol kopi 16 belgidan ibarat boliwi kerek",
      });

    // Confirm Password ------------------------
    if (!confirmPassword)
      return res.status(400).json({
        type: "faild",
        message: "Confirm password number is required",
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
