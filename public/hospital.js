var MOCK_HOSPITALS = {
	"hospitals": [
        {
            "id": "1111111",
            "name": "Honor Health",
            "location": "123 Main Street"
        },
        {
            "id": "2222222",
            "name": "Willis Knighton Health",
            "location": "325 Elm Street"
        },
        {
            "id": "333333",
            "name": "Osborne Health",
            "location": "367 Sycamore Ave"
        },
        {
            "id": "4444444",
            "name": "Trinity Health",
            "location": "632 Main Street"
        }
    ]
};

function getRecentHospitals(callbackFn) {
	setTimeout(function(){ callbackFn(MOCK_HOSPITALS)}, 1);
}

function displayHospitals(data) {
    for (index in data.hospitals) {
	   $('body').append(
        '<p>' + data.hospitals[index].name + '</br>' + data.hospitals[index].location + '</p>');
    }
}

function getAndDisplayHospitals() {
	getRecentHospitals(displayHospitals);
}

$(function() {
	getAndDisplayHospitals();
})