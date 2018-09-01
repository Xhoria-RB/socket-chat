/**
 * FRONT END
 */
var socket = io();
var params = new URLSearchParams(window.location.search); //Buscar en la url los parametros

if (!params.has('nombre') || !params.has('sala')) { //pregunta si viene en la url el campo nombre
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}
var usuario = { // Construyendo el usuario por el nombre del param
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');


    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
        // console.log('Usuarios conectados', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     user: 'Ricardo',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    renderizarMensajes(mensaje, false);
    scrollBottom();
    // console.log('Servidor:', mensaje);
});


//Escuchar cambios en los usuarios
socket.on('listaPersonas', function(usuarios) {
    renderizarUsuarios(usuarios);
});


//Mensajes privados

socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
});
