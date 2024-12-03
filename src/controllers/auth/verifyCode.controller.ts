import { Request, Response } from "express";
import TempUsers from "../../models/tempUser.model";
import Users from "../../models/user.model";
import jwt from "jsonwebtoken";
import { generateJwt } from "../../helpers/generateJwt";

interface RegisterUserBody {
  phoneNumber: string;
  otpCode: number;
}

const verifyCode = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
) => {
  try {
    let { phoneNumber, otpCode } = req?.body;

    if (!phoneNumber)
      return res.status(400).json({ message: "Phonenumber is required" });

    if (!otpCode) return res.status(400).json({ message: "OTP is required" });

    const currentUser = await TempUsers.findOne({ phoneNumber });

    if (!currentUser)
      return res
        .status(400)
        .json({ status: "failed", message: "Malumot topilmadi" });

    if (Number(otpCode) !== currentUser?.otp?.verifyOtp)
      return res.status(400).json({ status: "failed", message: "OTP xato" });

    const { id, name, password } = currentUser;

    const newUser = await Users.create({
      id,
      phoneNumber,
      name,
      password,
    });

    const jwtToken: string | undefined = generateJwt(phoneNumber);

    await TempUsers.deleteMany({ phoneNumber });
    return res.status(200).json({
      type: "success",
      data: {
        id: newUser.id,
        phoneNumber: currentUser.phoneNumber,
        name: currentUser.name,
      },
      token: jwtToken,
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

export default verifyCode;