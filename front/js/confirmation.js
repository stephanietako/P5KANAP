document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {
        idUserOrder();

    }

    main();

    function idUserOrder() {
        //const userConfirmation = document.getElementsByClassName("confirmation");
        const orderIdNumb = document.getElementById("orderId");
        orderIdNumb.innerText = localStorage.getItem('idUserOrder');

        localStorage.clear()
    }














});
