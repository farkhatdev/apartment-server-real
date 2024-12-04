import express from "express";
import registerUser from "../../controllers/auth/register.controller";
import { validateRegister } from "../../middlewares/validation.middleware";
const route = express.Router();

route.post("/", validateRegister, registerUser);

export default route;
