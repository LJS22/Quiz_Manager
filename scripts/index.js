let userId = getCookie('QM_UserId');

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

let settingsButton = document.querySelector('header span#settings');
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
	GetData(API_URL + '/getAllQuizzes', {userId: userId}).then((data) => {
		if (data.status == 'Success') {
			for (let quiz of data.quizList) {
				buildQuizCard(quiz);
			}
		} else if (data.status == 'Failed') {
			console.error(data.message);
		}
	});
}

function getUserInfo() {
	GetData(API_URL + '/getUserData', {userId: userId}).then((data) => {
		if (data.status == 'Success') {
			displayUserInfo(data.user);
		} else if (data.status == 'Failed') {
			console.error(data.message);
		}
	});
}
