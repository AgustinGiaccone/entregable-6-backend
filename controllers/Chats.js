const {promises: fs} = require ('fs')

class Chats {
    constructor(route) {
        this.route = route
    }

    async saveChats(data){
        try{
            const nuevoMensaje = {
                email: data.email,
                textoMensaje: data.textoMensaje,
                fecha: new Date().toLocaleDateString()+ '-' + new Date().toLocaleTimeString()
            }
            const cargarMensaje = await this.getAllChats()
            cargarMensaje.push(nuevoMensaje)
            await fs.writeFile(`./chats.json`, JSON.stringify(cargarMensaje ,null, 2))
            return cargarMensaje
        }catch(e){
            throw new Error(e.mensaje)
            }
        }

    async getAllChats() {
        try {
            const contendio = JSON.parse(await fs.readFile(`./chats.json`,'utf-8'))
            return contendio
        } catch (error) {
            return []
        }
    }

}

module.exports = Chats