import { Router } from "express";
import { getComposedImage } from '../controllers/appController.js';

const appRouter = Router();

appRouter.route('/').get(getComposedImage)

export default appRouter;
