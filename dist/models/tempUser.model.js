"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tempUserSchema = new mongoose_1.Schema({
    id: { type: Number, required: [true, "Id is required"] },
    name: {
        type: String,
        required: [true, "Name is required"],
        lowerCase: true,
        validate: {
            validator: function (v) {
                return v.length >= 2;
            },
            message: "Atiniz kemi 2 harip bolsin",
        },
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function (v) {
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
const TempUsers = (0, mongoose_1.model)("tempusers", tempUserSchema);
exports.default = TempUsers;
