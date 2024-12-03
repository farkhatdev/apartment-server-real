import express from "express";
import loginUser from "../../controllers/auth/login.controller";
const route = express.Router();

route.get("/", loginUser);

export default route;
