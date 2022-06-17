document.addEventListener("DOMContentLoaded", function () {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let ApiArray = [];

        // on stocke les informations sur le localstorage
        let localStorageArray = getLocalStorageProduct();

        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        DisplayProduct(AllProducts);

        DisplayTotalPrice(AllProducts);

        Listen(AllProducts);

        ValidationForm();


    }

    main();

    //------------------------Récupération du LocalStorage -----------------------//
    //-------------------------------------------------------------------------//
    function getLocalStorageProduct() {

        //déclaration de variable
        let getLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        }
        return getLocalStorage;

    }

    //------------------------Récupération de l'API -----------------------//
    //--------------------------------------------------------------------//
    function GetApi(localStorageArray) {
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
    function ConcatArray(localStorageArray, ApiArray) {

        let AllProducts = [];

        for (let i = 0; i < localStorageArray.length; i++) {

            let ObjectProduct = new ProductClass(
                localStorageArray[i].id,
                ApiArray[i].name,
                localStorageArray[i].color,
                localStorageArray[i].quantity,
                ApiArray[i].altTxt,
                ApiArray[i].description,
                ApiArray[i].imageUrl,
                ApiArray[i].price,
            );

            AllProducts.push(ObjectProduct);

        }

        return AllProducts;

    }

    //-------------------Fonction d'affichage des produits-------------------//
    //-----------------------------------------------------------------------//
    function DisplayProduct(AllProducts) {

        for (product of AllProducts) {
            // on stocke la balise Html.
            const domCreation = document.getElementById("cart__items");
            // on push nos nouvels informations dans notre Html
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
    function DisplayTotalPrice(AllProducts) {

        // de base 2 variable a 0
        let totalPrice = 0;
        let totalQty = 0;

        for (product of AllProducts) {
            totalPrice += parseInt(product.qty * product.price);
            totalQty += parseInt(product.qty);
        }

        const DtotalQty = document.getElementById("totalQuantity");
        const DtotalPrice = document.getElementById("totalPrice");

        DtotalQty.innerText = totalQty;
        DtotalPrice.innerText = totalPrice;
    }

    //-------------------Fonction principal d'écoute-------------------//
    //----------------------------------------------------------------//
    function Listen(AllProducts) {
        // fonction si changement dans notre input quantity.
        ecoutequantity(AllProducts);
        // fonction si on veux supprimer un éléments de la liste.
        //ecoutedeleteProduct(AllProducts);
        ecoutedeleteProduct(AllProducts);

    }

    //-------------------Fonction d'écoute de quantité-------------------//
    //-------------------------------------------------------------------//
    function ecoutequantity(AllProducts) {
        let qtyinput = document.querySelectorAll(".itemQuantity");

        qtyinput.forEach(function (input) {
            input.addEventListener("change", function (inputevent) {

                let inputQty = inputevent.target.value;

                if (inputQty >= 1 && inputQty <= 100) {
                    const Name = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > h2").innerText;

                    const color = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > p").innerText;

                    const productName = Name + " " + color;

                    let localstorageKey = JSON.parse(localStorage.getItem(productName));
                    //console.log(inputQty);
                    localstorageKey.qty = parseInt(inputQty);
                    localStorage.setItem(productName, JSON.stringify(localstorageKey));

                    const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.color === localstorageKey.color);
                    console.log(result)
                    result.qty = inputQty;

                    DisplayTotalPrice(AllProducts);

                } else {
                    alert("Veuillez choisir une quantité valable.")
                }
            })
        })

    }

    //-------------------Fonction supprimer quantité-------------------//
    //-------------------------------------------------------------------//
    // là je déclare ma fonction ecoutedeleteProduct

    function ecoutedeleteProduct(AllProducts) {

        const allDeleteBtn = document.querySelectorAll('.deleteItem');
        allDeleteBtn.forEach(input => {
            input.addEventListener("click", function () {

                const Name = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > h2").innerText;

                const color = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > p").innerText;

                const productName = Name + " " + color;
                console.log(productName)
                let localstorageKey = JSON.parse(localStorage.getItem(productName));

                localStorage.removeItem(productName);

                input.closest("article.cart__item").remove();

                const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.color === localstorageKey.color);
                console.log(result)
                AllProducts = AllProducts.filter(product => product !== result);

                ecoutequantity(AllProducts);

                DisplayTotalPrice(AllProducts);
            })
        })
    }


    //----------------------------------------
    function ValidationRegex(form) {
        // Initialisation de nos variables de test.
        const stringRegex = /^[a-zA-Z-]+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        const cityRegex = /^[a-zA-Z',.\s-]{1,25}$/;
        let control = true;

        // si une des valeurs dans nos inputs de notre Form est invalide on affiche un méssage d'érreur

        // firstName
        if (!form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }

        // lastName
        if (!form.lastName.value.match(stringRegex)) {
            document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }

        // email
        if (!form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = "Mauvais email";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }

        // address
        if (!form.address.value.match(addressRegex)) {
            document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("addressErrorMsg").innerText = "";

        }

        // city
        if (!form.city.value.match(cityRegex)) {
            document.getElementById("cityErrorMsg").innerText = "Mauvaise ville";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
        }

        if (control) {
            return true;
        } else {
            return false;
        }
    }


    function ValidationForm() {

        let btnOrder = document.getElementById("order");

        btnOrder.addEventListener("click", function (event) {
            let form = document.querySelector(".cart__order__form");
            event.preventDefault();

            if (localStorage.length !== 0) {

                if (ValidationRegex(form)) {
                    console.log("Le formulaire est BIEN remplis")

                    let contact = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        address: form.address.value,
                        city: form.city.value,
                        email: form.email.value,
                    }

                    // array localStorage
                    let getLocalStorage = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;

                    }

                    const order = {
                        contact: contact,
                        products: getLocalStorage,
                    };

                    const options = {
                        method: "POST",
                        body: JSON.stringify(order),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    };

                    fetch("http://localhost:3000/api/products/order/", options)
                        .then((response) => response.json())
                        .then(function (data) {
                            // c est transmettre un paramètre d URL
                            window.location.href = "confirmation.html?id=" + data.orderId;
                        })
                        .catch(function (error) {
                            alert("Error fetch order" + error.message);
                        })

                } else {
                    event.preventDefault();
                    alert("Le formulaire est MAL remplis");
                }

            } else {
                event.preventDefault();
                alert("Votre panier est vide.")
            }


        })
    }


})