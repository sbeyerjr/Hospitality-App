function submitLogListener () {
    $(document).on('submit','#new-hospital', function(event) {
        event.preventDefault();
        submitLog();
    });
};

function submitLog () {
    let logInfo = {
        name: $('#name').val(),
        location: $('#location').val(),
    }
    $.ajax({
        url: '/hospitals',
        type: 'POST',
        data: JSON.stringify(logInfo),
        contentType: 'application/json'
    })
    .done(() => {
        window.location.href = 'dashboard.html';
    })
    .fail( err => {
        console.log('Error: ', err.message);
        $('#new-hospital').append('Please Input Name for Hospital');
    })
};

$(submitLogListener);