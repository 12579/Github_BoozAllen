//window.onload = function () {
setTimeout(function () {
    var body = document.querySelector('div#loginPage');
    if (!!body) {
        body.classList.add('start');
    }
}, 1000);
var defaults = {}

//};
jQuery.noConflict();
jQuery('document').ready(function () {
    jQuery('.navToggle').on("click", function () {
        jQuery('.boardNav').toggleClass('open');
        jQuery('.toggleBox').addClass('active');
        jQuery('.menuOverlay').toggle();
    });
    jQuery('.menuOverlay').on('click', function () {
        jQuery('.toggleBox').removeClass('active');
        jQuery('.boardNav').removeClass('open');
        jQuery('.menuOverlay').hide();
    });
});


