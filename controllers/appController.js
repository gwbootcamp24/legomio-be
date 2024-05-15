
import {pool} from '../utils/db.js';
import { createCanvas, loadImage, registerFont, Image } from 'canvas';
// import axios, {isCancel, AxiosError} from 'axios';
import * as fs from 'fs';
import * as http from 'http'; 

export async function getComposedImage(req, res, next) {
  console.log('getComposedImage');
}

export async function getAllData(req, res, next) {
  try {
    const {rows: components} = await pool.query(
      `SELECT *, ROW_NUMBER() OVER (
      PARTITION BY type
      ORDER BY id DESC) 
      AS row_number 
      FROM components`);
    res.json(components);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

}

 
// Add the middleware function implementations below this line
export function validateRequest(req, res, next) {
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

  try{
    
    let background
    
    if (req.body.base64data){
      background = await loadImage(req.body.base64data);
    } else {
      background = req.body.background? await loadImage(`./${req.body.background}`):'';
    }
  
    // const background = req.body.background? await loadImage(`./${req.body.background}`):'';
    const hair = req.body.hair? await loadImage(`./${req.body.hair}`):'';
    const head = req.body.head? await loadImage(`./${req.body.head}`):'';
    const body = req.body.body? await loadImage(`./${req.body.body}`):'';
    const legs = req.body.legs? await loadImage(`./${req.body.legs}`):'';
    const hands = req.body.body? await loadImage(`./img/hands.png`):'';
    const brick = req.body.brick? await loadImage(`./${req.body.brick}`):'';
    
    const text = req.body.text;


  registerFont("./shortbaby2.ttf", { family: "ShortBaby" });

  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");
  const canvasXPos = canvas.width/2 - 240;
  const brickYOffset = (req.body.brickSpacingVariant==1?615:req.body.brickSpacingVariant==2?563: req.body.brickSpacingVariant==3?493:650)

  const logoPadding = 20;
  // console.log("BACKGROUND",background)
  if (background) context.drawImage(background, Math.floor(0.5*(-1 * background.width + canvasWidth)), Math.floor(0.5*(-1 * background.height + canvasHeight)), background.width, background.height);
  if (brick) context.drawImage(brick, canvasXPos - 110, brickYOffset + 30, body.width+ 220, body.height + 180 - 40);
  if (legs) context.drawImage(legs, canvasXPos, 428 + 30, legs.width, legs.height);
  if (body) context.drawImage(body, canvasXPos, 195 + 30, body.width, body.height);
  if (hands) context.drawImage(hands, canvasXPos, 195 + 30, hands.width, hands.height);
  if (head) context.drawImage(head, canvasXPos, 0 + 30, head.width, head.height);
  if (hair) context.drawImage(hair, canvasXPos, 0 + 30, hair.width, hair.height);

  // context.drawImage(logo, width - logo.width - logoPadding + 400, height - logo.height - logoPadding);


   console.log("req.body.fontColor",req.body.fontColor)


  if (text) {

    // context.font = "bold 40pt ShortBaby";
    context.textAlign = "left";
    context.textBaseline = "top";


    if (!brick){
      context.fillStyle = "rgba(255, 255, 255, 0.7)"

      // tbd: measure fontsize in fe (canvas), add banner BeforeUnloadEvent, fe (again)
      // context.fillRect(0, canvasHeight - 100, canvasWidth, 100);

      context.fillStyle = (req.body?.fontColor!=='auto')?req.body?.fontColor:"#222";
    }
    else{
      context.fillStyle = (req.body?.fontColor!=='auto')?req.body?.fontColor:"#fff";

    }

    let yPosition = brickYOffset + 332;
    if (!brick) yPosition = 1000;


    fitTextOnCanvas(text, "ShortBaby", yPosition);


    function fitTextOnCanvas(text, fontface, yPosition) {
    
      // start with a large font size
      let fontsize = 60;
      let textWidth;
      // lower the font size until the text fits the canvas
      do {
        fontsize--;
        context.font = fontsize + "px " + fontface;
        textWidth = context.measureText(text).width; 
      } while (textWidth > (620))
    
      // draw the text (canvas.width/2) - (textWidth / 2)
      context.fillText(text, (canvas.width/2) - (textWidth / 2), yPosition);
    
    
    }
  
  }


  const buffer = canvas.toBuffer("image/png");
  req.compositeImageBuffer = buffer;
} catch(err){
  console.log(err);
} finally {
  next();

}

}







// if (fn) {
//   this.toBuffer((err, buf) => {
//     if (err) return fn(err)
//     fn(null, `data:${type};base64,${buf.toString('base64')}`)
//   }, type, opts)
// } else {
//   return `data:${type};base64,${this.toBuffer(type, opts).toString('base64')}`
// }



  // var canvas = document.getElementById('canvas');
  // var input = document.getElementById('input');
  
  
  //   function picToBlob() {
  //     canvas.renderImage(input.files[0]);
  //   }
  
  // HTMLCanvasElement.prototype.renderImage = function(blob){
    
  //   var ctx = this.getContext('2d');
  //   var img = new Image();
  
  //   img.onload = function(){
  //     ctx.drawImage(img, 0, 0)
  //   }
  
  //   img.src = URL.createObjectURL(blob);
  // };
  
  // input.addEventListener('change', picToBlob, false);


