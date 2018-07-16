var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre')|| !params.has('sala')){//pregunto si me lelga por URL el nombre yla sala
    window.location = 'index.html';//si no lelga, lo mando al index y mando un error
    throw new Error ('El nombre y sala son Necesario');
}

var usuario = {//si todo llega bien guardo el nombre y la sala
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');//indico que esta conectado

    socket.emit('entrarChat', usuario, function(resp){//envio al sevidor informacion para entrar a un chat  osala 
        console.log('Usuarios Conectados',resp);
        
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información  AQUI LO QUE HAGO ES ENVIAR UN MENSAJE A UN GRUPO O A UN CHAT
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje); 

});

// Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log(personas);

});

//MENSAJES PRIVADOS
socket.on('mensajePrivado', function(mensaje){

    console.log(mensaje);
});