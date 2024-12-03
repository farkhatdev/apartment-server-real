import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  id: number;
  name: string;
  phoneNumber: string;
  password: string;
  otp: {
    verifyOtp: number;
    expiresIn: number;
  };
}

const tempUserSchema = new Schema<IUser>({
  id: { type: Number, required: [true, "Id is required"] },
  name: {
    type: String,
    required: [true, "Name is required"],
    lowerCase: true,
    validate: {
      validator: function (v: string): boolean {
        return v.length >= 2;
      },
      message: "Atiniz kemi 2 harip bolsin",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (v: string): boolean {
        return /^\d{12}$/.test(v.toString());
      },
      message: `Raqam 12 xonali son bo‘lishi kerak`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  otp: {
    verifyOtp: { type: Number, required: true },
    expiresIn: { type: Number, required: true },
  },
});

const TempUsers = model("tempusers", tempUserSchema);

export default TempUsers;
