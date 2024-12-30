"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyCode_controller_1 = __importDefault(require("../../controllers/auth/verifyCode.controller"));
const route = express_1.default.Router();
route.post("/", verifyCode_controller_1.default);
exports.default = route;
