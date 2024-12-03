import express from "express";
import verifyCode from "../../controllers/auth/verifyCode.controller";

const route = express.Router();

route.post("/", verifyCode);

export default route;
