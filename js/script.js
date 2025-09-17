document.addEventListener('DOMContentLoaded', () => {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const listaProductos = document.querySelector('#lista-productos');
    const listaCarrito = document.querySelector('#lista-carrito');
    const contadorCarrito = document.querySelector('#carrito-contador');
    const formularioContacto = document.querySelector('#formulario-contacto');
    const totalCarritoSpan = document.querySelector('#total-carrito');
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const finalizarCompraBtn = document.querySelector('#finalizar-compra');

    // 🔹 Agregar producto (dummy, para localStorage rápido)
    function agregarProducto(id, nombre, precio) {
        carrito.push({ id, nombre, precio });
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // 🔹 Eventos
    function cargarEventListeners() {
        if (listaProductos) {
            listaProductos.addEventListener('click', agregarProductoHandler);
        }

        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
        }

        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener('click', finalizarCompra);
        }
        
        if (formularioContacto) {
            formularioContacto.addEventListener('submit', validarFormulario);
        }
    }

    // 🔹 Handler para botón de "Agregar al carrito"
    function agregarProductoHandler(e) {
        e.preventDefault();
        if (e.target.classList.contains('btn-agregar-carrito')) {
            const productoSeleccionado = e.target.closest('.card');
            leerDatosProducto(productoSeleccionado);
            mostrarAlerta('✅ Producto añadido al carrito', 'exito');
        }
    }

    // 🔹 Lee datos del producto
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
        calcularTotal();
    }
    
    // 🔹 Pinta el carrito
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

    // 🔹 Calcula total del carrito normal
    function calcularTotal() {
        const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
        if (totalCarritoSpan) {
            totalCarritoSpan.textContent = total.toFixed(2);
        }
    }

    // 🔹 Vaciar carrito
    function vaciarCarrito() {
        carrito = []; 
        limpiarHTML(listaCarrito); 
        guardarCarritoEnStorage(); 
        actualizarContadorCarrito(); 
        calcularTotal(); 
        mostrarAlerta('🗑️ Carrito vaciado', 'exito');
    }

    // Finalizar compra
function finalizarCompra() {
    const resumenFinal = document.getElementById('resumen-final');

    if (carrito.length > 0) {
        let resumen = `<ul>`;
        let total = 0;

        carrito.forEach(producto => {
            resumen += `<li>${producto.nombre} - $${producto.precio.toFixed(2)}</li>`;
            total += producto.precio;
        });

        resumen += `</ul><h5>Total: $${total.toFixed(2)}</h5>`;

        // Mostramos el resumen dentro de la página
        resumenFinal.innerHTML = `
            <div class="card shadow-lg border-0 rounded-3 p-4 mt-4">
                <h4 class="card-title text-center text-primary fw-bold">🛍️ Resumen de tu Compra</h4>
                <hr>
                <div id="resumen-items">${resumen}</div>
                <div class="d-flex justify-content-between mt-3">
                </div>

                <div id="volver-inicio" class="text-center mt-4">
                    <a href="index.html" class="btn btn-success btn-lg shadow-sm">🏠 Volver al inicio</a>
                </div>
            </div>
        `;
        document.getElementById('finalizar-compra').style.display = 'none';

        document.getElementById('vaciar-carrito').style.display = 'none';

        resumenFinal.classList.remove('d-none');

        // Mensaje de agradecimiento
        mostrarAlerta('🎉 ¡Muchas gracias por su compra!', 'exito');

        // Limpiamos carrito
        carrito = [];
        limpiarHTML(listaCarrito);
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        calcularTotal();

    } else {
        mostrarAlerta('⚠️ El carrito está vacío', 'error');
    }
}


    // 🔹 Validación de formulario
    function validarFormulario(e) {
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value.trim();
        const email = document.querySelector('#email').value.trim();
        const mensaje = document.querySelector('#mensaje').value.trim();

        if (nombre === '' || email === '' || mensaje === '') {
            mostrarAlerta('❌ Todos los campos son obligatorios', 'error');
            return;
        }

        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!regexNombre.test(nombre)) {
            mostrarAlerta('❌ El nombre no puede contener números ni caracteres inválidos', 'error');
            return;
        }

        mostrarAlerta('📨 Mensaje enviado', 'exito');
        
        localStorage.setItem('contacto', JSON.stringify({ nombre, email, mensaje }));
        formularioContacto.reset();
    }

    // 🔹 Helpers
    function guardarCarritoEnStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function actualizarContadorCarrito() {
        if (contadorCarrito) {
            contadorCarrito.textContent = carrito.length;
        }
    }
    
    function mostrarAlerta(mensaje, tipo) {
        let contenedorAlertas = document.querySelector('#contenedor-alertas');
        
        if (!contenedorAlertas) {
            contenedorAlertas = document.createElement('div');
            contenedorAlertas.id = 'contenedor-alertas';
            contenedorAlertas.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
            contenedorAlertas.style.zIndex = '9999';
            document.body.appendChild(contenedorAlertas);
        }
        
        const alertaPrevia = document.querySelector('.alerta-dinamica');
        if (alertaPrevia) {
            alertaPrevia.remove();
        }

        const alerta = document.createElement('div');
        const claseBootstrap = (tipo === 'exito') ? 'alert-success' : 'alert-danger';
        alerta.className = `alert ${claseBootstrap} text-center alerta-dinamica shadow`;
        alerta.style.minWidth = '300px';
        alerta.textContent = mensaje;
        
        contenedorAlertas.appendChild(alerta);

        alerta.scrollIntoView({ behavior: "smooth", block: "center" });

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
    
    // 🔹 Inicialización
    cargarEventListeners();
    actualizarContadorCarrito();
    
    if (listaCarrito) {
        pintarCarrito();
    }
});
