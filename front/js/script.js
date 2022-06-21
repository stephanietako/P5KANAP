document.addEventListener("DOMContentLoaded", function () {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {
        // fonction asynchrone
        // Le mot-clé await fait en sorte que JavaScript attende que cette promesse se réalise et renvoie son résultat
        let products = await getProducts();

        for (let product of products) {
            displayProducts(product);
        }
    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec product-------------------//
    //-----------------------------------------------------------------------------------------//
    //je récupère le resultat de la requête
    function getProducts() {
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

        let sectionItems = document.getElementById("items");

        sectionItems.insertAdjacentHTML(
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
