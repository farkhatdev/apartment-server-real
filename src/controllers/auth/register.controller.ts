import { Request, Response } from "express";
import Users from "../../models/user.model";
import TempUsers from "../../models/tempUser.model";
import { createOtp } from "../../helpers/sendOtp";

interface RegisterUserBody {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
) => {
  try {
    let { name, phoneNumber, password, confirmPassword } = req.body;

    for (let [key, value] of Object.entries(req.body)) {
      if (value === "") {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

        return res
          .status(400)
          .json({ type: "failed", message: `${capitalizedKey} is required` });
      }
    }

    // Regex
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
    const phoneNumberRegex = /^[0-9]{12}$/;
    const letterAndNumberRegex = /^[A-Za-z0-9]+$/;
    const minLengthRegex = /^.{8,}$/;

    // if conditions
    if (!nameRegex.test(name))
      return res.status(400).json({
        message: "Atinizda tek latin ham kiril harifleri boliwi kerek",
      });

    if (phoneNumber.startsWith("+"))
      phoneNumber = phoneNumber.slice(1).toLocaleLowerCase();

    if (!phoneNumberRegex.test(phoneNumber.toString()))
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number is wrong" });

    if (!letterAndNumberRegex.test(password))
      return res.status(400).json({
        message: "Parol faqat latin harf va raqamlardan iborat bo'lishi kerak",
      });

    if (!minLengthRegex.test(password))
      return res.status(400).json({
        message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
      });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords aren't the same" });

    const userId = Date.now();

    const isExist = await Users.findOne({ phoneNumber });

    if (isExist)
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number already exist" });

    await TempUsers.deleteMany({ phoneNumber });

    const OTP = createOtp();

    const newUser = await TempUsers.create({
      id: userId,
      name: name.toLowerCase(),
      phoneNumber,
      password,
      otp: {
        verifyOtp: OTP,
        expiresIn: Date.now() + 120000,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Verify your phone number",
      data: { phoneNumber, name },
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      for (const field in error.errors) {
        return res
          .status(400)
          .json({ type: "failed", message: error.errors[field].message });
      }
    } else
      return res
        .status(400)
        .json({ type: "failed", message: "Something went wrong" });
  }
};

export default registerUser;
