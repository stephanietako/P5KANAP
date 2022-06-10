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

        //pour pouvoir choisir la couleur
        const colors = document.getElementById("colors");
        console.log(colors);

        product.colors.forEach(color => {
            console.log(color);
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(color));
            option.value = color;
            colors.appendChild(option);
        });

        function addToCart() {
            let quantity = document.getElementById("quantity").value;
            //mettre le choix des produits de l'utilisateur dans une variable
            let userChoiceProduct = {
                //console.log(product.name);
                //console.log(product.price);
                //console.log(colors.value);
                //console.log(quantity);
                product_id: product._id,
                productName: product.name,
                productPrice: product.price,
                productColor: colors.value,
                productQuantity: quantity,
            };
            console.log(userChoiceProduct);

            //**************************************************************************************  
            //function addToCart() {
            //let quantity = document.getElementById("quantity").value;
            //console.log(product.name);
            //console.log(product.price);
            //console.log(colors.value);
            //console.log(quantity);
            //et maintenant je dois enregistrer les données dans un local storage
            //avec setItem j'accède à l'objet "storage" et lui ajoute une entrée, je stocke mes données
            //localStorage.setItem("quantity", quantity);
            //aller dans application sur devTools
            //je récupère mes données
            //let quantityLocalStorage = localStorage.getItem("quantity");
            //console.log(quantityLocalStorage);
            //**************************************************************************************  

            //je déclacle ma variable dans laquelle je vais mettre les clés et valeurs
            //la syntaxe JSON.parse() reforme l’objet à partir de la chaîne linéarisée. 
            let test = JSON.parse(localStorage.getItem("laclé"));
            //parse c'est pour convertir les données au format JSON
            if (test) {
                test.push(userChoiceProduct);
                localStorage.setItem("laclé", JSON.stringify(test));
                console.log(test);
            } else {
                //si y en a pas
                test = [];
                test.push(userChoiceProduct);
                //Cette opération transforme l’objet en une chaîne de caractères
                localStorage.setItem("laclé", JSON.stringify(test));
                console.log(test);
            }
        }
        document.getElementById("addToCart").addEventListener("click", addToCart);
    }

}); 
