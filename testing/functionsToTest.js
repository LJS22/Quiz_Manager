function IsEmailValid(email) {
	if (email.length == 0) return false;
	if (
		String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			) == null
	)
		return false;
	return true;
}
module.exports = IsEmailValid;

function IsEmptyOrWhiteSpace(str) {
	return (str.match(/^\s*$/) || []).length > 0;
}
module.exports = IsEmptyOrWhiteSpace;
