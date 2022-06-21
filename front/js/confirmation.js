document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        const url = new URL(window.location.href);
        document.getElementById("orderId").innerText = url.searchParams.get("id");

        localStorage.clear();

    }

    main();

});
