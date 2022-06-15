document.addEventListener("DOMContentLoaded", function () {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let ApiArray = [];

        // on stocke les informations sur le localstorage.
        let localStorageArray = getLocalStorageProduct();

        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        DisplayProduct(AllProducts);

        DisplayTotalPrice(AllProducts);

        Listen(AllProducts);

        ValidationForm()
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
            // On push nos nouvels informations dans notre Html
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
    //là je déclare ma fonction ecoutedeleteProduct

    function ecoutedeleteProduct(AllProducts) {

        const allDeleteBtn = document.querySelectorAll('.deleteItem');
        allDeleteBtn.forEach(deletebtn => {
            deletebtn.addEventListener("click", event => {

                //console.log(deletebtn.closest("h2").dataset.id);
                //console.log((deletebtn.closest("article").children[1].children[0].children[0]).innerHTML);
                let productName = (deletebtn.closest("article").children[1].children[0].children[0]).innerHTML;
                let productQuantity = (deletebtn.closest("article").children[1].children[1]).children[0].children[1].value;
                let productPrice = (deletebtn.closest("article").children[1].children[0].children[2]).innerHTML;
                let productColor = deletebtn.closest("article").dataset.color;
                //console.log(parseInt(productQuantity));
                //console.log(parseInt(productPrice.split(" ")[0]));
                //console.log(`${productName} ${productColor}`);
                localStorage.removeItem(`${productName} ${productColor}`);
                //let afterDelete = AllProducts.filter(product => product.id != deletebtn.closest("article").dataset.id)
                //console.log(afterDelete);
                deletebtn.closest("article").remove();
                let totalProductPrice = parseInt(productQuantity) * parseInt(productPrice.split(" ")[0]);

                //doit update du coup le prix et la quantité totale
                const DtotalQty = document.getElementById("totalQuantity");
                //console.log(DtotalQty);
                const DtotalPrice = document.getElementById("totalPrice");
                DtotalQty.innerHTML = DtotalQty.innerHTML - productQuantity;
                //console.log(DtotalPrice);
                DtotalPrice.innerHTML = DtotalPrice.innerHTML - totalProductPrice;
                //console.log(DtotalPrice);
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

        // Si une des valeurs dans nos inputs de notre Form on affiche un méssage d'érreur.
        if (!form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }



        if (!form.lastName.value.match(stringRegex)) {
            document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }



        //
        if (!form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = "Mauvaise adresse";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }

        //
        if (!form.address.value.match(addressRegex)) {
            document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("addressRegex").innerText = "";

        }


        //
        if (!form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = "Mauvaise adresse";
            control = false;
            // Sinon on affiche rien
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }

        //
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

                    console.log("tout à fonctionner")
                    // il suffit de faire 2 array 1: avec les info du formulaire
                    // 2: toutes les infos du localstorage
                    // on regroupe les 2 dans un objet order
                    // on envois en ajax

                } else {
                    event.preventDefault();
                    alert("Le formulaire est mal remplis");
                }

            } else {
                event.preventDefault();
                alert("Votre panier est vide.")
            }


        })
    }


})