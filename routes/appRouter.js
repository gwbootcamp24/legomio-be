import { Router } from "express";
import { getAllData, validateRequest, composeImage, sendImage, cleanupFiles } from '../controllers/appController.js';

const appRouter = Router();

appRouter.route('/getall').post(getAllData)

appRouter.route('/').post(
  // validateRequest,
  composeImage,
  sendImage,
  cleanupFiles
)

export default appRouter;


// routen: ('getall').post