let errorMessage = document.querySelector('#entry-err-message');

let loginToggle = document.querySelector('#entry-toggle [data-form="login-form"]');
loginToggle.addEventListener('click', function (e) {
	errorMessage.style.display = 'none';

	let loginForm = document.querySelector('.entry-form-container#login-form');
	let regForm = document.querySelector('.entry-form-container#reg-form');

	if (!loginForm.classList.contains('active')) {
		loginForm.classList.add('active');
		loginForm.classList.remove('inactive');

		regForm.classList.remove('active');
		regForm.classList.add('inactive');
	}
});

let regToggle = document.querySelector('#entry-toggle [data-form="reg-form"]');
regToggle.addEventListener('click', function (e) {
	errorMessage.style.display = 'none';

	let loginForm = document.querySelector('.entry-form-container#login-form');
	let regForm = document.querySelector('.entry-form-container#reg-form');

	if (!regForm.classList.contains('active')) {
		regForm.classList.add('active');
		regForm.classList.remove('inactive');

		loginForm.classList.remove('active');
		loginForm.classList.add('inactive');
	}
});

let loginFormSubmit = document.querySelector('#login-form [type="submit"]');
loginFormSubmit.addEventListener('click', function (e) {
	let email = document.querySelector('#login-form [name="email"]').value;
	let password = document.querySelector('#login-form [name="password"]').value;

	if (IsEmptyOrWhiteSpace(email) || IsEmptyOrWhiteSpace(password)) {
		errorMessage.innerHTML = 'Your email or password is invalid.';
		errorMessage.style.display = 'block';
		return;
	}

	PostData(API_URL + '/login', {email: email, password: password}).then((data) => {
		if (data.status == 'Success') {
			setCookie('QM_UserRole', data.userRole, 12);
			setCookie('QM_UserId', data.userId, 12);
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		} else if (data.status == 'Failed') {
			errorMessage.innerHTML = data.message;
			errorMessage.style.display = 'block';
		}
	});
});

let regFormSubmit = document.querySelector('#reg-form [type="submit"]');
regFormSubmit.addEventListener('click', function (e) {
	let firstName = document.querySelector('#reg-form [name="firstName"]').value;
	let lastName = document.querySelector('#reg-form [name="lastName"]').value;
	let email = document.querySelector('#reg-form [name="email"]').value;
	let password = document.querySelector('#reg-form [name="password"]').value;
	let confirmPassword = document.querySelector('#reg-form [name="confirmPassword"]').value;

	if (IsEmptyOrWhiteSpace(firstName) || IsEmptyOrWhiteSpace(lastName)) {
		errorMessage.innerHTML = 'Your first or last name is invalid.';
		errorMessage.style.display = 'block';
		return;
	}

	if (IsEmptyOrWhiteSpace(email) || !IsEmailValid(email)) {
		errorMessage.innerHTML = 'Your email is invalid.';
		errorMessage.style.display = 'block';
		return;
	}

	if (password !== confirmPassword) {
		errorMessage.innerHTML = 'Your passwords do not match.';
		errorMessage.style.display = 'block';
		return;
	}

	let userInfo = {firstName: firstName, lastName: lastName, email: email, password: password};

	PostData(API_URL + '/register', userInfo).then((data) => {
		if (data.status == 'Success') {
			setCookie('QM_UserRole', data.userRole, 12);
			setCookie('QM_UserId', data.userId, 12);
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		} else if (data.status == 'Failed') {
			errorMessage.innerHTML = data.message;
			errorMessage.style.display = 'block';
		}
	});
});
