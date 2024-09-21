import express from 'express';
const router = express.Router();


import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.use(express.json());

// Ruta al archivo JSON donde se almacenarán los pedidos
const filePath = path.join(__dirname, '../data/pedidos.json');



async function guardarPedido(pedido) {
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


async function readPedidos(rutas) {
    try {
        const fileData = await fs.readFile(filePath, 'utf-8');
        console.log(fileData)
        const pedidos = JSON.parse(fileData);
        console.log(pedidos)
        // Filtrar los pedidos que coincidan con las rutas proporcionadas
        const pedidosEncontrados = pedidos.filter(p => rutas.includes(p.ruta));

        // Si se encontraron pedidos, devolverlos
        if (pedidosEncontrados.length > 0) {
            return pedidosEncontrados;
        } else {
            throw new Error('No se encontraron pedidos con las rutas proporcionadas.');
        }
    } catch (error) {
        throw new Error('Error al leer los pedidos: ' + error.message);
    }
}

router.get('/get', async (req, res) => {
    try {
        // Validar que haya rutas en la consulta
        if (!req.query.rutas) {
            return res.status(400).json({ error: 'No se proporcionaron rutas para la búsqueda.' });
        }

        const rutas = req.query.rutas.split(',');
        console.log(rutas)
        const data = await readPedidos(rutas);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/nuevoPedido', async (req, res) => {
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



export default router;