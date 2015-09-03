window.onload = function () {
    setTimeout(function () {
        var body = document.querySelector('div#loginPage');
        if (!!body) {
            body.classList.add('start');
        }
    }, 1000);

};
jQuery.noConflict();
jQuery('document').ready(function ($) {


    $('.navToggle').on("click", function () {
        $('.boardNav > ul').toggleClass('open');
    });


});