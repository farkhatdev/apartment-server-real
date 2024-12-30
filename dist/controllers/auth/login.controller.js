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
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateJwt_1 = require("../../helpers/generateJwt");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { phoneNumber, password } = req.body;
        password = String(password);
        const user = yield user_model_1.default.findOne({ phoneNumber });
        if (!user)
            return res
                .status(400)
                .json({ type: "failed", message: "Phone number or password wrong" });
        try {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                return res
                    .status(400)
                    .json({ type: "failed", message: "Phone number or password wrong" });
        }
        catch (error) {
            console.log(error);
        }
        const jwtToken = (0, generateJwt_1.generateJwt)(phoneNumber);
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
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = loginUser;
