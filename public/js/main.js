const socket = io.connect();


//productos
socket.on("productos", listaProductos => {
    loadProds(listaProductos)
});

async function loadProds(listProd) {
    let htmlProducto = ''
    const tableList = await fetch('views/partials/tabla.ejs').then(res => res.text())
    if (listProd.length === 0){
        htmlProducto = `<h3 class="alert alert-danger">No se encontraron productos.</h3>`
    }else{
        htmlProducto = ejs.render(tableList, {listProd})
    }

    document.getElementById('tabla').innerHTML = htmlProducto; 
}

document.getElementById('btn').addEventListener('click', () => {
    const nuevoProducto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
socket.emit("guardarNuevoProducto",nuevoProducto)
})

//mensajes
socket.on('messages', function(data) { render(data); });

function render(data) {
    const html = data.map((elem, index) => {
        return(`
        <div style="background-color: rgb(107, 107, 107); border-radius: 20px;">
            <p style="font-size: 12px; color:brown; margin: 0; margin-left: 10px;">${elem.fecha}</p>
            <strong style="color:blue; font-size:20px; margin-left: 10px;">${elem.email}</strong>:
            <p style="font-size: 17px; color:greenyellow; margin-left: 10px;">${elem.textoMensaje}<p>
        </div>
            `)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

document.getElementById('formChat').addEventListener('submit', (e) => {
    e.preventDefault()
    agregarMensaje()
})

function agregarMensaje() {
    const nuevoMensaje = {
        email: document.getElementById('email').value,
        textoMensaje: document.getElementById('textoMensaje').value
    }
    socket.emit("messegesNew",nuevoMensaje)
}




