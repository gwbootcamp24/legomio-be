
import path from 'path';
import express from 'express';
import cors from 'cors';
import appRouter from './routes/appRouter.js';

const app = express();

app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '20000kb' }));
app.use(express.urlencoded({extended: false}));
app.use(express.static('.'));



app.use('/', appRouter);

// app.use('*', (req, res) => res.sendStatus(404));


export default app;