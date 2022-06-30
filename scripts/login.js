let errorMessage = document.querySelector('#entry-err-message');
let loginToggle = document.querySelector('#entry-toggle [data-form="login-form"]');
let regToggle = document.querySelector('#entry-toggle [data-form="reg-form"]');
let loginFormSubmit = document.querySelector('#login-form [type="submit"]');
let regFormSubmit = document.querySelector('#reg-form [type="submit"]');

loginToggle.addEventListener('click', function (e) {
	errorMessage.style.display = 'none';

	let loginForm = document.querySelector('.entry-form-container#login-form');
	let regForm = document.querySelector('.entry-form-container#reg-form');

	if (!loginForm.classList.contains('active')) {
		loginForm.classList.add('active-flex');
		loginForm.classList.remove('inactive');
		loginToggle.classList.add('blue-background');

		regForm.classList.remove('active-flex');
		regForm.classList.add('inactive');
		regToggle.classList.remove('blue-background');
	}
});

regToggle.addEventListener('click', function (e) {
	errorMessage.style.display = 'none';

	let loginForm = document.querySelector('.entry-form-container#login-form');
	let regForm = document.querySelector('.entry-form-container#reg-form');

	if (!regForm.classList.contains('active')) {
		regForm.classList.add('active-flex');
		regForm.classList.remove('inactive');
		regToggle.classList.add('blue-background');

		loginForm.classList.remove('active-flex');
		loginForm.classList.add('inactive');
		loginToggle.classList.remove('blue-background');
	}
});

loginFormSubmit.addEventListener('click', function (e) {
	let email = document.querySelector('#login-form [name="email"]').value;
	let password = document.querySelector('#login-form [name="password"]').value;

	if (IsEmptyOrWhiteSpace(email) || IsEmptyOrWhiteSpace(password)) {
		errorMessage.innerHTML = 'Your email or password is invalid.';
		errorMessage.style.display = 'block';
		return;
	}

	PostData(API_URL + '/loginUser', {email: email, password: password}).then((data) => {
		data = JSON.parse(data.body);
		if (data.Status == 'Success') {
			setCookie('QM_UserRole', data.userRole, 12);
			setCookie('QM_UserId', data.userId, 12);
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		} else if (data.Status == 'Failed') {
			errorMessage.innerHTML = data.message;
			errorMessage.style.display = 'block';
		}
	});
});

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

	PostData(API_URL + '/createuser', userInfo).then((data) => {
		data = JSON.parse(data.body);
		if (data.Status == 'Success') {
			setCookie('QM_UserRole', data.userRole, 12);
			setCookie('QM_UserId', data.userId, 12);
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		} else if (data.Status == 'Failed') {
			console.log(111);
			errorMessage.innerHTML = data.message;
			errorMessage.style.display = 'block';
		}
	});
});
