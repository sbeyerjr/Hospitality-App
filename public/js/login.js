function handleLoginSubmit() {
    $(".js-login-form").on("submit", event => {
      event.preventDefault();

      const loginForm = $(event.currentTarget);
      const loginUser = {
        username: loginForm.find(".js-username-entry").val(),
        password: loginForm.find(".js-password-entry").val()
      };

      api.create("/login", loginUser)
        .then(response => {
          store.authToken = response.authToken;
          store.authorized = true;
          loginForm[0].reset();
    
          return Promise.all([
            api.search("/hospitals")
          ]);
          displayData();
        })
        
        .catch(handleErrors);
    });
  }

  function displayData() {
      $('.js-hospitals').removeClass('hidden');

  }
  $(handleLoginSubmit);