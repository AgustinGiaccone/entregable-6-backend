const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const Contenedor = require('./controllers/Contenedor')
const automovil = new Contenedor('productos.txt')
const Chats = require('./controllers/Chats')
const historial = new Chats('chats.json')
const app = express()

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.set('view engine', 'ejs')
app.set('views', './public/views')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//webSocket
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado')

//productos
    socket.emit("productos", await automovil.getAll())
    socket.on("guardarNuevoProducto", (nuevoProducto) => {

        automovil.save(nuevoProducto)
        io.sockets.emit("productos", automovil.getAll)
    })

//mensajes

    const messages = await historial.getAllChats()
    socket.emit('messages', messages);

    socket.on('messegesNew', async (data) => {
    const historialSave = await historial.saveChats(data)
        io.sockets.emit('messages', historialSave);
    })
}
)


app.get('/', async (req, res, next) =>{
    const productos = await automovil.getAll()
    res.render('pages/index',{productos})
})

app.get('/:id', async (req,res,next) => {
    const { id } = req.params
    const productos = await automovil.getById(id)
    res.render('pages/index',{productos})
})

app.post('/', async (req, res, next) => {
    const { title, price, thumbnail } = req.body
    const newProducto = await automovil.save(title, price, thumbnail)
    console.log(newProducto)
    const productos = await automovil.getAll()
    res.render('pages/index', {productos})
})

app.put('/:id',async (req, res, next) => {
    const { title, price, thumbnail } = req.body
    const { id } = req.params;
    const upDateProducto = await automovil.update(title, price, thumbnail,id)
    console.log(upDateProducto)
    const productos = await automovil.getAll()
    res.render('pages/index', {productos})
})

app.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const deleteProducto = await automovil.deleteById(id)
    console.log(deleteProducto)
    const productos = await automovil.getAll()
    res.render('pages/index', {productos})
})

//Server
const port = 8080
const server = httpServer.listen(port, () => {
    console.log(`Servidor http escuchando en el puerto http://localhost:${port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
