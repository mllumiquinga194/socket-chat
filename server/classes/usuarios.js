class Usuarios {

    constructor(){
        this.personas = [];
    }

    agregarPersona(id, nombre, sala){
        let persona = { id, nombre, sala };//Persona es un objeto que tendra el id y el nombre :)

        this.personas.push(persona);//agrego las personas al ID de personas

        return this.personas; //retorno el arreglo de personas
    }

    getPersona(id){
        let persona = this.personas.filter( persona => persona.id === id)[0];//filter me devuelve un arreglo de persona que coincida con la condicion
        //como me devuelve un arreglo, yo solo tomo la posicion 0 para tener solamente un unico registro
        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSalas(sala){
        //...
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id){

        let personaBorrada = this.getPersona(id);//para saber a quien estoy borrando y luego poder indicar algun mensaje de notificacion

        this.personas = this.personas.filter(persona => persona.id != id); //en esta ocacion busco a todos los que no tengan ese ID y me los traigo para meterlos en el arreglo de personas (actualizarlo, dejando fuera al usuario que quiero borrar)

        return personaBorrada;
    }


}


module.exports = {
    Usuarios
}