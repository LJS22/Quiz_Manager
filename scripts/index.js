let userId = getCookie('QM_UserId');
let userRole = getCookie('QM_UserRole');
let quizzes;
let settingsButton = document.querySelector('header span#settings');
let logoutButton = document.querySelector('.logout');
let quizContainer = document.querySelector('#quiz-list');
let closeButton = document.querySelector('#close');
let settingsList = document.querySelector('header ul');

if (userRole == 'GlobalAdmin') {
	let editQuizTitle = document.querySelector('#edit-quiz-title');
	let editQuizText = document.querySelector('#edit-quiz-text');

	editQuizTitle.classList.add('active');
	editQuizText.classList.add('active');

	editQuizTitle.classList.remove('inactive');
	editQuizText.classList.remove('inactive');
}

logoutButton.addEventListener('click', function (e) {
	document.cookie = 'QM_UserRole' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite;';
	document.cookie = 'QM_UserId' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite;';
	window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/login.html');
});

closeButton.addEventListener('click', function (e) {
	changePage('home-page');
});

function changePage(pageId) {
	if (settingsList.classList.contains('active')) {
		settingsList.classList.remove('active');
		settingsList.classList.add('inactive');
	}

	let currentPage = document.querySelector('section.active-flex');

	if (pageId === currentPage.id) return;

	currentPage.classList.add('inactive');
	currentPage.classList.remove('active-flex');

	let pageToShow = document.querySelector('section#' + pageId);

	pageToShow.classList.remove('inactive');
	pageToShow.classList.add('active-flex');
}

document.querySelectorAll('[data-page]').forEach((pageButton) => {
	pageButton.addEventListener('click', function (e) {
		changePage(this.getAttribute('data-page'));
	});
});

settingsButton.addEventListener('click', function (e) {
	if (settingsList.classList.contains('inactive')) {
		settingsList.classList.add('active');
		settingsList.classList.remove('inactive');
		return;
	}

	settingsList.classList.remove('active');
	settingsList.classList.add('inactive');
});

function loadQuizzes() {
	GetData(API_URL + '/getallquizzes?userRole=' + getCookie('QM_UserRole')).then((data) => {
		data = JSON.parse(data.body);
		if (data.Status == 'Success') {
			quizContainer.innerHTML = '';
			quizzes = data.quizzes;
			for (let quiz of data.quizzes) {
				buildQuizCard(quiz);
			}
		} else if (data.status == 'Failed') {
			console.error(data.message);
		}
	});
}

function buildQuizCard(quiz) {
	let card = document.createElement('div');
	card.setAttribute('data-quizId', quiz.quizId);

	let name = document.createElement('h3');
	name.innerText = quiz.quizName;

	card.append(name);
	quizContainer.append(card);

	card.addEventListener('click', function (e) {
		let quizId = this.getAttribute('data-quizId');

		for (let quiz of quizzes) {
			if (quiz.quizId === quizId) {
				buildQuizPage(quiz);
			}
		}
	});
}

function buildQuizPage(quiz) {
	let questionsContainer = document.querySelector('section#quiz-page #question-container');
	questionsContainer.innerHTML = '';

	let title = document.querySelector('section#quiz-page h2');
	title.id = quiz.quizId;
	title.innerText = quiz.quizName;

	for (let question of quiz.quizContent) {
		let questionWrapper = document.createElement('div');
		questionWrapper.classList.add('question-wrapper');

		let questionEle = document.createElement('h4');
		questionEle.innerText = Object.keys(question)[0];

		inputAndLabel = createTextAndLabelInput(Object.keys(question)[0], 'question');

		questionWrapper.append(questionEle, inputAndLabel[0], inputAndLabel[1]);

		if (userRole !== 'User') {
			let correctAnswer = document.createElement('p');
			correctAnswer.innerText = Object.values(question)[0].Correct;
			correctAnswer.setAttribute('data-question', Object.keys(question)[0]);
			correctAnswer.id = 'Correct';

			inputAndLabel = createTextAndLabelInput(Object.values(question)[0].Correct, 'correctAnswer');

			questionWrapper.append(correctAnswer, inputAndLabel[0], inputAndLabel[1]);

			for (let wrongAnswer of Object.values(question)[0].Wrong) {
				let wrongAnswerEle = document.createElement('p');
				wrongAnswerEle.innerText = wrongAnswer;
				wrongAnswerEle.setAttribute('data-question', Object.keys(question)[0]);
				wrongAnswerEle.id = 'wrong';

				inputAndLabel = createTextAndLabelInput(wrongAnswer, 'wrongAnswer');

				questionWrapper.append(wrongAnswerEle, inputAndLabel[0], inputAndLabel[1]);
			}
		}

		questionsContainer.append(questionWrapper);
	}

	if (userRole === 'GlobalAdmin') {
		let editWrapper = document.createElement('div');
		editWrapper.id = 'edit-buttons';

		let cancelButton = document.createElement('button');
		cancelButton.classList.add('inactive', 'blue-background');
		cancelButton.id = 'cancel-edit';
		cancelButton.innerText = 'Cancel Edit';

		let editButton = document.createElement('button');
		editButton.classList.add('blue-background');
		editButton.id = 'enable-edit';
		editButton.innerText = 'Edit Mode';

		let saveButton = document.createElement('button');
		saveButton.classList.add('inactive', 'blue-background');
		saveButton.id = 'save-edit';
		saveButton.innerText = 'Save Changes';

		editButton.addEventListener('click', enableEditMode);
		cancelButton.addEventListener('click', cancelEditMode);
		saveButton.addEventListener('click', saveEdit);

		editWrapper.append(cancelButton, editButton, saveButton);

		questionsContainer.append(editWrapper);
	}

	changePage('quiz-page');
}

