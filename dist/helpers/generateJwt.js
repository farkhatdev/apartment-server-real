"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateJwt = (phoneNumber) => {
    try {
        return jsonwebtoken_1.default.sign({ phoneNumber }, JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.generateJwt = generateJwt;
