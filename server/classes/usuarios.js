///


class Usuarios {
    constructor() {
        this.personas = [];

    }

    agregarPersonas(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(persArray => persArray.id === id)[0]; //Condición de retorno del filter
        //Como solo quiero una persona, siempre va a retornar el primer valor del array
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persArray => persArray.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {
        console.log(this.getPersona(id));
        let personaBorrada = this.getPersona(id); //Busco la persona para no perder la relación del id porque será filtrada en 
        //el array
        this.personas = this.personas.filter(persArray => persArray.id != id); //Filtra las personas que no coincidan con el id pasado como parametro
        //Por ende la persona que coincida queda fuera del array (salió del chat, se desconectó) y siempre tendremos las personas conectadas
        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}
