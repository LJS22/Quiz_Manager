let errorMessage = document.querySelector('#entry-err-message');

let loginToggle = document.querySelector('#entry-toggle button');
loginToggle.addEventListener('click', function (e) {
	let selectedForm = this.getAttribute('data-form');

	let loginForm = document.querySelector('.entry-form-container #login-form');
	let regForm = document.querySelector('.entry-form-container #login-form');

	if (selectedForm === 'login-form' && !loginForm.classList.contains('active')) {
		loginForm.classList.add('active');
		regForm.classList.remove('active');
	} else if (selectedForm === 'reg-form' && !regForm.classList.contains('active')) {
		regForm.classList.add('active');
		loginForm.classList.remove('active');
	}
});

let loginFormSubmit = document.querySelector('#login-form [type="submit"]');
loginFormSubmit.addEventListener('click', function (e) {
	let email = document.querySelector('#login-form [name="email"]').value;
	let password = document.querySelector('#login-form [name="password"]').value;

	if (IsEmptyOrWhiteSpace(email) || IsEmptyOrWhiteSpace(password)) {
		errorMessage.innerHTML = 'Your email or password is invalid.';
		errorMessage.getElementsByClassName.display = 'block';
		return;
	}

	PostData(API_URL + '/login', {email: email, password: password}).then((data) => {
		if (data.status == 'Success') {
			setCookie('QM_User', data.userRole, 12);
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		} else if (data.status == 'Failed') {
			errorMessage.innerHTML = data.message;
			errorMessage.getElementsByClassName.display = 'block';
		}
	});
});

let regFormSubmit = document.querySelector('#reg-form [type="submit"]');
regFormSubmit.addEventListener('click', function (e) {
	let firstName = document.querySelector('#reg-form [name="firstName"]').value;
	let lastName = document.querySelector('#reg-form [name="lastName"]').value;
	let email = document.querySelector('#reg-form [name="email"]').value;
	let password = document.querySelector('#reg-form [name="password"]').value;
	let passwordConfirm = document.querySelector('#reg-form [name="passwordConfirm"]').value;

	if (IsEmptyOrWhiteSpace(firstName) || IsEmptyOrWhiteSpace(lastName)) {
		errorMessage.innerHTML = 'Your first or last name is invalid.';
		errorMessage.getElementsByClassName.display = 'block';
		return;
	}

	if (IsEmptyOrWhiteSpace(email) || !IsEmailValid(email)) {
		errorMessage.innerHTML = 'Your email is invalid.';
		errorMessage.getElementsByClassName.display = 'block';
		return;
	}

	if (password !== passwordConfirm) {
		errorMessage.innerHTML = 'Your passwords do not match.';
		errorMessage.getElementsByClassName.display = 'block';
		return;
	}

	PostData(API_URL + '/register', {email: email, password: password}).then((data) => {
		if (data.status == 'Success') {
			setCookie('QM_User', data.userRole, 12);
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		} else if (data.status == 'Failed') {
			errorMessage.innerHTML = data.message;
			errorMessage.getElementsByClassName.display = 'block';
		}
	});
});