function createTextAndLabelInput(value, name) {
	let input = document.createElement('textarea');
	input.type = 'text';
	input.value = value;
	input.name = name;
	input.rows = name == 'question' ? '3' : '1';
	input.classList.add('inactive');
	input.style.resize = 'none';
	input.id = name;
	let label = document.createElement('label');
	label.for = name;
	label.classList.add('inactive');

	return [input, label];
}

function enableEditMode() {
	let cancelButton = document.querySelector('#cancel-edit');
	cancelButton.classList.remove('inactive');

	let editButton = document.querySelector('#enable-edit');
	editButton.classList.add('inactive');

	let saveButton = document.querySelector('#save-edit');
	saveButton.classList.remove('inactive');

	document.querySelectorAll('.question-wrapper').forEach((questionWrapper) => {
		for (let childEle of questionWrapper.childNodes) {
			if (childEle.nodeName.toLowerCase() == 'textarea' || childEle.nodeName.toLowerCase() == 'label') {
				childEle.classList.remove('inactive');
				childEle.classList.add('active');
			} else {
				childEle.classList.add('inactive');
			}
		}
	});
}

function cancelEditMode() {
	let cancelButton = document.querySelector('#cancel-edit');
	cancelButton.classList.add('inactive');

	let editButton = document.querySelector('#enable-edit');
	editButton.classList.remove('inactive');

	let saveButton = document.querySelector('#save-edit');
	saveButton.classList.add('inactive');

	document.querySelectorAll('.question-wrapper').forEach((questionWrapper) => {
		for (let childEle of questionWrapper.childNodes) {
			if (childEle.nodeName.toLowerCase() == 'textarea' || childEle.nodeName.toLowerCase() == 'label') {
				childEle.classList.add('inactive');
				childEle.classList.remove('active');
			} else {
				childEle.classList.remove('inactive');
			}
		}
	});
}

function saveEdit() {
	let cancelButton = document.querySelector('#cancel-edit');
	cancelButton.classList.add('inactive');

	let editButton = document.querySelector('#enable-edit');
	editButton.classList.remove('inactive');

	let saveButton = document.querySelector('#save-edit');
	saveButton.classList.add('inactive');

	let newQuizItem = {
		quizName: document.querySelector('#quiz-page h2').innerText,
		quizId: document.querySelector('#quiz-page h2').id,
		quizContent: [],
	};

	document.querySelectorAll('.question-wrapper').forEach((questionWrapper) => {
		let questionsAndAnswers = {};

		for (let childEle of questionWrapper.childNodes) {
			if (childEle.nodeName.toLowerCase() == 'textarea') {
				let newText = childEle.value;
				let previousSibling = childEle.previousSibling;
				previousSibling.innerText = newText;

				if (previousSibling.nodeName.toLowerCase() == 'h4') {
					questionsAndAnswers[newText] = {
						Correct: '',
						Wrong: [],
					};

					for (let children of questionWrapper.childNodes) {
						if (children.nodeName.toLowerCase() == 'p') {
							children.setAttribute('data-question', newText);
						}
					}
				} else {
					if (previousSibling.id == 'Correct') {
						questionsAndAnswers[previousSibling.getAttribute('data-question')].Correct = previousSibling.innerText;
					} else {
						questionsAndAnswers[previousSibling.getAttribute('data-question')].Wrong.push(previousSibling.innerText);
					}
				}

				childEle.classList.add('inactive');
				childEle.classList.remove('active');
			} else if (childEle.nodeName.toLowerCase() == 'label') {
				childEle.classList.add('inactive');
				childEle.classList.remove('active');
			} else {
				childEle.classList.remove('inactive');
			}
		}

		newQuizItem.quizContent.push(questionsAndAnswers);
	});

	PostData(API_URL + '/updatequiz', newQuizItem).then((data) => {
		data = JSON.parse(data.body);
		if (data.Status == 'Success') {
			loadQuizzes();
		} else if (data.Status == 'Failed') {
			console.error('UPDATE FAILED');
		}
	});
}

function getUserInfo() {
	GetData(API_URL + '/getuser?userId=' + userId).then((data) => {
		data = JSON.parse(data.body);
		if (data.Status == 'Success') {
			displayUserInfo(data.user);
		} else if (data.Status == 'Failed') {
			console.error('User not found');
		}
	});
}

function displayUserInfo(user) {
	document.querySelector('#firstName').innerText = user.firstName;
	document.querySelector('#lastName').innerText = user.lastName;
	document.querySelector('#email').innerText = user.email;
}

loadQuizzes();
getUserInfo();
