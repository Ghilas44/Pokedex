// L'application nécessite l'utilisation du module Express
// La const express nous permettra d'utiliser les fonctionnalités du module Express
const express = require("express");
const bodyParser = require("body-parser");
// Ici nous définissons les paramètres du serveur
const hostname = "localhost";
const port = 3000;

const app = express();

const pokeRouteur = require("./routage")(express);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  // Autorise tous les serveurs à faire une requête
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  // Passe au routage et renvoie res
  next();
});

app.use(pokeRouteur);
app.listen(port, hostname, function () {
  console.log(
    "Mon serveur fonctionne sur http://" + hostname + ":" + port + "\n"
  );
});
