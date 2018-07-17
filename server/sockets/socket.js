const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();
const { crearMensaje } = require('../utils/utilidades');


io.on('connection', (client) => {//recibo client desde el cliente.

    client.on('entrarChat', (data, callback) => {
        
        if(!data.nombre || !data.sala){//si no recibo el nombre del usuario y la sala
            return callback({
                err: true,
                message: 'El nombre/sala es necesario!'
            });
        }

        client.join(data.sala);//si lo recibo todo bien, uno a esos usuarios a esa sala

        usuarios.agregarPersona(client.id, data.nombre, data.sala); //en client.id tengo el ID del usaurio que acaba de conectarse, el nombre y la sala

        //mando mensajes de notificacion a las personas que pertenecen a una misma sala.
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSalas(data.sala));//devuelve la lista de personas que estan actualmente en el chatt
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`));//notifico como administrador que X persona se desconecto o se salio.
        callback(usuarios.getPersonasPorSalas(data.sala));//respondo al cliente con los usuarios que estan en una misma sala
    });


    client.on('crearMensaje', (data, callback) => {//recibo un mensaje del cliente

        let persona = usuarios.getPersona(client.id);//obtendo la informacion del usuario que escribio
        let mensaje = crearMensaje(persona.nombre, data.mensaje);//creo ese mensaje con la funcion crearMensaje()
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);//lo reenvio a todos los clientes que pertenezcan a esa sala

        callback(mensaje);//
    });


    client.on('disconnect', () => {//para indicar en el chat que X persona abandono el grupo.
        let personaBorrada = usuarios.borrarPersona(client.id);//borro de la lista a la persona que se desconecto

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));//notifico como administrador que X persona se desconecto o se salio.
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSalas(personaBorrada.sala));//se muestra la lista de personasq ue estan actualmente en el grupo
    });

    //MENSAJES PRIVADOS
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);//obtengo la informacion de la persona que escribio
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));//le escribo a la persona segun el Id que envie!!!to(data.para)
    });

   

});