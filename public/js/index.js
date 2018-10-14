'use strict';

$(document).ready(function() {
  hospitality.bindEventListeners();

  hospitality.render();
});

function listenLogin() {
  $('.js-login').on('click', event => {
    $('.js-login-form').removeClass('hidden');
    $('.js-signup-from').addClass('hidden');
  });
}
function listenRegister() {
  $('.js-register').on('click', event => {
    $('.js-signup-from').removeClass('hidden');
    $('.js-login-form').addClass('hidden');
  });
}
function listenCancelRegister() {
  $('.js-signup-cancel').on('click', event => {
    $('.js-signup-from').addClass('hidden');
  });
}
function listenCancelLogin() {
  $('.js-login-cancel').on('click', event => {
    $('.js-login-form').addClass('hidden');
  });
}
function listenNewPatient() {
  $('.js-add-new-patient-btn').on('click', event => {
    $('.js-patient-edit-form').removeClass('hidden');
    $('.js-start-new-patient-form').addClass('hidden');
  });
}
$(listenLogin);
$(listenRegister);
$(listenCancelRegister);
$(listenCancelLogin);
$(listenNewPatient);
