
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

  try{
    
    let background
    
    console.log("req.body.background",req.body.background);

    if (req.body.background?.match('blob')){
      // background = new Image(); // Create a new Image
      // background.src = req.body.background;
      // const background = req.body.background? await loadImage(Buffer.from(req.body.background).toString("base64")) :'';

    async function savePhotoFromAPI() {


      const res = await axios.get( req.body.background,
         { responseType: "arraybuffer" }  //<--- ADDED THIS
      );
    


      const response = await fetch(req.body.background);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);


      // const fileType = await FileType.fromBuffer(buffer);

      // if (fileType.ext) {
      if (1) {
          const outputFileName = `yourfilenamehere.png`
          fs.createWriteStream(outputFileName).write(buffer);
      } else {
          console.log('File type could not be reliably determined! The binary data may be malformed! No file saved!')
      }

    }
    
    savePhotoFromAPI();

      // (async function() {
      //   const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
      //   console.log(1)
      //   background =  await loadImage(req.body.background) ;
      //   await sleep(1000)
      //   console.log(2)
      //   // background.src = req.body.background;
      //   await sleep(1000)
      //   console.log("background",background)
      // })()


    } else {
      background = req.body.background? await loadImage(`./${req.body.background}`):'';
    }
  
    // const background = req.body.background? await loadImage(`./${req.body.background}`):'';
    const hair = req.body.hair? await loadImage(`./${req.body.hair}`):'';
    const head = req.body.head? await loadImage(`./${req.body.head}`):'';
    const body = req.body.body? await loadImage(`./${req.body.body}`):'';
    const legs = req.body.legs? await loadImage(`./${req.body.legs}`):'';
    const hands = req.body.body? await loadImage(`./img/hands.png`):'';
    const text = req.body.text;


  registerFont("./shortbaby2.ttf", { family: "ShortBaby" });

  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");
  const canvasXPos = canvas.width/2 - 240;


  const logoPadding = 20;
  console.log("BACKGROUND",background)
  if (background) context.drawImage(background, Math.floor(0.5*(-1 * background.width + canvasWidth)), Math.floor(0.5*(-1 * background.height + canvasHeight)), background.width, background.height);
  if (legs) context.drawImage(legs, canvasXPos, 428, legs.width, legs.height);
  if (body) context.drawImage(body, canvasXPos, 195, body.width, body.height);
  if (hands) context.drawImage(hands, canvasXPos, 195, hair.width, hair.height);
  if (head) context.drawImage(head, canvasXPos, 0, head.width, head.height);
  if (hair) context.drawImage(hair, canvasXPos, 0, hair.width, hair.height);

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


