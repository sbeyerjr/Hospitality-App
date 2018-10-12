"use strict";

$(document).ready(function () {
  hospitality.bindEventListeners();

  hospitality.render();

});
function listenLogin(){
  $('.js-login').on('click', event => {
    $('.js-login-form').removeClass('hidden');
    
    
});
}
function listenRegister(){
  $('.js-register').on('click', event => {
    $('.js-signup-from').removeClass('hidden');
    
    
});
}
$(listenLogin);
$(listenRegister);