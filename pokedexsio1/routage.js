const queries = require("./queries");

module.exports = function (express) {
  const pokeRouteur = express.Router();

  pokeRouteur.route("/pokemons").get(function (req, res) {
    // Connexion de l'API avec la BDD
    let sql =
        "SELECT pokemon.id_pok, pokemon.nom_pok, pokemon.type_poke ,esttype.type_pok " +
        "FROM pokemon " +
        "JOIN esttype ON pokemon.id_pok = esttype.id_pok";

    queries.executeQuery(sql).then(function (result) {
      res.json(result);
    });
  });

  pokeRouteur.route("/pokemon").get(function (req, res) {
    // Connexion de l'API avec la BDD
    let sql =
        "SELECT pokemon.id_pok, pokemon.nom_pok,esttype.type_pok " +
        "FROM pokemon " +
        "JOIN esttype ON pokemon.id_pok = esttype.id_pok";

    queries.executeQuery(sql).then(function (result) {
      res.json(result);
    });
  });

  pokeRouteur.route('/pokemons/:types').get(function(req,res){
    let type = req.params.types; // type recherché
    // permet de mettre en majuscule la première lettre
    type = type.charAt(0).toUpperCase() + type.slice(1);
    let sql = " SELECT pokemon.id_pok, pokemon.nom_pok, esttype.type_pok FROM pokemon JOIN esttype ON pokemon.id_pok = esttype.id_pok WHERE type_pok = '" + type +
        "';";
    console.log(sql);
    queries.executeQuery(sql).then(function(result){
      res.json(result);
    })
  });

  pokeRouteur.route("/types").get(function(req,res){
    let sql =
        "SELECT DISTINCT type_pok " +
        "FROM esttype";
    queries.getTypes(sql).then(function (result){
      res.json(result);
    });
  });

  pokeRouteur.route("/delete/:id").get(function (req, res) {
    let id = req.params.id; // ID du Pokémon à supprimer
    let sql = "DELETE FROM pokemon WHERE id_pok = '" + id + "';";

    queries.deleteQuery(sql)
        .then(function () {
          res.redirect("http://localhost:63343/pokedexsio/index.html");
        })
        .catch(function (error) {
          res.status(500).json({ success: false, error: error });
        });
  });


  pokeRouteur.route("/create").post(function (req, res) {
    // Récupérer les données du nouveau Pokémon à partir du corps de la requête (req.body)
    let { nom, type } = req.body;
    let sql = "INSERT INTO pokemon (nom_pok) VALUES ('" + nom + "');";


    queries.executeQuery(sql)
        .then(function () {
          res.json({ success: true, message: "Pokemon crée avec succès." });
        })
        .catch(function (error) {
          res.status(500).json({ success: false, error: error });
        });
  });


  return pokeRouteur;
};
