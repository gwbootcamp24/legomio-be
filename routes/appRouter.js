import { Router } from "express";
import { getComposedImage, getAllData } from '../controllers/appController.js';

const appRouter = Router();

appRouter.route('/getall').post(getAllData)
appRouter.route('/').get(getComposedImage)

export default appRouter;


// routen: ('getall').post