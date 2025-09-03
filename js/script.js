document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".btn-agregar-carrito");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: parseFloat(boton.dataset.precio),
        imagen: boton.dataset.imagen
      };

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push(producto);

      localStorage.setItem("carrito", JSON.stringify(carrito));

      alert(producto.nombre + " agregado al carrito ✅");
    });
  });
});
