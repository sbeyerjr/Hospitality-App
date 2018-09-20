var MOCK_PATIENTS = {
    "patients": [
        {
            "id": "11111",
            "firstName": "John",
            "lastName": "Smith",
            "roomNumber": "3532",
            "wantsVisitors": "yes",
            "notes": "It went great"
        },
        {
            "id": "22222",
            "firstName": "Jane",
            "lastName": "Doe",
            "roomNumber": "3532",
            "wantsVisitors": "yes",
            "notes": "It went great"
        },
        {
            "id": "33333",
            "firstName": "Walt",
            "lastName": "Disney",
            "roomNumber": "3532",
            "wantsVisitors": "yes",
            "notes": "It went great"
        },
    ]
}

function getRecentPatients(callbackFn) {
    setTimeout(function() { callbackFn(MOCK_PATIENTS)}, 1);
}

function displayPatients (data) {
    for (index in data.patients) {
        $('.js-patients').append(
            '<p>' + data.patients[index].firstName + ' ' +  data.patients[index].lastName + '</p>'
        );
    }
}

function getAndDisplayPatients() {
    getRecentPatients(displayPatients);
}

$(function(){
    getAndDisplayPatients();
})