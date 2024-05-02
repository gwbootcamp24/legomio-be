
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
      `SELECT id,type,url, ROW_NUMBER() OVER (
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
  if (!req.query.background){
    return res.status(400).send("missing background");
  }
  // if (!req.query.logo){
  //   return res.status(400).send("missing logo");
  // }
  if (!req.query.hair){
    return res.status(400).send("missing hair");
  }    
  if (!req.query.face){
    return res.status(400).send("missing face");
  }    
  if (!req.query.body){
    return res.status(400).send("missing body");
  }
  if (!req.query.pants){
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
    // const background = await loadImage(`./${req.body.background}`);
    const hair = await loadImage(`./${req.body.hair}`);
    const head = await loadImage(`./${req.body.head}`);
    const body = await loadImage(`./${req.body.body}`);
    const legs = await loadImage(`./${req.body.legs}`);
  
  // const logo = await loadImage(`./${req.identifier}-logo.jpg`);


  // const width = background.width;
  // const height = background.height;
  registerFont("./shortbaby2.ttf", { family: "ShortBaby" });
  // const canvas = createCanvas(width, 2 * height);
  const canvasWidth = 480;
  const canvasHeight = 1200;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");

  const logoPadding = 20;
  
  // context.drawImage(background, 0, 0, background.width, background.height);
  context.drawImage(legs, 0, 440, legs.width, legs.height);
  context.drawImage(body, 0, 200, body.width, body.height);
  context.drawImage(head, 0, 0, head.width, head.height);
  context.drawImage(hair, 0, 0, hair.width, hair.height);

  // context.drawImage(logo, width - logo.width - logoPadding + 400, height - logo.height - logoPadding);


  const textPadding = 30;
  context.font = "bold 70pt ShortBaby";
  context.textAlign = "left";
  context.textBaseline = "top";

  const textSize = context.measureText(req.query.text);
  context.fillStyle = "rgba(255, 255, 255, 0.8)"
  // context.fillRect(0, 960, textSize.width + 2*textPadding, 200);
  context.fillRect(0, canvasHeight - 200, canvasWidth, 200);

  context.fillStyle = "#444";
  context.fillText(req.query.text, textPadding, 2*textPadding);

  const buffer = canvas.toBuffer("image/png");
  req.compositeImageBuffer = buffer;
} catch(err){
  console.log(err);
} finally {
  next();

}

}
