document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        // On Récupére l'Url.
        const url = new URL(window.location.href);
        // productId = à Id récupérer en paramètre de notre Url
        let productId = url.searchParams.get("id");

        let product = await GetId(productId);

        DisplayProduct(product);

    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec productId-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetId(productId) {
        return fetch("http://localhost:3000/api/products/" + productId)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function DisplayProduct(product) {
        // Récupération des parents.
        const title = document.getElementsByTagName("title")[0];
        const parentImg = document.getElementsByClassName("item__img");



    }

});