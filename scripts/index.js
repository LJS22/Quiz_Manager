let userId = getCookie('QM_UserId');
let quizzes;
let settingsButton = document.querySelector('header span#settings');
let logoutButton = document.querySelector('.logout');
let quizContainer = document.querySelector('#quiz-list');

logoutButton.addEventListener('click', function (e) {
	document.cookie = 'QM_UserRole' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite;';
	document.cookie = 'QM_UserId' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite;';
	window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/login.html');
});

function changePage(pageId) {
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
	let settingsList = document.querySelector('header ul');

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
	title.innerText = quiz.quizName;

	for (let question of quiz.quizContent) {
		let questionWrapper = document.createElement('div');
		questionWrapper.classList.add('question-wrapper');

		let questionEle = document.createElement('h4');
		questionEle.innerText = Object.keys(question)[0];

		questionWrapper.append(questionEle);

		if (getCookie('QM_UserRole') === 'User') {
			let correctAnswer = document.createElement('p');
			correctAnswer.innerText = Object.values(question)[0].Correct;

			questionWrapper.append(correctAnswer);

			for (let wrongAnswer of Object.values(question)[0].Wrong) {
				let wrongAnswerEle = document.createElement('p');
				wrongAnswerEle.innerText = wrongAnswer;

				questionWrapper.append(wrongAnswerEle);
			}
		}

		questionsContainer.append(questionWrapper);
	}

	changePage('quiz-page');
}

loadQuizzes();

function getUserInfo() {
	GetData(API_URL + '/getUserData', {userId: userId}).then((data) => {
		data = JSON.parse(data.body);
		if (data.status == 'Success') {
			displayUserInfo(data.user);
		} else if (data.status == 'Failed') {
			console.error(data.message);
		}
	});
}
