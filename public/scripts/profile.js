const submitBtn = document.getElementById('update-profile');
const newPassword = document.getElementById('new-password');
const confirmation = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');

confirmation.addEventListener('input', e =>{
	if (newPassword.value !== confirmation.value) {
		validatePassword('Password must match !', 'color-red', 'color-green');
		submitBtn.setAttribute('disabled', true);
	} else {
		validatePassword('Password match !', 'color-green', 'color-red');
		submitBtn.removeAttribute('disabled');
	}
});

function validatePassword(message, add, remove) {
	validationMessage.textContent = message;
	validationMessage.classList.add(add);
	validationMessage.classList.remove(remove);
}