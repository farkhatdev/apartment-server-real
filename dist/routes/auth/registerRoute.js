"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_controller_1 = __importDefault(require("../../controllers/auth/register.controller"));
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const route = express_1.default.Router();
route.post("/", validation_middleware_1.validateRegister, register_controller_1.default);
exports.default = route;
