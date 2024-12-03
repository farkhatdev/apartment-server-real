import jwt from "jsonwebtoken";
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

export const generateJwt = (phoneNumber: string): string | undefined => {
  try {
    return jwt.sign({ phoneNumber }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log(error);
  }
};
