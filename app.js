const axios = require("axios");
const http = require("http");
const fs = require("fs");
const url = require("url");

const urlProveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const urlClientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

let proveedores = [];
let clientes = [];

axios.get(urlClientes).then((response) => {
  let clientesData = response.data;
  for (let object of clientesData) {
    clientes.push(object);
  }
  let html = crearHtml(clientes, "clientes");
  fs.writeFileSync("clientes.html", html);
});

axios.get(urlProveedores).then((responseProveedores, responseClientes) => {
  let proveederesData = responseProveedores.data;
  for (let object of proveederesData) {
    proveedores.push(object);
  }

  let html = crearHtml(proveedores, "proveedores");
  fs.writeFileSync("proveedores.html", html);
});

iniciarHttp();

function iniciarHttp() {
  http
    .createServer((req, res) => {
      let link = url.parse(req.url, true);
      let nombreArchivo = link.pathname.substr(5) + ".html";
      fs.readFile(nombreArchivo, (err, data) => {
        res.write(data);
        res.end;
      });
    })
    .listen(8081);
}

function crearHtml(data, tipo) {
  let head = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
        <title>Ejercicio Node</title>
    </head>
    `;

  let body = `
  <body>
  <h3 class="text-center">Listado de Proveedores</h3>
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Nombre</th>
        <th scope="col">Contacto</th>
      </tr>
    </thead>
    <tbody>
    
    `;

  if (tipo === "proveedores") {
    for (let i = 0; i < data.length; i++) {
      body += `
        <tr>
          <td>${data[i].idproveedor}</td>
          <td>${data[i].nombrecompania}</td>
          <td>${data[i].nombrecontacto}</td>
        </tr>
            `;
    }
  } else if (tipo === "clientes") {
    for (let i = 0; i < data.length; i++) {
      body += `
          <tr>
            <td>${data[i].idCliente}</td>
            <td>${data[i].NombreCompania}</td>
            <td>${data[i].NombreContacto}</td>
          </tr>
              `;
    }
  }

  body += `
  </tbody>
  </table>
</body>
</html>
  `;

  const html = head + body;
  return html;
}
