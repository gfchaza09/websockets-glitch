const express = require("express");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const FileContainer = require("../containers/FileContainer.js");

//--------------------------------------------
// instancio servidor, socket y api

const app = express();

const fileProducts = new FileContainer("./containers/db/products.txt");
const fileMessages = new FileContainer("./containers/db/messages.txt");

//--------------------------------------------
// configuro el socket

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", async (socket) => {
  // productos
  const productos = await fileProducts.listAll();
  socket.emit("productos", productos);
  socket.on("newProduct", async (data) => {
    await fileProducts.save(data);
    const newProducts = await fileProducts.listAll();
    io.sockets.emit("productos", newProducts);
  });

  //mensajes
  const mensajes = await fileMessages.listAll();
  socket.emit("mensajes", mensajes);
  socket.on("newMessage", async (data) => {
    await fileMessages.save(data);
    const newMessages = await fileMessages.listAll();
    io.sockets.emit("mensajes", newMessages);
  });
});

//--------------------------------------------
// agrego middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//--------------------------------------------
// inicio el servidor

const PORT = process.env.PORT || 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
