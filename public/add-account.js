function watchSubmitButton () {
    $(document).on('submit','#new-account', function(event) {
        event.preventDefault();
        submitAccountData();
    });
};

function submitAccountData () {
    let userInfo = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        username: $('#username').val(),
        password: $('#password').val()
    }
    console.log(userInfo);
    $.ajax({
        url: '/users',
        type: 'POST',
        data: JSON.stringify(userInfo),
        contentType: 'application/json'
    })
    .done(() => {
        window.location.href = 'dashboard.html';
    })
    .fail( err => {
        console.log('Error: ', err.message);
    })
};

$(watchSubmitButton);