const API_URL = '';

function IsEmptyOrWhiteSpace(str) {
	return (str.match(/^\s*$/) || []).length > 0;
}

async function PostData(url, data) {
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return response.json();
}

function IsEmailValid(email) {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
}

function getCookie(cname) {
	var name = cname + '=';
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');

	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

function checkCookie(cname) {
	var thisCookie = getCookie(cname);
	if (thisCookie != '') {
		return true;
	} else {
		return false;
	}
}

function setCookie(cname, cvalue, exhours) {
	var d = new Date();
	d.setTime(d.getTime() + exhours * 60 * 60 * 1000);
	var expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + '; path=/; Secure; SameSite;';
}

function handleRedirection() {
	if (window.location.href.includes('index.html')) {
		if (!checkCookie('QM_User')) {
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/login.html');
		}
	}

	if (window.location.href.includes('login.html')) {
		if (checkCookie('QM_User')) {
			window.location.replace(window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/index.html');
		}
	}
}
