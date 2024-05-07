
import {pool} from '../utils/db.js';
import { createCanvas, loadImage, registerFont } from 'canvas';
import * as fs from 'fs';
import * as http from 'http'; 
export async function getComposedImage(req, res, next) {
  console.log('getComposedImage');

}

export async function getAllData(req, res, next) {
  try {
    const {rows: components} = await pool.query(
      `SELECT id,type,url,url2, ROW_NUMBER() OVER (
      PARTITION BY type
      ORDER BY id DESC) 
      AS row_number 
      FROM components`);
    // console.log('getAllData',components);
    res.json(components);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

}

 
// Add the middleware function implementations below this line
export function validateRequest(req, res, next) {
  console.log (req.body);
  if (!req.body.background){
    return res.status(400).send("missing background");
  }
  // if (!req.query.logo){
  //   return res.status(400).send("missing logo");
  // }
  if (!req.body.hair){
    return res.status(400).send("missing hair");
  }    
  if (!req.body.head){
    return res.status(400).send("missing face");
  }    
  if (!req.body.body){
    return res.status(400).send("missing body");
  }
  if (!req.body.legs){
    return res.status(400).send("missing pants");
  }


  if (!req.query.text){
    return res.status(400).send("missing text");
  }
  next();
}


export async function sendImage(req, res, next) {
  // console.log("sendImage",req.compositeImageBuffer);
  res.setHeader("Content-Type", "image/png");
  res.send(req.compositeImageBuffer);
  next();
}

export async function cleanupFiles(req, res, next) {console.log("req.identifier",req.identifier)
    fs.unlink(`./${req.identifier}-background.jpg`, ()=>{});
    fs.unlink(`./${req.identifier}-logo.jpg`, ()=>{});
    next();
}



export async function composeImage(req, res, next) {
  // todo try catch und async Handler
  try{
    const background = req.body.background? await loadImage(`./${req.body.background}`):'';
    const hair = req.body.hair? await loadImage(`./${req.body.hair}`):'';
    const head = req.body.head? await loadImage(`./${req.body.head}`):'';
    const body = req.body.body? await loadImage(`./${req.body.body}`):'';
    const legs = req.body.legs? await loadImage(`./${req.body.legs}`):'';
    const hands = req.body.body? await loadImage(`./img/hands.png`):'';
    const text = req.body.text;
  // const logo = await loadImage(`./${req.identifier}-logo.jpg`);


  // const width = background.width;
  // const height = background.height;
  registerFont("./shortbaby2.ttf", { family: "ShortBaby" });
  // const canvas = createCanvas(width, 2 * height);
  const canvasWidth = 480;
  const canvasHeight = 1000;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");

  const logoPadding = 20;
  
  // context.drawImage(background, 0, 0, background.width, background.height);
  if (background) context.drawImage(background, 0, 0, canvasWidth, canvasHeight);
  if (legs) context.drawImage(legs, 0, 428, legs.width, legs.height);
  if (body) context.drawImage(body, 0, 195, body.width, body.height);
  if (hands) context.drawImage(hands, 0, 195, hair.width, hair.height);
  if (head) context.drawImage(head, 0, 0, head.width, head.height);
  if (hair) context.drawImage(hair, 0, 0, hair.width, hair.height);

  // context.drawImage(logo, width - logo.width - logoPadding + 400, height - logo.height - logoPadding);


  console.log("req.body",req.body)


  if (text) {

  
    const textPadding = 20;
    // context.font = "bold 40pt ShortBaby";
    context.textAlign = "left";
    context.textBaseline = "top";



    context.fillStyle = "rgba(255, 255, 255, 0.8)"
    // context.fillRect(0, 960, textSize.width + 2*textPadding, 200);
    context.fillRect(0, canvasHeight - 100, canvasWidth, 100);

    context.fillStyle = "#444";


    fitTextOnCanvas(text, "ShortBaby", 920);


    function fitTextOnCanvas(text, fontface, yPosition) {
    
      // start with a large font size
      let fontsize = 46;
      let textWidth;
      // lower the font size until the text fits the canvas
      do {
        fontsize--;
        context.font = fontsize + "px " + fontface;
        textWidth = context.measureText(text).width; 
      } while (textWidth > (canvas.width - 30))
    
      // draw the text (canvas.width/2) - (textWidth / 2)
      context.fillText(text, (canvas.width/2) - (textWidth / 2), yPosition);
    
    
    }
  
  }

  // context.fillText(req.body.text??'give me a name', textPadding, 920);

  const buffer = canvas.toBuffer("image/png");
  req.compositeImageBuffer = buffer;
} catch(err){
  console.log(err);
} finally {
  next();

}

}
