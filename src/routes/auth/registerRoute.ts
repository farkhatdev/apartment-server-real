import express from "express";
import registerUser from "../../controllers/auth/register.controller";
const route = express.Router();

route.post("/", registerUser);

export default route;
