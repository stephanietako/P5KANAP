document.addEventListener("DOMContentLoaded", function () {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let products = await GetProducts();

        for (let product of products) {
            displayProducts(product);
        }
    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec product-------------------//
    //-----------------------------------------------------------------------------------------//
    //je récupère le resultat de la requête
    function GetProducts() {
        return fetch("http://localhost:3000/api/products")
            //then va récuperer le résultat de la requête
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //-------------------Fonction d'affichage du produit-------------------//
    //---------------------------------------------------------------------//
    function displayProducts(product) {

        let SectionItems = document.getElementById("items");

        SectionItems.insertAdjacentHTML(
            "beforeend",
            `
                <a href="./product.html?id=${product._id}">
                    <article>
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                        <p class="productPrice">${product.price}€</p>
                    </article>
                </a>
            `
        );
    }
})
