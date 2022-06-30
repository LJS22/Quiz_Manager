const IsEmptyOrWhiteSpace = require('./functionsToTest');

test('Empty String to return true', () => {
	expect(IsEmptyOrWhiteSpace('')).toBe(true);
});
test('Single space to return true', () => {
	expect(IsEmptyOrWhiteSpace(' ')).toBe(true);
});
test('Single tab to return true', () => {
	expect(IsEmptyOrWhiteSpace('    ')).toBe(true);
});
test('Single character to return false', () => {
	expect(IsEmptyOrWhiteSpace('a')).toBe(false);
});
test('Word to return false', () => {
	expect(IsEmptyOrWhiteSpace('luke')).toBe(false);
});
test('Sentence to return false', () => {
	expect(IsEmptyOrWhiteSpace('This is a sentence.')).toBe(false);
});

const IsEmailValid = require('./functionsToTest.js');

// test('luke@pixelmax.com to return true', () => {
// 	expect(IsEmailValid('luke@pixelmax.com')).toBe(true);
// });
// test('lstobbart35@gmail.co.uk to return true', () => {
// 	expect(IsEmailValid('lstobbart35@gmail.co.uk')).toBe(true);
// });
// test('randomPerson@outlook.com to return true', () => {
// 	expect(IsEmailValid('randomPerson@outlook.com')).toBe(true);
// });
test('Single character to return false', () => {
	expect(IsEmailValid('@')).toBe(false);
});
test('luke@pixelmax to return false', () => {
	expect(IsEmailValid('luke@pixelmax')).toBe(false);
});
test('luke@pixelmax.xxx to return false', () => {
	expect(IsEmailValid('luke@pixelmax.xxx')).toBe(false);
});
