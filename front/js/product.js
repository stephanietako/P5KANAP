document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        // On Récupére l'Url.
        const url = new URL(window.location.href);
        // productId = à Id récupérer en paramètre de notre Url
        //url.serachParams c'est grâce à cette notion que ma page produit
        //va pouvoir savoir lequel des différents produits de lAPI afficher.
        let productId = url.searchParams.get("id");
        //.get retourne la 1ère valeur associée au paramètre de recherche donnée
        console.log(productId);

        let product = await GetProductById(productId);
        //console.log(product);

        DisplayProduct(product);

    }

    main();

    //-------------------Fonction d'intérrogation de notre api avec productId-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetProductById(productId) {
        return fetch(`http://localhost:3000/api/products/${productId}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                return data;
            })
            .catch(function (error) {
                return error;
            });
    }

    //-------------------Fonction d'affichage du produit-------------------//
    //---------------------------------------------------------------------//
    function DisplayProduct(product) {
        console.log("COUCOU");
        console.log(product.name);
        // Récupération des parents.
        const title = document.getElementsByTagName("title")[0];
        //console.log(title);
        title.innerHTML = product.name;

        const parentImg = document.getElementsByClassName("item__img")[0];
        console.log(product.imageUrl);
        let image = document.createElement('img');
        image.src = product.imageUrl;
        //parentImg.innerHTML = image;
        parentImg.appendChild(image);
        console.log(parentImg);

        const nameProduct = document.getElementById("title");
        nameProduct.innerHTML = product.name;
        //console.log(product.name);
        const priceProduct = document.getElementById("price");
        priceProduct.innerHTML = product.price;
        const descriptProduct = document.getElementById("description");
        descriptProduct.innerHTML = product.description;

        const colors = document.getElementById("colors");
        console.log(colors);

        product.colors.forEach(color => {
            console.log(color);
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(color));
            option.value = color;
            colors.appendChild(option);
        });


        function myFunction() {
            let quantity = document.getElementById("quantity").value;
            console.log(product.name);
            console.log(product.price);
            console.log(colors.value);
            console.log(quantity);
            //et maintenant je dois enregistrer les infos dans un local storage

            localStorage.setItem("quantity", quantity);
            //aller dans application sur devTools
            let qt = localStorage.getItem("quantity");
            console.log(qt);
        }
        document.getElementById("addToCart").addEventListener("click", myFunction);
    }

});
