
import {pool} from '../utils/db.js';


export async function getComposedImage(req, res, next) {
  console.log('getComposedImage');

}

export async function getAllData(req, res, next) {
  try {
    const {rows: components} = await pool.query('SELECT * FROM components');
    console.log('getAllData',components);
    res.json(components);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

}

 