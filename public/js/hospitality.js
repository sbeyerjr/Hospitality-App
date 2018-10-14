const hospitality = (function() {
  function showSuccessMessage(message) {
    const el = $('.js-success-message');
    el.text(message).show();
    setTimeout(() => el.fadeOut('slow'), 3000);
  }

  function showFailureMessage(message) {
    const el = $('.js-error-message');
    el.text(message).show();
    setTimeout(() => el.fadeOut('slow'), 3000);
  }

  function handleErrors(err) {
    if (err.status === 401) {
      store.authorized = false;
      hospitality.render();
    }
    showFailureMessage(err.responseJSON.message);
  }

  function render() {
    $('.signup-login').toggle(!store.authorized);

    

    const patientsList = generatePatientsList(
      store.patients,
      store.currentPatient
    );
    $('.js-patients-list').html(patientsList);

    const hospitalList = generateHospitalList(
      store.hospitals,
      store.currentQuery
    );
    $('.js-hospital-list').html(hospitalList);

    const hospitalSelect = generateHospitalSelect(store.hospitals);
    $('.js-patient-hospital-entry').html(hospitalSelect);

    const editForm = $('.js-patient-edit-form');
    editForm
      .find('.js-patient-title-entry')
      .val(store.currentPatient.firstName);
    editForm
      .find('.js-patient-content-entry')
      .val(store.currentPatient.lastName);
    editForm
      .find('.js-patient-hospital-entry')
      .val(store.currentPatient.hospitalId);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generatePatientsList(storePatient, currPatient) {
    const listItems = storePatient.map(
      item => `
          <li data-id="${item.id}" class="js-patient-element ${
        currPatient.id === item.id ? 'active' : ''
      }">
          <span style="font-weight:bold">${item.firstName} ${
        item.lastName
      }</span></br>
          <span>Room Number: ${item.roomNumber}</span></br>
          <span>Patient ${
            item.wantsVisitors === true
              ? 'wants visitors.'
              : 'does not want visitors'
          }</span></br>
          <span>Notes: ${item.notes}</span></br>
          <span>Hospital: ${item.hospital}</span></br>
          <button class="removeBtn js-patient-delete-button">X</button>
          <div class="metadata">
            </div>
        </li>`
    );
    return listItems.join('');
  }
  function generateHospitalList(list, currQuery) {
    const showAllItem = `
      <li data-id="" class="js-hospital-item ${
        !currQuery.hospitalId ? 'active' : ''
      }">
        <a href="#" class="name js-hospital-link">All</a>
      </li>`;

    const listItems = list.map(
      item => `
      <li data-id="${item.id}" class="js-hospital-item ${
        currQuery.hospitalId === item.id ? 'active' : ''
      }">
        <a href="#" class="name js-hospital-link">${item.name}</a>
        <button class="removeBtn js-hospital-delete">X</button>
      </li>`
    );

    return [showAllItem, ...listItems].join('');
  }

  function generateHospitalSelect(list) {
    const hospitals = list.map(
      item => `<option value="${item.name}">${item.name}</option>`
    );
    return '<option value="">Select Hospital:</option>' + hospitals.join('');
  }
  /**
   * HELPERS
   */
  function getPatientIdFromElement(item) {
    const id = $(item)
      .closest('.js-patient-element')
      .data('id');
    return id;
  }

  function getHospitalIdFromElement(item) {
    const id = $(item)
      .closest('.js-hospital-item')
      .data('id');
    return id;
  }

  /**
   * PATIENT EVENT LISTENERS AND HANDLERS
   */

  function handlePatientItemClick() {
    $('.js-patients-list').on('click', '.js-patient-link', event => {
      event.preventDefault();

      const patientId = getPatientIdFromElement(event.currentTarget);

      api
        .details(`/patients/${patientId}`)
        .then($('.js-patient-results').text('this is some text'))
        .catch(handleErrors);
    });
  }

  function handlePatientFormSubmit() {
    $('.js-patient-edit-form').on('submit', function(event) {
      event.preventDefault();
      const newFirstName = $('.js-patient-first-name-entry');
      const newLastName = $('.js-patient-last-name-entry');
      const newRoomNumber = $('.js-room-number-entry');
      const newWantsVisitors = $('.js-wants-visitors');
      const newNote = $('.js-patient-notes-entry');
      const newHospital = $('.js-patient-hospital-entry');
      const editForm = $(event.currentTarget);
      const patientObj = {
        id: store.currentPatient.id,
        firstName: editForm.find('.js-patient-first-name-entry').val(),
        lastName: editForm.find('.js-patient-last-name-entry').val(),
        roomNumber: editForm.find('.js-room-number-entry').val(),
        wantsVisitors: editForm.find('input[name=visitors]:checked').val(),
        notes: editForm.find('.js-patient-notes-entry').val(),
        hospital: editForm.find('.js-patient-hospital-entry').val()
      };

      if (store.currentPatient.id) {
        api
          .update(`/patients/${patientObj.id}`, patientObj)
          .then(updateResponse => {
            store.currentPatient = updateResponse;
            return api.search('/patients', store.currentQuery);
          })
          .then(response => {
            store.patients = response;
            render();
          })
          .catch(handleErrors);
      } else {
        $('.js-start-new-patient-form').removeClass('hidden');
        $('.js-patient-edit-form').addClass('hidden');
        api
          .create('/patients', patientObj)
          .then(createResponse => {
            store.currentPatient = createResponse;
            newFirstName.val('');
            newLastName.val('');
            newRoomNumber.val('');
            newWantsVisitors.val('');
            newNote.val('');
            newHospital.val('');
            return api.search('/patients', store.currentQuery);
          })
          .then(response => {
            store.patients = response;
            render();
          })
          .catch(handleErrors);
      }
    });
  }

  function handlePatientStartNewSubmit() {
    $('.js-start-new-patient-form').on('submit', event => {
      event.preventDefault();
      store.currentPatient = {};
      render();
    });
  }

  function handlePatientDeleteClick() {
    $('.js-patients-list').on('click', '.js-patient-delete-button', event => {
      event.preventDefault();
      const patientId = getPatientIdFromElement(event.currentTarget);

      api
        .remove(`/patients/${patientId}`)
        .then(() => {
          if (patientId === store.currentPatient.id) {
            store.currentPatient = {};
          }
          return api.search('/patients', store.currentQuery);
        })
        .then(response => {
          store.patients = response;
          render();
        })
        .catch(handleErrors);
    });
  }

  /**
   * HOSPITALS EVENT LISTENERS AND HANDLERS
   */
  function handleHospitalClick() {
    $('.js-hospitals-list').on('click', '.js-hospital-link', event => {
      event.preventDefault();

      const hospitalId = getHospitalIdFromElement(event.currentTarget);
      store.currentQuery.hospitalId = hospitalId;
      if (hospitalId !== store.currentPatient.hospitalId) {
        store.currentPatient = {};
      }

      api
        .search('/hospitals', store.currentQuery)
        .then(response => {
          store.patients = response;
          render();
        })
        .catch(handleErrors);
    });
  }

  function watchNewHospitalClick() {
    $('.js-add-hospital-btn').on('click', event => {
      $('.js-new-hospital-form').removeClass('hidden');
      $('.js-new-hospital').addClass('hidden');
    });
  }

  function handleNewHospitalSubmit() {
    $('.js-new-hospital-form').on('submit', event => {
      event.preventDefault();
      const newHospitalEl = $('.js-new-hospital-entry');
      const newHospitalLocation = $('.js-new-hospital-location');
      $('.js-new-hospital-form').addClass('hidden');
      $('.js-new-hospital').removeClass('hidden');
      api
        .create('/hospitals', {
          name: newHospitalEl.val(),
          location: newHospitalLocation.val()
        })
        .then(() => {
          newHospitalEl.val('');
          newHospitalLocation.val('');
          return api.search('/hospitals');
        })
        .then(response => {
          store.hospitals = response;
          render();
        })
        .catch(handleErrors);
    });
  }

  function handleHospitalDeleteClick() {
    $('.js-hospitals-list').on('click', '.js-hospital-delete', event => {
      event.preventDefault();
      const hospitalId = getHospitalIdFromElement(event.currentTarget);

      if (hospitalId === store.currentQuery.hospitalId) {
        store.currentQuery.hospitalId = null;
      }
      if (hospitalId === store.currentPatient.hospitalId) {
        store.currentPatient = {};
      }

      api
        .remove(`/hospitals/${hospitalId}`)
        .then(() => {
          const patientsPromise = api.search('/patients');
          const hospitalPromise = api.search('/hospitals');
          return Promise.all([patientsPromise, hospitalPromise]);
        })
        .then(([patients, hospitals]) => {
          store.patients = patients;
          store.hospitals = hospitals;
          render();
        })
        .catch(handleErrors);
    });
  }

  function handleSignupSubmit() {
    $('.js-signup-from').on('submit', event => {
      event.preventDefault();

      const signupForm = $(event.currentTarget);
      const newUser = {
        fullname: signupForm.find('.js-fullname-entry').val(),
        username: signupForm.find('.js-username-entry').val(),
        password: signupForm.find('.js-password-entry').val()
      };

      api
        .create('/users', newUser)
        .then(response => {
          signupForm[0].reset();
          showSuccessMessage(
            `Thank you, ${response.fullname ||
              response.username} for signing up! Please login.`
          );
        })
        .catch(handleErrors);
    });
  }

  function handleLoginSubmit() {
    $('.js-login-form').on('submit', event => {
      event.preventDefault();

      const loginForm = $(event.currentTarget);
      const loginUser = {
        username: loginForm.find('.js-username-entry').val(),
        password: loginForm.find('.js-password-entry').val()
      };

      api
        .create('/auth/login', loginUser)
        .then(response => {
          store.authToken = response.authToken;
          store.authorized = true;
          loginForm[0].reset();

          return Promise.all([
            api.search('/patients'),
            api.search('/hospitals')
          ]);
        })
        .then(([patients, hospitals]) => {
          store.patients = patients;
          store.hospitals = hospitals;

          render();
        })
        .catch(handleErrors);
    });
  }

  function bindEventListeners() {
    watchNewHospitalClick();
    handlePatientItemClick();
    handlePatientFormSubmit();
    handlePatientStartNewSubmit();
    handlePatientDeleteClick();
    handleHospitalClick();
    handleNewHospitalSubmit();
    handleHospitalDeleteClick();
    handleSignupSubmit();
    handleLoginSubmit();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
})();
