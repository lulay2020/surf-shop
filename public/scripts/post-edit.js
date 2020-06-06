let postEditForm = document.querySelector('#postEditForm');
postEditForm.addEventListener('submit', (event)=>{
	// find length of uploaded images
	let imageUploads = document.querySelector('#imageUpload').files.length;
	// find total length of existing images
	let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
	// find total number of potential deletions
	let checkedImgs = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
	let newTotal = imageUploads + existingImgs - checkedImgs; 
	if (newTotal > 4) {
		event.preventDefault();
		let removalAmt = newTotal - 4;
		alert(`You need to delete ${removalAmt} more image${removalAmt > 1 ? 's' : ''}!`);
	}
})
