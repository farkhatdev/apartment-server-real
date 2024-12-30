"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../models/user.model"));
const tempUser_model_1 = __importDefault(require("../../models/tempUser.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendOtp_1 = require("../../helpers/sendOtp");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, phoneNumber, password } = req.body;
        const userId = Date.now();
        const [isExist] = yield Promise.all([
            user_model_1.default.findOne({ phoneNumber }),
            tempUser_model_1.default.deleteMany({ phoneNumber }),
        ]);
        if (isExist)
            return res
                .status(400)
                .json({ type: "failed", message: "Phone number already exist" });
        const OTP = (0, sendOtp_1.createOtp)();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield tempUser_model_1.default.create({
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
    }
    catch (error) {
        if (error.name === "ValidationError") {
            for (const field in error.errors) {
                setTimeout(() => {
                    return res
                        .status(400)
                        .json({ type: "failed", message: error.errors[field].message });
                }, 2000);
            }
        }
        else
            setTimeout(() => {
                return res
                    .status(400)
                    .json({ type: "failed", message: "Something went wrong" });
            }, 2000);
    }
});
exports.default = registerUser;
