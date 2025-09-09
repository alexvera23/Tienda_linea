
document.addEventListener('DOMContentLoaded', () => {

   

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const listaProductos = document.querySelector('#lista-productos');
    const listaCarrito = document.querySelector('#lista-carrito');
    const contadorCarrito = document.querySelector('#carrito-contador');
    const formularioContacto = document.querySelector('#formulario-contacto');
    const totalCarritoSpan = document.querySelector('#total-carrito');
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const finalizarCompraBtn = document.querySelector('#finalizar-compra');


    
    function agregarProducto(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function cargarEventListeners() {
        if (listaProductos) {
            listaProductos.addEventListener('click', agregarProducto);
        }

        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
        }

        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener('click', finalizarCompra);
        }
        
        if(formularioContacto) {
            formularioContacto.addEventListener('submit', validarFormulario);
        }
    }


    function agregarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('btn-agregar-carrito')) {
            const productoSeleccionado = e.target.parentElement.parentElement;
            leerDatosProducto(productoSeleccionado);
            mostrarAlerta('✅ Producto añadido al carrito', 'exito');
        }
    }

    function leerDatosProducto(producto) {
        const botonAgregar = producto.querySelector('.btn-agregar-carrito');
        const infoProducto = {
            id: botonAgregar.dataset.id,
            imagen: producto.querySelector('img').src,
            nombre: producto.querySelector('h5').textContent,
            precio: parseFloat(botonAgregar.dataset.precio),
        };
        
        carrito.push(infoProducto);

        guardarCarritoEnStorage();
        actualizarContadorCarrito();
    }
    
    function pintarCarrito() {
        limpiarHTML(listaCarrito);
        
        carrito.forEach(producto => {
            const divProducto = document.createElement('div');
            divProducto.classList.add('col-12', 'mb-3');
            divProducto.innerHTML = `
                <div class="card flex-row">
                    <img src="${producto.imagen}" class="card-img-left" style="width: 120px; object-fit: cover;">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title mb-1">${producto.nombre}</h5>
                            <p class="card-text fw-bold">$${producto.precio.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;
            listaCarrito.appendChild(divProducto);
        });

        calcularTotal();
    }

    function calcularTotal() {
        const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
        if (totalCarritoSpan) {
            totalCarritoSpan.textContent = total.toFixed(2);
        }
    }

    function vaciarCarrito() {
        carrito = []; 
        limpiarHTML(listaCarrito); 
        guardarCarritoEnStorage(); 
        actualizarContadorCarrito(); 
        calcularTotal(); 
        mostrarAlerta('🗑️ Carrito vaciado', 'exito');
    }

    // Función para gestionar la finalización de la compra
function finalizarCompra() {
    const resumenFinal = document.getElementById('resumen-final');

    if (carrito.length > 0) {
        let resumen = "<h4>Resumen de tu compra:</h4><ul>";
        let total = 0;

        carrito.forEach(producto => {
            resumen += `<li>${producto.nombre} - $${producto.precio.toFixed(2)}</li>`;
            total += producto.precio;
        });

        resumen += `</ul><h5>Total: $${total.toFixed(2)}</h5>`;

        // Mostramos el resumen dentro de la página
        resumenFinal.innerHTML = resumen;
        resumenFinal.classList.remove('d-none'); // lo mostramos

        // Mensaje de agradecimiento
        mostrarAlerta('Muchas gracias por su compra', 'exito');

        // Limpiamos carrito
        carrito = [];
        limpiarHTML(listaCarrito);
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        calcularTotal();

    } else {
        mostrarAlerta('El carrito está vacío', 'error');
    }
}


    

    function validarFormulario(e) {
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value.trim();
        const email = document.querySelector('#email').value.trim();
        const mensaje = document.querySelector('#mensaje').value.trim();

        if (nombre === '' || email === '' || mensaje === '') {
            mostrarAlerta('❌ Todos los campos son obligatorios', 'error');
            return;
        }

        // Mostramos mensaje de confirmación al usuario
        mostrarAlerta('Mensaje enviado', 'exito');
        
        // Guardamos los datos en localStorage para referencia
        localStorage.setItem('contacto', JSON.stringify({ nombre, email, mensaje }));
        
        // Limpiamos el formulario
        formularioContacto.reset();
    }

   
    function guardarCarritoEnStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function actualizarContadorCarrito() {
        if (contadorCarrito) {
            contadorCarrito.textContent = carrito.length;
        }
    }
    
    function mostrarAlerta(mensaje, tipo) {
        const contenedorAlertas = document.querySelector('#contenedor-alertas');
        
        // Si no existe el contenedor de alertas, lo creamos
        if (!contenedorAlertas) {
            const nuevoContenedor = document.createElement('div');
            nuevoContenedor.id = 'contenedor-alertas';
            nuevoContenedor.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
            nuevoContenedor.style.zIndex = '9999';
            document.body.appendChild(nuevoContenedor);
        }
        
        // Prevenimos que se acumulen múltiples alertas
        const alertaPrevia = document.querySelector('.alerta-dinamica');
        if (alertaPrevia) {
            alertaPrevia.remove();
        }

        const alerta = document.createElement('div');
        const claseBootstrap = (tipo === 'exito') ? 'alert-success' : 'alert-danger';
        alerta.className = `alert ${claseBootstrap} text-center alerta-dinamica shadow`;
        alerta.style.minWidth = '300px';
        alerta.textContent = mensaje;
        
        const contenedor = document.querySelector('#contenedor-alertas');
        contenedor.appendChild(alerta);
        
        // Removemos la alerta después de 3 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 3000);
    }
    
    function limpiarHTML(elemento) {
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild);
        }
    }
    
    cargarEventListeners();
    actualizarContadorCarrito();
    
    if (listaCarrito) {
        pintarCarrito();
    }
});