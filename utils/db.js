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
type, url
body,img/b001.png
body,img/b002.png
body,img/b003.png
body,img/b004.png
body,img/b005.png
body,img/b006.png
body,img/b007.png
body,img/b008.png
body,img/b009.png
body,img/b010.png
body,img/b011.png
body,img/b012.png


face,img/f001.png
face,img/f002.png
face,img/f003.png
face,img/f004.png
face,img/f005.png
face,img/f006.png
face,img/f007.png
face,img/f008.png
face,img/f009.png
face,img/f010.png
face,img/f011.png
face,img/f012.png

hair,img/h156.png
hair,img/h157.png
hair,img/h158.png
hair,img/h159.png
hair,img/h160.png
hair,img/h161.png
hair,img/h162.png
hair,img/h163.png
hair,img/h164.png
hair,img/h165.png
hair,img/h166.png
hair,img/h167.png


`)
}

// console.log(pool);