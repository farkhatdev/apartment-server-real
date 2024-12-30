import { Request, Response } from "express";
import TempUsers from "../../models/tempUser.model";
import Users from "../../models/user.model";
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
      return res.status(400).json({ message: "Phone number is required" });

    if (!otpCode)
      return res.status(400).json({ message: "Verify code is required" });

    if (phoneNumber.startsWith("+")) {
      req.body.phoneNumber = phoneNumber = phoneNumber.slice(1);
    }

    if (!phoneNumber.startsWith("998") && phoneNumber.length == 9) {
      phoneNumber = req.body.phoneNumber = "998" + phoneNumber;
    }

    const currentUser = await TempUsers.findOne({ phoneNumber });

    if (!currentUser)
      return res
        .status(400)
        .json({ status: "failed", message: "Malumot topilmadi" });

    if (Number(otpCode) !== currentUser?.otp?.verifyOtp)
      return res.status(400).json({ status: "failed", message: "OTP xato" });

    const now = Date.now();

    if (now >= currentUser?.otp?.expiresIn) {
      await TempUsers.deleteMany({ phoneNumber });
      return res
        .status(400)
        .json({ status: "failed", message: "OTP code expired" });
    }

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
      message: "Successful registred",
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
