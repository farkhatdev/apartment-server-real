import express from "express";
import loginUser from "../../controllers/auth/login.controller";
import { validateLogin } from "../../middlewares/validation.middleware";
const route = express.Router();

route.post("/", validateLogin, loginUser);

export default route;
