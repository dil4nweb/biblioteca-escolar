class AppBiblioteca {
    constructor() {
        this.instanciaBiblioteca = new Biblioteca();
        this.instanciaGrafico = null;
        this.inicializarComponentes();
    }

    inicializarComponentes() {
        this.renderizarVistaGlobal();
        this.enlazarEventosFiltro();
        this.mapearAccionesGlobales();
    }

    renderizarVistaGlobal(librosParaMostrar = null) {
        const libros = librosParaMostrar || this.instanciaBiblioteca.listarLibros();
        this.dibujarTarjetasCatalogo(libros);
        this.actualizarContador(libros.length);
        this.generarSeccionEstadisticas();
        this.inicializarComponentesDinamicosBootstrap();
    }

    dibujarTarjetasCatalogo(libros) {
        const contenedor = document.getElementById('cardsContainer');
        if (!contenedor) return;
        contenedor.innerHTML = '';

        if (libros.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center my-4">
                    <p class="text-muted border p-4 bg-white rounded">No existen libros que coincidan con los criterios de busqueda.</p>
                </div>
            `;
            return;
        }

        libros.forEach(libro => {
            const columnaGrid = document.createElement('div');
            columnaGrid.className = 'col-12 col-md-6 col-lg-4 mb-4';
            
            columnaGrid.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title mb-0">${libro.getTitulo()}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <strong>Autor:</strong> ${libro.getAutor()}<br>
                            <strong>Año:</strong> ${libro.getAnio()}<br>
                            <strong>Estado:</strong> 
                            <span class="badge ${libro.isDisponible() ? 'bg-success' : 'bg-warning'}">
                                ${libro.isDisponible() ? 'Disponible' : 'Prestado'}
                            </span>
                        </p>
                        <div class="d-flex gap-2 justify-content-end">
                            <button class="btn btn-info btn-sm text-white" 
                                    data-bs-toggle="tooltip" 
                                    data-bs-placement="top" 
                                    title="Ver informacion detallada del libro">
                                Info
                            </button>
                            <button class="btn btn-secondary btn-sm" 
                                    data-bs-toggle="popover" 
                                    data-bs-trigger="focus"
                                    data-bs-content="Este libro pertenece a la coleccion general de la biblioteca." 
                                    data-bs-title="Nota institucional">
                                Nota
                            </button>
                        </div>
                    </div>
                    <div class="card-footer text-muted d-flex justify-content-between align-items-center">
                        <small>ID: ${libro.getId()}</small>
                    </div>
                </div>
            `;
            contenedor.appendChild(columnaGrid);
        });
    }

    actualizarContador(cantidadMostrada) {
        const element = document.getElementById('resultCount');
        const total = this.instanciaBiblioteca.listarLibros().length;
        if (element) {
            element.textContent = `Mostrando ${cantidadMostrada} de ${total} libros`;
        }
    }

    aplicarFiltrosCruzados() {
        const buscadorTexto = document.getElementById('searchFilter').value.toLowerCase();
        const filtroDisponibilidad = document.getElementById('availabilityFilter').value;
        const anioMinimo = parseInt(document.getElementById('yearMin').value) || 0;
        const anioMaximo = parseInt(document.getElementById('yearMax').value) || 9999;

        const catalogoFiltrado = this.instanciaBiblioteca.listarLibros().filter(libro => {
            const cumpleTexto = libro.getTitulo().toLowerCase().includes(buscadorTexto) || 
                               libro.getAutor().toLowerCase().includes(buscadorTexto);
            
            let cumpleDisponibilidad = true;
            if (filtroDisponibilidad === 'available') cumpleDisponibilidad = libro.isDisponible();
            if (filtroDisponibilidad === 'borrowed') cumpleDisponibilidad = !libro.isDisponible();

            const cumpleRangoAnio = libro.getAnio() >= anioMinimo && libro.getAnio() <= anioMaximo;

            return cumpleTexto && cumpleDisponibilidad && cumpleRangoAnio;
        });

        this.renderizarVistaGlobal(catalogoFiltrado);
    }

    enlazarEventosFiltro() {
        document.getElementById('searchFilter').addEventListener('input', () => this.aplicarFiltrosCruzados());
        document.getElementById('availabilityFilter').addEventListener('change', () => this.aplicarFiltrosCruzados());
        document.getElementById('yearMin').addEventListener('input', () => this.aplicarFiltrosCruzados());
        document.getElementById('yearMax').addEventListener('input', () => this.aplicarFiltrosCruzados());
    }

    mapearAccionesGlobales() {
        const btnLimpiar = document.getElementById('btnLimpiarFiltros');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                document.getElementById('searchFilter').value = '';
                document.getElementById('availabilityFilter').value = 'all';
                document.getElementById('yearMin').value = '';
                document.getElementById('yearMax').value = '';
                this.renderizarVistaGlobal();
            });
        }

        const btnGuardar = document.getElementById('btnGuardarLibro');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                const tituloInput = document.getElementById('titulo').value.trim();
                const autorInput = document.getElementById('autor').value.trim();
                const anioInput = parseInt(document.getElementById('anio').value);

                if (!tituloInput || !autorInput || !anioInput) {
                    alert('Todos los campos son requeridos para procesar el registro.');
                    return;
                }

                if (isNaN(anioInput) || anioInput < 1000 || anioInput > new Date().getFullYear()) {
                    alert('Ingrese un año valido de publicacion.');
                    return;
                }

                this.instanciaBiblioteca.agregarLibro(tituloInput, autorInput, anioInput);
                this.renderizarVistaGlobal();

                document.getElementById('formLibro').reset();
                const elementoModal = document.getElementById('modalLibro');
                const instanciaModal = bootstrap.Modal.getInstance(elementoModal);
                if (instanciaModal) instanciaModal.hide();
            });
        }
    }

    generarSeccionEstadisticas() {
        const todosLosLibros = this.instanciaBiblioteca.listarLibros();
        const disponibles = todosLosLibros.filter(l => l.isDisponible()).length;
        const prestados = todosLosLibros.length - disponibles;

        const contenedorMetricas = document.getElementById('statsSummary');
        if (contenedorMetricas) {
            contenedorMetricas.innerHTML = `
                <div class="row text-center g-3">
                    <div class="col-md-4">
                        <div class="card bg-info text-white">
                            <div class="card-body">
                                <h3>${todosLosLibros.length}</h3>
                                <p class="mb-0">Total Libros</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-success text-white">
                            <div class="card-body">
                                <h3>${disponibles}</h3>
                                <p class="mb-0">Disponibles</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-warning text-white">
                            <div class="card-body">
                                <h3>${prestados}</h3>
                                <p class="mb-0">Prestados</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const mapeoDecadas = {};
        todosLosLibros.forEach(libro => {
            const decadaCalculada = Math.floor(libro.getAnio() / 10) * 10;
            mapeoDecadas[decadaCalculada] = (mapeoDecadas[decadaCalculada] || 0) + 1;
        });

        const elementoCanvas = document.getElementById('estadisticasChart');
        if (!elementoCanvas) return;

        if (this.instanciaGrafico) {
            this.instanciaGrafico.destroy();
        }

        const ctx = elementoCanvas.getContext('2d');
        this.instanciaGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(mapeoDecadas).map(d => `${d}s`),
                datasets: [{
                    label: 'Cantidad de Libros',
                    data: Object.values(mapeoDecadas),
                    backgroundColor: 'rgba(44, 62, 80, 0.7)',
                    borderColor: 'rgba(44, 62, 80, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Distribucion de libros por decadas' }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    inicializarComponentesDinamicosBootstrap() {
        const referenciasTooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        referenciasTooltips.map(el => new bootstrap.Tooltip(el));

        const referenciasPopovers = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        referenciasPopovers.map(el => new bootstrap.Popover(el));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AppBiblioteca();
});
