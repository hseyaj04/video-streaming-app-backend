import { healthCheck } from "../controllers/healthcheck.controller.js";
import { Router } from "express";
import router from "./user.routes.js";

const route = Router();

router.route("/").get(healthCheck);

export default router;