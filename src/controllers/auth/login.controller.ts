import { Request, Response } from "express";
import Users from "../../models/user.model";
import bcrypt from "bcrypt";
import { generateJwt } from "../../helpers/generateJwt";

const loginUser = async (req: Request, res: Response) => {
  try {
    let { phoneNumber, password } = req.body;

    password = String(password);

    const user = await Users.findOne({ phoneNumber });

    if (!user)
      return res
        .status(400)
        .json({ type: "failed", message: "Phone number or password wrong" });

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ type: "failed", message: "Phone number or password wrong" });
    } catch (error) {
      console.log(error);
    }

    const jwtToken: string | undefined = generateJwt(phoneNumber);

    return res.status(200).json({
      type: "success",
      message: "Successful logged in",
      data: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error(error);
  }
};

export default loginUser;
