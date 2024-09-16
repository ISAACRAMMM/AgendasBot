import express from 'express';
import fs from "fs";
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';


const app = express();

const PORT = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath.join(import.meta.url)) 
app.set('routers', join(__dirname,'routers'))
app.use(express.static(join(__dirname, 'routers')))


app.get('/', (req, res) => {
    res.send("hi")
    });
    

app.listen(PORT, () => {
    try {

        console.log('listening on port 3000')    
    
    } catch (error) {
        
    }
})