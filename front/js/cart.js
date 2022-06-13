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
                localStorageArray[i].qty,
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
            // On push nos nouvels informations dans notre Html.
            domCreation.insertAdjacentHTML(
                "beforeend",
                `<article class="cart__item" data-id="${product._id}" data-color="${product.colors}">
                <div class="cart__item__img">
                  <img src="${product.imageurl}" alt="${product.altTxt}">
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
                    localstorageKey.qty = inputQty;
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

})
