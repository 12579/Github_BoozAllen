// Javascript

window.addEventListener('load', function () {
    setTimeout(function () {
        $('.mainWrapper').addClass('start');
    }, 500);

    $(document).ready(function(){
        $('#forgotPassword').click(function (e) {
            e.preventDefault();
            $('.formGroup.step1').fadeOut();
            $('.forgotText').fadeIn();
            $(this).fadeOut();
            $('.loginForm').addClass('forgotOpen');
            $('.error.user').fadeOut();
        });
        
        $('#loginSubmit').click(function(e){
            if(!$('.loginForm').hasClass('forgotOpen')){
                e.preventDefault();
                $('.loginForm form').addClass('hasError');
                $('.error.user').fadeIn();
            }
            else { 
                $('.error.user').fadeOut();
                $('.error.email').fadeIn();
                e.preventDefault();
            }
        });
    });
});