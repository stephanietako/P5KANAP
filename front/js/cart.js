document.addEventListener("DOMContentLoaded", function () {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let apiArray = [];

        // on stocke les informations sur le localstorage
        let localStorageArray = getLocalStorageProduct();

        for (let i = 0; i < localStorageArray.length; i++) {
            apiArray.push(await getApi(localStorageArray[i]));
        }

        let allProducts = concatArray(localStorageArray, apiArray);

        displayProduct(allProducts);

        displayTotalPrice(allProducts);

        listen(allProducts);

        validationForm();


    }

    main();

    //------------------------Récupération du LocalStorage -----------------------//
    //-------------------------------------------------------------------------//
    function getLocalStorageProduct() {

        let getLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        }
        return getLocalStorage;

    }

    //------------------------Récupération de l'API -----------------------//
    //--------------------------------------------------------------------//
    function getApi(localStorageArray) {
        console.log(localStorageArray)
        return fetch("http://localhost:3000/api/products/" + localStorageArray.id)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    //------------------------Récupération du LocalStorage -----------------------//
    //-------------------------------------------------------------------------//
    class ProductClass {
        constructor(id, name, color, qty, alttxt, description, imageurl, price) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.qty = qty;
            this.alttxt = alttxt;
            this.description = description;
            this.imageurl = imageurl;
            this.price = price;
        }
    }

    //----------------Concaténer localStorage et api -----------------------//
    //----------------------------------------------------------------------//
    function concatArray(localStorageArray, apiArray) {

        let allProducts = [];

        for (let i = 0; i < localStorageArray.length; i++) {

            let objectProduct = new ProductClass(
                localStorageArray[i].id,
                apiArray[i].name,
                localStorageArray[i].color,
                localStorageArray[i].quantity,
                apiArray[i].altTxt,
                apiArray[i].description,
                apiArray[i].imageUrl,
                apiArray[i].price,
            );

            allProducts.push(objectProduct);

        }

        return allProducts;

    }

    //-------------------Fonction d'affichage des produits-------------------//
    //-----------------------------------------------------------------------//
    function displayProduct(allProducts) {

        for (product of allProducts) {
            // on stocke la balise Html.
            const domCreation = document.getElementById("cart__items");
            // on push nos nouvelles informations dans notre Html
            domCreation.insertAdjacentHTML(
                "beforeend",
                `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.imageurl}" alt="${product.alttxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
              `
            );
        }
    }

    //-------------------Fonction affichage prix total-------------------//
    //------------------------------------------------------------------//
    function displayTotalPrice(allProducts) {

        let totalPrice = 0;
        let totalQty = 0;

        for (product of allProducts) {
            totalPrice += parseInt(product.qty * product.price);
            totalQty += parseInt(product.qty);
        }

        const displayTotalQty = document.getElementById("totalQuantity");
        const displayTotalPrice = document.getElementById("totalPrice");

        displayTotalQty.innerText = totalQty;
        displayTotalPrice.innerText = totalPrice;
    }

    //-------------------Fonction principal d'écoute-------------------//
    //----------------------------------------------------------------//
    function listen(allProducts) {
        // fonction si changement dans notre input de quantité
        listenQty(allProducts);
        // fonction si on veux supprimer un éléments de la liste
        listenDeleteProduct(allProducts);

    }

    //-------------------Fonction d'écoute de quantité-------------------//
    //-------------------------------------------------------------------//
    function listenQty(allProducts) {
        let qtyinput = document.querySelectorAll(".itemQuantity");

        qtyinput.forEach(function (input) {
            // évenement change est déclanché pour l'événement input 
            input.addEventListener("change", function (inputevent) {

                let inputQty = inputevent.target.value;

                if (inputQty >= 1 && inputQty <= 100) {
                    const name = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > h2").innerText;

                    const color = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > p").innerText;

                    const addProductsQty = name + " " + color;

                    let localstorageKey = JSON.parse(localStorage.getItem(addProductsQty));

                    localstorageKey.qty = parseInt(inputQty);
                    localStorage.setItem(addProductsQty, JSON.stringify(localstorageKey));

                    const result = allProducts.find(allProduct => allProduct.name === localstorageKey.name && allProduct.color === localstorageKey.color);
                    console.log(result)
                    result.qty = inputQty;

                    displayTotalPrice(allProducts);

                } else {
                    alert("Veuillez choisir une quantité valable.")
                }
            })
        })

    }

    //-------------------Fonction supprimer quantité-------------------//
    //-------------------------------------------------------------------//
    function listenDeleteProduct(allProducts) {

        const allDeleteBtn = document.querySelectorAll('.deleteItem');
        allDeleteBtn.forEach(input => {
            input.addEventListener("click", function () {

                const name = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > h2").innerText;

                const color = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > p").innerText;

                const addProducts = name + " " + color;
                console.log(addProducts)
                let localstorageKey = JSON.parse(localStorage.getItem(addProducts));

                localStorage.removeItem(addProducts);

                input.closest("article.cart__item").remove();

                const result = allProducts.find(allProduct => allProduct.name === localstorageKey.name && allProduct.color === localstorageKey.color);
                console.log(result)
                allProducts = allProducts.filter(product => product !== result);

                listenQty(allProducts);

                displayTotalPrice(allProducts);
            })
        })
    }


    //---------------- Regexp les expréssions régulières
    function validationRegexp(form) {
        // Initialisation de nos variables de test.
        const stringRegexp = /^[a-zA-Z-]+$/;
        const emailRegexp = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegexp = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        const cityRegexp = /^[a-zA-Z',.\s-]{1,25}$/;
        let control = true;

        // si une des valeurs dans nos inputs de notre Form est invalide on affiche un message d'erreur

        // firstName
        // match() renvoie un tableau contenant toutes les correspondances ou null si aucun n'est trouvé
        if (!form.firstName.value.match(stringRegexp)) {
            document.getElementById("firstNameErrorMsg").innerText = "Prénom invalide";
            control = false;
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }

        // lastName
        if (!form.lastName.value.match(stringRegexp)) {
            document.getElementById("lastNameErrorMsg").innerText = "Nom invalide";
            control = false;
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }

        // address
        if (!form.address.value.match(addressRegexp)) {
            document.getElementById("addressErrorMsg").innerText = "adresse invalide";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("addressErrorMsg").innerText = "";

        }

        // city
        if (!form.city.value.match(cityRegexp)) {
            document.getElementById("cityErrorMsg").innerText = "ville invalide";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
        }

        // email
        if (!form.email.value.match(emailRegexp)) {
            document.getElementById("emailErrorMsg").innerText = "email invalide";
            control = false;
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }

        if (control) {
            return true;
        } else {
            return false;
        }
    }


    function validationForm() {

        let btnOrder = document.getElementById("order");

        btnOrder.addEventListener("click", function (event) {
            let form = document.querySelector(".cart__order__form");
            event.preventDefault();

            if (localStorage.length !== 0) {

                if (validationRegexp(form)) {
                    console.log("Le formulaire est correctement rempli")

                    let contact = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        address: form.address.value,
                        city: form.city.value,
                        email: form.email.value,
                    }

                    // localStorage
                    let getLocalStorage = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;

                    }

                    const order = {
                        contact: contact,
                        products: getLocalStorage,
                    };
                    // POST
                    const options = {
                        method: "POST",
                        // La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON
                        body: JSON.stringify(order),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    };

                    fetch("http://localhost:3000/api/products/order/", options)
                        .then((response) => response.json())
                        .then(function (data) {
                            //le point d'interogation sépare l'adresse url et la déstination
                            window.location.href = "confirmation.html?id=" + data.orderId;
                        })
                        .catch(function (error) {
                            alert("Error fetch order" + error.message);
                        })

                } else {
                    event.preventDefault();
                    alert("Le formulaireest incomplet ou invalide");
                }

            } else {
                event.preventDefault();
                alert("Votre panier est vide.")
            }


        })
    }


})