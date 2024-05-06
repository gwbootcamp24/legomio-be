import { urlencoded } from 'express';
import pkg from 'pg';
const { Pool } = pkg;
console.log('###')
export const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
});


export const testData = () => {
return (`
type,url

bricks,img/bricks/green.png
bricks,img/bricks/orange.png
bricks,img/bricks/pink.png
bricks,img/bricks/purple.png
bricks,img/bricks/red.png
bricks,img/bricks/white.png
bricks,img/bricks/yellow.png

background,img/background/glen-carrie-HpMihL323k0-unsplash.jpg
background,img/background/jan-huber-AF6N3WRsyk4-unsplash.jpg
background,img/background/jose-larrazolo-S8bde3hkBR8-unsplash.jpg
background,img/background/nik-v8pL84kvTTc-unsplash.jpg
background,img/background/ryan-quintal-G-HRuwCTR7c-unsplash.jpg
background,img/background/ryan-quintal-US9Tc9pKNBU-unsplash.jpg
background,img/background/xavi-cabrera-kn-UmDZQDjM-unsplash.jpg

legs,img/legs/t001.png
legs,img/legs/t002.png
legs,img/legs/t003.png
legs,img/legs/t004.png
legs,img/legs/t005.png
legs,img/legs/t006.png
legs,img/legs/t007.png
legs,img/legs/t008.png
legs,img/legs/t009.png
legs,img/legs/t010.png
legs,img/legs/t011.png
legs,img/legs/t012.png


body,img/body/b001.png
body,img/body/b002.png
body,img/body/b003.png
body,img/body/b004.png
body,img/body/b005.png
body,img/body/b006.png
body,img/body/b007.png
body,img/body/b008.png
body,img/body/b009.png
body,img/body/b010.png
body,img/body/b011.png
body,img/body/b012.png


head,img/head/f001.png
head,img/head/f002.png
head,img/head/f003.png
head,img/head/f004.png
head,img/head/f005.png
head,img/head/f006.png
head,img/head/f007.png
head,img/head/f008.png
head,img/head/f009.png
head,img/head/f010.png
head,img/head/f011.png
head,img/head/f012.png

hair,img/hair/h156.png
hair,img/hair/h157.png
hair,img/hair/h158.png
hair,img/hair/h159.png
hair,img/hair/h160.png
hair,img/hair/h161.png
hair,img/hair/h162.png
hair,img/hair/h163.png
hair,img/hair/h164.png
hair,img/hair/h165.png
hair,img/hair/h166.png
hair,img/hair/h167.png





`)
}

// console.log(pool);