/**
 * BACK END
 */
const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => { //Evento para que una persona ingrese al chat
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala); //Instruccion para unir a una sala

        usuarios.agregarPersonas(client.id, data.nombre, data.sala); //Función que agrega una persona conectada al array de conectados

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala)); //Evento que devuelve los usuarios conectados

        return callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data) => { //Evento para que un usuario envie un mensaje a todos
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);
        //Evento para que notificar a todos que un usuario se desconectó
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    //Escuchar mensajes privados (lo que hará el servidor cuando manden mensajes privados)
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});
