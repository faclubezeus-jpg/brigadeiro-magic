import { Router, type IRouter } from "express";
import healthRouter from "./health";
import settingsRouter from "./settings";
import sectionsRouter from "./sections";
import sweetsRouter from "./sweets";
import cakesRouter from "./cakes";
import kitsRouter from "./kits";
import highlightsRouter from "./highlights";
import testimonialsRouter from "./testimonials";
import adminRouter from "./admin";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(settingsRouter);
router.use(sectionsRouter);
router.use(sweetsRouter);
router.use(cakesRouter);
router.use(kitsRouter);
router.use(highlightsRouter);
router.use(testimonialsRouter);
router.use(adminRouter);
router.use(uploadRouter);

export default router;
