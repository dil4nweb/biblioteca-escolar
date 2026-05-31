class Libro {
    #id;
    #titulo;
    #autor;
    #anio;
    #disponible;

    constructor(id, titulo, autor, anio, disponible = true) {
        this.#id = id;
        this.#titulo = titulo;
        this.#autor = autor;
        this.#anio = anio;
        this.#disponible = disponible;
    }

    getId() { return this.#id; }
    getTitulo() { return this.#titulo; }
    getAutor() { return this.#autor; }
    getAnio() { return this.#anio; }
    isDisponible() { return this.#disponible; }

    setDisponible(estado) { 
        if (typeof estado === 'boolean') this.#disponible = estado;
    }
}
