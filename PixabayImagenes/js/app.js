    const resultado = document.querySelector('#resultado');
    const formulario = document.querySelector('#formulario');
    const paginacionDiv = document.querySelector('#paginacion');

    const registrosPorPagina = 40;
    let totalPaginas;
    let iterador;
    let paginaActual = 1;


    window.onload = () => {
        formulario.addEventListener('submit', validarFormulario);
    }

    function validarFormulario(e) {
        e.preventDefault();

        const terminoBusqueda = document.querySelector('#termino').value;

        if(terminoBusqueda==='') {
            mostrarAlerta('Agrega un término de busqueda');
            return; // so the other lines are not executed
        }
        buscarImagenes();
    }

    function mostrarAlerta(mensaje) {

        const existeAlerta = document.querySelector('.bg-red-100');

        if(!existeAlerta){

            const alerta = document.createElement('p');
            alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3','rounded','max-w-lg','mx-auto','nt-6','text-center');
            alerta.innerHTML= `<strong class="font-bold">Error!</strong> <span class="block sn:inline">${mensaje}</span>`;

            formulario.appendChild(alerta);

            setTimeout(()=> {
                alerta.remove();
            },3000);
        }
    }

    function buscarImagenes() {

        const termino = document.querySelector('#termino').value;
        const key = "37381482-339258f8e34be6e7bc7b249ca";
        const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=100&page=${paginaActual}`;

        fetch(url) //fetch resources asynchronously across the network
            .then(respuesta => respuesta.json()) // makes data into a json
            .then(resultado => {
                totalPaginas = calcularPaginas(resultado.totalHits);
                
                mostrarImagenes(resultado.hits);
            })
    }

    function* crearPaginador(total) { // star denotes a generator function
        // purpose: run some code and return a value, run some more code and return a value and so on...
        // use cases: infinite loop that doesn't stop and freezes the computer because it does each step at a time
        //            generating IDs
        for (let i = 1; i <= total; i++) {
            yield i; // yield = special return keyword
        }
    }

    function calcularPaginas(total) {
        return parseInt(Math.ceil(total/registrosPorPagina));
    }

    function mostrarImagenes(imagenes){
        while(resultado.firstChild){ //if we had already searched something, the past results would remain on the screen so we need to do this
            resultado.removeChild(resultado.firstChild);
        }

        imagenes.forEach(imagen => {
            const { previewURL, likes, views, largeImageURL } = imagen // object destructuring assignment !!

            resultado.innerHTML += `
                <div class="w-1/2 nd:w-1/3 lg:w-1/4 p-3 mb-4">
                    <div class="bg-white">
                        <img class="w-full" src="${previewURL}">

                        <div class="p-4">
                            <p class="font-bold">${likes}<span class="font-light"> Me gusta </p>
                            <p class="font-bold">${views}<span class="font-light"> Veces Vista</span></p>
                            
                            <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded nt-5 p-1" href="${largeImageURL}" target="_blank"> Ver Imagen </a>
                        </div>
                    </div>
                </div>
            `
        });

        //limpiar paginacion previa
        while(paginacionDiv.firstChild){
            paginacionDiv.removeChild(paginacionDiv.firstChild);
        }

        imprimirPaginador();

    }

    function imprimirPaginador(){
        iterador = crearPaginador(totalPaginas); // initializes, sets up a generator

        while(true) { // doing it over and over (infinite) until it is done
            const {value, done} = iterador.next(); // next = allows us to execute the code inside a generator unti the first yield and stops. If you do it again it will go to the second yield and so on.
            // a generator has a value and done property
            if(done) return; // done property of the generator is true, there is no more code to run. Last page.
   
            // else:

            const boton = document.createElement('a');
            boton.href='#';
            boton.dataset.pagina = value;
            boton.textContent = value;
            boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-10', 'font-bold', 'uppercase', 'rounded');
           
            boton.onclick = () => {
                paginaActual = value;
                buscarImagenes()
            }
           
            paginacionDiv.appendChild(boton);
        }
    }