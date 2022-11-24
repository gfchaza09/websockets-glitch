const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById("formAgregarProducto");
formAgregarProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleValue = document.querySelector("input[name=title]").value;
  const priceValue = document.querySelector("input[name=price]").value;
  const thumbnailValue = document.querySelector("input[name=thumbnail]").value;
  const newProduct = {
    title: titleValue,
    price: priceValue,
    thumbnail: thumbnailValue,
  };
  socket.emit("newProduct", newProduct);
});

socket.on("productos", async (productos) => {
  const htmlProductos = await makeHtmlTable(productos);
  document.getElementById("productos").innerHTML = htmlProductos;
});

function makeHtmlTable(productos) {
  return fetch("templates/table-products.hbs")
    .then((respuesta) => respuesta.text())
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template({ productos });
      return html;
    });
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById("inputUsername");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

const formPublicarMensaje = document.getElementById("formPublicarMensaje");
formPublicarMensaje.addEventListener("submit", (e) => {
  e.preventDefault();
  const authorValue = inputUsername.value;
  const date = new Date();
  const newDate =
    [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join("/") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":");
  const textValue = inputMensaje.value;
  const newMessage = {
    author: authorValue,
    date: newDate,
    text: textValue,
  };
  socket.emit("newMessage", newMessage);
  formPublicarMensaje.reset();
  inputMensaje.focus();
});

socket.on("mensajes", (mensajes) => {
  const htmlMensajes = makeHtmlList(mensajes);
  document.getElementById("mensajes").innerHTML = htmlMensajes;
});

function makeHtmlList(mensajes) {
  const html = mensajes
    .map((mensaje) => {
      return `<div><strong style="color:blue;">${
        mensaje.author + " "
      }</strong><span style="color:brown;">${
        mensaje.date + " : "
      }</span><i style="color:green;">${mensaje.text}</i></div>`;
    })
    .join(" ");
  return html;
}

inputUsername.addEventListener("input", () => {
  const hayEmail = inputUsername.value.length;
  const hayTexto = inputMensaje.value.length;
  inputMensaje.disabled = !hayEmail;
  btnEnviar.disabled = !hayEmail || !hayTexto;
});

inputMensaje.addEventListener("input", () => {
  const hayTexto = inputMensaje.value.length;
  btnEnviar.disabled = !hayTexto;
});
