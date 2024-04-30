import app from './app.js';
const PORT = process.env.POST || 8302;

app.listen(PORT, () =>{
  console.log('Server listening at: ' + PORT)
})