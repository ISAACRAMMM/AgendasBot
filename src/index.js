import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import fs from "fs";

import routePedido from './routers/router.js'


const app = express();


const PORT = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath(import.meta.url)) 
app.set('routers', join(__dirname,'routers'))
app.use(express.static(join(__dirname, 'routers')))


app.get('/', (req, res) => {
    res.send("hi")
    });
    
app.use('/pedido',routePedido)

app.listen(PORT, () => {
    try {

        console.log('listening on port 3000')    
    
    } catch (error) {
        
    }
})