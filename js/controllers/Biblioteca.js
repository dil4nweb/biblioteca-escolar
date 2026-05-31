class Biblioteca {
    #libros;
    #contadorId;

    constructor() {
        this.#libros = [];
        this.#contadorId = 1;
        this.#cargarCatalogoInicial();
    }

    #cargarCatalogoInicial() {
        const registrosSemilla = [
            ["El Quijote", "Miguel de Cervantes", 1605],
            ["Cien años de soledad", "Gabriel García Márquez", 1967],
            ["La sombra del viento", "Carlos Ruiz Zafón", 2001],
            ["El Principito", "Antoine de Saint-Exupéry", 1943],
            ["La chica del tren", "Paula Hawkins", 2015]
        ];
        
        registrosSemilla.forEach(([titulo, autor, anio], index) => {
            const libroInstancia = this.agregarLibro(titulo, autor, anio);
            if (index === 2 || index === 4) {
                libroInstancia.setDisponible(false);
            }
        });
    }

    agregarLibro(titulo, autor, anio) {
        const nuevoLibro = new Libro(this.#contadorId++, titulo, autor, anio);
        this.#libros.push(nuevoLibro);
        return nuevoLibro;
    }

    listarLibros() {
        return [...this.#libros];
    }
}
