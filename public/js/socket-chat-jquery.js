var params = new URLSearchParams(window.location.search); //Buscar en la url los parametros
var nombre = params.get('nombre');
var sala = params.get('sala');

//Referencias de JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');





//Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // personas = [{},{},{}]
    console.log(personas);
    //Parte del HTML que se quiere generar de manera automática. javascript:void(0) es para manejar anchors
    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li> ';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
        //data-id es un atributo personalizado, por lo general estos empiezan con data...

    }

    divUsuarios.html(html);


}

function renderizarMensajes(mensaje, myself) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var horas = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger'
    }

    if (myself) {
        html += '<li class="reverse">';
        html += '  <div class="chat-content">';
        html += '      <h5>' + mensaje.nombre + '</h5>';
        html += '      <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '  </div>';
        html += '  <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '  <div class="chat-time">' + horas + '</div>';
        html += '</li>';


    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre != 'Administrador') {
            html += ' <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '   <div class="chat-content">';
        html += '     <h5>' + mensaje.nombre + '</h5>';
        html += '   <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += ' <div class="chat-time">' + horas + '</div>';
        html += '</li>';


    }



    divChatbox.append(html);
}

function scrollBottom() { //Funcion que determina si hay que mover el scroll

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listernes de JQuery

divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id'); //$(this) es un this en JQuery, aqui hace referencia al objeto 'a'(anchor)
    //.data('id') >> data-id="..." >> O sea que lo que ponga despues de data- es lo que pasaré como parámetro en data()
    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {
    e.preventDefault(); //Evita que el la pag se recargue al enviar la info
    if (txtMensaje.val().trim().length === 0) { //.trim() elimina los espacios vacios delante y detras del string
        return;
    }

    socket.emit('crearMensaje', {
        user: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});
