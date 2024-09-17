import express from 'express';
const router = express.Router();
import fs from "fs";


app.use(express.json());

// Ruta al archivo JSON donde se almacenarán los pedidos
const filePath = path.join(__dirname, './data/pedidos.json');



export async function guardarPedido(pedido) {
    try {
        let data = [];
        try {
            const jsonData = await fs.readFile(filePath, 'utf-8');
            data = jsonData ? JSON.parse(jsonData) : [];
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        // Agregar el nuevo pedido
        data.push(pedido);

        // Escribir el nuevo pedido en el archivo
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
    }
}

app.post('/pedidos', async (req, res) => {
    const { fecha, nombreCliente, productos } = req.body;

    // Validación simple de los datos
    if (!fecha || !nombreCliente || !productos) {
        return res.status(400).json({ error: 'Faltan datos en el pedido' });
    }

    const newPedido = {
        fecha,
        nombreCliente,
        productos
    };

    // Guardar el pedido
    await guardarPedido(newPedido);

    res.status(201).json({ message: 'Pedido recibido y guardado', pedido: newPedido });
});