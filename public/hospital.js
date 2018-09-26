

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

function getHospitals() {
        let data = $.get('/hospitals');
        console.log(data);
        for (index in data) {
            $('.js-hospitals').append(
             '<p>' + data[index].Hospital.responseJSON.hospital + '</p>');
         }
}

// function getRecentHospitals(callbackFn) {
// 	setTimeout(function(){ callbackFn(getHospitals)}, 1);
// }

// function displayHospitals(data) {
//     console.log(data);
//     for (index in data.hospitals) {
// 	   $('.js-hospitals').append(
//         '<p>' + data.hospitals[index].name + '</br>' + data.hospitals[index].location + '</p>');
//     }
// }


// function getAndDisplayHospitals() {
// 	getRecentHospitals(displayHospitals);
// }

$(function() {
	getHospitals();
})