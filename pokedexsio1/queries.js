// Utilisation de la librairie mySql
const mysql = require("mysql");
let mySqlClient;

// Fonction pour ouvrir la connexion à MySQL
function openConnection() {
  // Création de la connexion
  mySqlClient = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pokedex",
  });
}

module.exports = {
  // Nom de la fonction
  // Fonction qui permet d'exécuter le SQL et de retourner un tableau d'objets JSON
  executeQuery: function (sql) {
    // Initialisation de l'objet Promise
    return new Promise(function (resolve, reject) {
      // Initialisation de jsonRes
      let jsonRes = [];
      // Ouvrir la connexion
      openConnection();
      // Exécuter la requête normalement
      mySqlClient.query(
          sql,
          // Utiliser le résultat
          function select(error, resultats, fields) {
            if (error || resultats === undefined) {
              let json = { error: error };
              jsonRes.push(json);
              // Ici, le rejet est utilisé en cas de problème
              reject(jsonRes);
            }

            if (resultats.length > 0) {
              resultats.forEach(function (e) {
                // Tester si jsonRes est vide ou non
                if (typeof jsonRes !== "undefined" && jsonRes.length > 0) {
                  // Si ce n'est pas le cas, vérifier si le Pokémon est déjà présent dans jsonRes
                  let existingObj = jsonRes.find((obj) => obj.id == e["id_pok"]);
                  // Si le Pokémon est présent dans jsonRes
                  if (typeof existingObj !== "undefined") {
                    // Ajouter le type
                    existingObj.type.push({ name: e["type_pok"] });
                  } else {
                    // Sinon, ajouter tous les Pokémon dans jsonRes
                    let json = {
                      id: e["id_pok"],
                      pokemon: e["nom_pok"],
                      type: [{ name: e["type_pok"] }],
                    };
                    jsonRes.push(json);
                  }
                } else {
                  let json = {
                    id: e["id_pok"],
                    pokemon: e["nom_pok"],
                    type: [{ name: e["type_pok"] }],
                  };
                  jsonRes.push(json);
                }
              });
              resolve(jsonRes);
            }
          }
      );
      // Fermer la connexion après le retour
      mySqlClient.end();
    });
  },

  // Autres connexions MySQL
  // getTypes: function (sql) {
  //   // Initialisation de l'objet Promise
  //   return new Promise(function (resolve, reject) {
  //     // Initialisation de jsonRes
  //     let jsonRes = [];
  //     // Ouvrir la connexion
  //     openConnection();
  //     // Exécuter la requête normalement
  //     mySqlClient.query(
  //       sql,
  //       // Utiliser le résultat
  //       function select(error, resultats, fields) {
  //         if (error || resultats === undefined) {
  //           let json = { error: error };
  //           jsonRes.push(json);
  //           // Ici, le rejet est utilisé en cas de problème
  //           reject(jsonRes);
  //         }
  //
  //         if (resultats.length > 0) {
  //           resultats.forEach(function (e) {
  //             let json = {
  //               types: { name: e["type_pok"] },
  //             };
  //             jsonRes.push(json);
  //           });
  //           resolve(jsonRes);
  //         }
  //       }
  //     );
  //     // Fermer la connexion après le retour
  //     mySqlClient.end();
  //   });
  // },

  getTypes: function (sql) {
    return new Promise(function (resolve, reject) {
      let jsonRes = [];
      openConnection();
      mySqlClient.query(sql, function select(error, resultats, fields) {
        if (error || resultats === undefined) {
          reject(error);
        }
        if (resultats.length > 0) {
          resultats.forEach(function (e) {
            jsonRes.push({ name: e["type_pok"] });
          });
          resolve(jsonRes);
        }
      });
      mySqlClient.end();
    });
  },

  deleteQuery: function (sql) {
    return new Promise(function (resolve, reject) {
      openConnection();
      mySqlClient.query(sql, function deleteQuery(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  },


};
