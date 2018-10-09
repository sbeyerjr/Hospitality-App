function createNewHospital() {
    $('#btn-hospital').click(event => {
        $('.hospital-form').removeClass('hidden');
    });
}

function getData(){
    const text = `
    <div class="patient-form">
    <form id="new-patient">
        <fieldset>
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName">
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName">
        <label for="roomNumber">Room Number</label>
        <input type="text" id="roomNumber" name="roomNumber">
        <button type="submit" id="submit-btn">Submit</button>
    </fieldset>
    </form>
    </div>`;
    $.getJSON('/hospitals', function(data) {
        for (i = 0; i <= data.hospitals.length -1; i++) {

            const displayHospitalName = `
            <div class="hospital-name">${data.hospitals[i].name}</div>
            <div class="hospital-btn">
            <button type="submit" id="btn-patient">Create New Patient</button>
        </div>
        <div class="patients${[i]} hidden">Test</div>`;

            $('.js-hospitals').append(displayHospitalName);
            $('#btn-patient').click(event => {
                $(`.patients${[i]}`).removeClass('hidden').html(text);
            });
        }
      });
      
    console.log(text);
   
}

$(function(){
    getData();
    createNewHospital();
    
})

