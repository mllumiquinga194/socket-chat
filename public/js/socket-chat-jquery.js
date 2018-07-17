var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//REFERENCIAS DE JQUERY
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

//FUNCIONES PARA RENDERIZAR USUARIOS
function renderizarUsuarios(personas) { //[{},{},{}]

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (let i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>'
        html += '</li>'

    }

    divUsuarios.html(html);

}


//RENDERIZAR MENSAJES

function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {

        html += '<li class="reverse" >';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img">';
        html += '        <img src="assets/images/users/5.jpg" alt="user" />';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li >';
    } else {

        html += '<li class="animated fadeIn">';

        html += '    <div class="chat-img">';
        if (mensaje.nombre !== 'Administrador') {
            html += '        <img src="assets/images/users/1.jpg" alt="user" />';
        }

        html += '    </div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }
    divChatbox.append(html);
}


function scrollBottom() {

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

//LISTENERS
divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id'); //en data('id') yo tengo lo que puse en data-id="'+personas[i].id +'". data-ID

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function (e) {

    e.preventDefault();//no enviar cuando yo pulse enter

    //obtener informacon dela caja de texto
    if (txtMensaje.val().trim().length === 0) {//para evitar qenviar mensajes vacios
        return;
    }
    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function (mensaje) {
        txtMensaje.val('').focus();//para vaciar despues de enviar el msj
        renderizarMensajes(mensaje, true);//con el true le indico qe el mensaje lo envie yo
        scrollBottom();
    });


});