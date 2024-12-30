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
const tempUser_model_1 = __importDefault(require("../../models/tempUser.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const generateJwt_1 = require("../../helpers/generateJwt");
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let { phoneNumber, otpCode } = req === null || req === void 0 ? void 0 : req.body;
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
        const currentUser = yield tempUser_model_1.default.findOne({ phoneNumber });
        if (!currentUser)
            return res
                .status(400)
                .json({ status: "failed", message: "Malumot topilmadi" });
        if (Number(otpCode) !== ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.otp) === null || _a === void 0 ? void 0 : _a.verifyOtp))
            return res.status(400).json({ status: "failed", message: "OTP xato" });
        const now = Date.now();
        if (now >= ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.otp) === null || _b === void 0 ? void 0 : _b.expiresIn)) {
            yield tempUser_model_1.default.deleteMany({ phoneNumber });
            return res
                .status(400)
                .json({ status: "failed", message: "OTP code expired" });
        }
        const { id, name, password } = currentUser;
        const newUser = yield user_model_1.default.create({
            id,
            phoneNumber,
            name,
            password,
        });
        const jwtToken = (0, generateJwt_1.generateJwt)(phoneNumber);
        yield tempUser_model_1.default.deleteMany({ phoneNumber });
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
    }
    catch (error) {
        if (error.name === "ValidationError") {
            for (const field in error.errors) {
                return res
                    .status(400)
                    .json({ type: "failed", message: error.errors[field].message });
            }
        }
        else
            return res
                .status(400)
                .json({ type: "failed", message: "Something went wrong" });
    }
});
exports.default = verifyCode;
