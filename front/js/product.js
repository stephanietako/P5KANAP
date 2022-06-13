document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        // recupération de l'Url.
        const url = new URL(window.location.href);
        // productId = à Id récupérer en paramètre de l'Url
        // avec url.serachParams ma page produit va pouvoir savoir lequel des différents produits de lAPI afficher
        // .get retourne la 1ère valeur associée au paramètre de recherche donnée
        let productId = url.searchParams.get("id");
        console.log(productId);

        let product = await GetProductById(productId);
        //console.log(product);

        DisplayProduct(product);

        BtnClick(product);
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
        console.log(product.name);
        // récupération des parents.
        const title = document.getElementsByTagName("title")[0];
        //console.log(title);
        title.innerHTML = product.name;

        const parentImg = document.getElementsByClassName("item__img")[0];
        console.log(product.imageUrl);
        let image = document.createElement('img');
        image.src = product.imageUrl;
        parentImg.appendChild(image);
        console.log(parentImg);

        const nameProduct = document.getElementById("title");
        nameProduct.innerHTML = product.name;
        //console.log(product.name);
        const priceProduct = document.getElementById("price");
        priceProduct.innerHTML = product.price;
        const descriptProduct = document.getElementById("description");
        descriptProduct.innerHTML = product.description;

        // pour pouvoir choisir la couleur
        const colors = document.getElementById("colors");
        console.log(colors);

        product.colors.forEach(color => {
            //console.log(color);
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(color));
            option.value = color;
            colors.appendChild(option);
        });

    }

    //-------------------Initialisation Class Produit-------------------//
    //---------------------------------------------------------------------//
    class ProductClass {
        // utilisation du mot clé classe, j'initialise un objet avec la methode constructor 
        constructor(id, name, color, quantity) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.quantity = quantity;
        }
    }

    //-------------------Fonction BoutonAddPanier et save LocalStorage-------------------//
    //----------------------------------------------------------------------------------//
    function BtnClick(product) {

        // initialisation de mes variables
        let colorChosen = "";
        let quantityChosen = "";
        let quantity = "";
        let btnCart = document.getElementById("addToCart");

        // sélection des couleurs et de la quantité avec sont comportement au change(évenement change)
        let selectColor = document.getElementById("colors");
        selectColor.addEventListener("change", function (e) {
            colorChosen = e.target.value;
        });

        let selectQuantity = document.getElementById("quantity");
        selectQuantity.addEventListener("change", function (e) {
            quantity = e.target.value;
        });

        // écoute au click sur le bouton Panier
        btnCart.addEventListener("click", function () {

            let productLocalStorage = [];
            let oldQuantity = 0;


            // je fais une boucle for à la longueur du localStorage avec récuperation des informations du localstorage.
            for (let i = 0; i < localStorage.length; i++) {
                productLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
                // je fais une condition si l'Id est la même dans le localStorage et dans notre nouveau produit
                // et que si la Color de notre nouveau produit est strictement égale à celle qui est dans le localStorage 
                if (product._id === productLocalStorage[i].id && productLocalStorage[i].color === colorChosen) {
                    oldQuantity = productLocalStorage[i].quantity;
                }
            }

            // La fonction parseInt() analyse une chaîne de caractère fournie en argument et renvoie un entier exprimé dans une base donnée
            quantityChosen = parseInt(oldQuantity) + parseInt(quantity);

            // on définit le produit choisi en créant une nouvelle instance de ProductClass,
            // en programmation orientée classe, l'instanciation est la création d'un objet à partir d'une classe
            // on injecte les nouvelles valeurs dans la Class.
            let productChosen = new ProductClass(
                product._id,
                product.name,
                colorChosen,
                quantityChosen,
            );

            if (colorChosen != "" && quantityChosen >= 1 && quantityChosen <= 100) {
                // .setItem on accède à l'objet localStorage et on lui ajoute une entrée 
                localStorage.setItem(
                    product.name + " " + colorChosen,
                    JSON.stringify(productChosen)
                );
                console.log(productChosen)
            } else {
                alert("Veuillez renseigner une couleur et une quantité entre 1 et 100.");
            }

        })

    }


}); 
