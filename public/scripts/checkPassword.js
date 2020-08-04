const password = document.getElementById('password');
const validationMessage = document.getElementById('validation-message');
const submitBtn = document.getElementById('submit-btn');

password.addEventListener('input', ()=>{
	if (password.value.length < 6) {
		validatePassword('Password must be six characters !', 'color-red', 'color-green');
		submitBtn.setAttribute('disabled', true);
	} else {
		validatePassword('Password is valid !', 'color-green', 'color-red');
		submitBtn.removeAttribute('disabled');
	}
})

function validatePassword(message, add, remove) {
	validationMessage.textContent = message;
	validationMessage.classList.add(add);
	validationMessage.classList.remove(remove);
}