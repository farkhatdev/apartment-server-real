import { Request, Response } from "express";
import Users from "../../models/user.model";
import TempUsers from "../../models/tempUser.model";
import bcrypt from "bcrypt";
import { createOtp } from "../../helpers/sendOtp";

const registerUser = async (req: Request, res: Response) => {
  try {
    let { name, phoneNumber, password } = req.body;

    const userId = Date.now();

    const [isExist] = await Promise.all([
      Users.findOne({ phoneNumber }),
      TempUsers.deleteMany({ phoneNumber }),
    ]);

    if (isExist)
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number already exist" });

    const OTP = createOtp();

    const hashedPassword = await bcrypt.hash(password, 10);

    await TempUsers.create({
      id: userId,
      name: name.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      otp: {
        verifyOtp: OTP,
        expiresIn: Date.now() + 120000,
      },
    });

    console.log(OTP);
    console.log(phoneNumber);
    
    

    setTimeout(() => {
      return res.status(200).json({
        type: "success",
        message: "Verify your phone number",
        data: { phoneNumber, name },
      });
    }, 2000);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      for (const field in error.errors) {
        setTimeout(() => {
          return res
            .status(400)
            .json({ type: "failed", message: error.errors[field].message });
        }, 2000);
      }
    } else
      setTimeout(() => {
        return res
          .status(400)
          .json({ type: "failed", message: "Something went wrong" });
      }, 2000);
  }
};

export default registerUser;
