let table;

function getPokemon() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/pokemon/",
        dataType: "json",
        error: function(error) {
            console.log(error);
        },
        success: function(data) {
            console.log(data);
            if (data !== null) {
                if (table) {
                    table.destroy();
                }

                table = $("#pokemons-table").DataTable({
                    destroy: true,
                    data: data,
                    columns: [
                        { data: "id", title: "Id" },
                        { data: "pokemon", title: "Pokemon" },
                        {
                            data: "type",
                            title: "Types",
                            render: function(data, type, row) {
                                let types = data.map(function(el) {
                                    return el.name;
                                });
                                return types.join(", ");
                            },
                        },
                        {
                            title: "Modification",
                            data: null,
                            render: function(data, type, row) {
                                return (
                                    '<a href="http://localhost:3000/update/' +
                                    data.id +
                                    '" class="btn btn-warning mr-5">Modifier</a>'
                                );
                            },
                        },
                        {
                            title: "Suppression",
                            data: null,
                            render: function(data, type, row) {
                                return (
                                    '<a href="http://localhost:3000/delete/' +
                                    data.id +
                                    '" class="btn btn-danger">Supprimer</a>'
                                );
                            },
                        },
                    ],
                });
            }
        },
    });
}

$(document).ready(function() {
    getPokemon();

    $("#create-form").submit(function(event) {
        event.preventDefault();
        const nom = $("#nom").val();

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/create",
            data: { nom: nom },
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    alert("Le Pokémon a été créé avec succès !");
                    $("#nom").val("");

                    getPokemon(); // Mettre à jour les données du tableau
                } else {
                    alert("Une erreur s'est produite lors de la création du Pokémon.");
                }
            },
            error: function(error) {
                console.log(error);
                alert("Une erreur s'est produite lors de la création du Pokémon.");
            },
        });
    });
});




// function LoadTypes() {
//     $.ajax({
//         type: "GET", //methode HTTP utilisée
//         url: "http://localhost:3000/types",
//         dataType: "json", //type de donnees en retour
//         error: function (error) {
//             console.log(error);
//         },
//         success: function (data) {
//             console.log(data);
//             if (data !== null) {
//                 let select = $("<select>");
//                 select.append("<option value=''>--Séléctionnez--</option>");
//                 $.each(data, function (index, item) {
//                     select.append($("<option>").val(item.name).text(item.name));
//                 });
//                 $("#types").html(select);
//             }
//         }
//     });
// }
function getTypesAndPokemons() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/types",
        dataType: "json",
        success: function (typesData) {
            console.log(typesData);
            if (typesData !== null) {
                let select = $("<select>");
                select.append("<option value=''>--Sélectionnez--</option>");
                $.each(typesData, function (index, type) {
                    select.append($("<option>").val(type.name).text(type.name));
                });
                $("#types").html(select);

                var selectedType = select.val(); // Récupérer la valeur sélectionnée

                select.on('change', function() {
                    selectedType = $(this).val();
                    console.log(selectedType);

                    if (selectedType) {
                        var apiUrl = "http://localhost:3000/pokemons/" + selectedType;

                        $.ajax({
                            type: "GET",
                            url: apiUrl,
                            dataType: "json",
                            success: function(pokemonsData) {
                                console.log(pokemonsData);
                                if (pokemonsData !== null) {
                                    let table = $("#types-table").DataTable({
                                        destroy: true,
                                        data: pokemonsData,
                                        columns: [
                                            { data: "id", title: "Identifiant" },
                                            { data: "pokemon", title: "Pokemon" },
                                            {
                                                data: "type", title: "Type",
                                                render: function(data, type, row) {
                                                    let types = data.map(function(el) {
                                                        return el.name;
                                                    });
                                                    return types.join(", ");
                                                }
                                            }
                                        ]
                                    });
                                }
                            },
                            error: function(error) {
                                console.log(error);
                            }
                        });
                    }
                });

            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    getTypesAndPokemons();
});


$(document).ready(function() {
    $("#create-form").submit(function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page

        // Récupérer les valeurs des champs du formulaire
        const nom = $("#nom").val();
        const type = $("#type").val();

        // Envoyer la requête AJAX
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/create",
            data: { nom: nom, type: type },
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    alert("Le Pokémon a été créé avec succès !");
                    // Réinitialiser les valeurs des champs du formulaire
                    $("#nom").val("");
                    $("#type").val("");
                } else {
                    alert("Une erreur s'est produite lors de la création du Pokémon.");
                }
            },
            error: function(error) {
                console.log(error);
                alert("Une erreur s'est produite lors de la création du Pokémon.");
            }
        });
    });
});





