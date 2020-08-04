mapboxgl.accessToken = 'pk.eyJ1IjoibjIwYXdhbCIsImEiOiJjazl3OGN1dzgwMzg0M2xweG53ZGJkaXQwIn0.kg0wmihEkTHcnYqf_mrJeA';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: post.geometry.coordinates,
  zoom: 5
});

// create a HTML element for location/marker
let el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add it to the map
new mapboxgl.Marker(el)
  	.setLngLat(post.geometry.coordinates)
  	.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  	.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
  	.addTo(map);

// Toggle edit review form
$('.toggle-edit-form').on('click', function(){
	// toggle the edit button text 
	$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
	// toggle the visibility of the edit form 
	$(this).siblings('.edit-review-form').toggle();
})

// Add click listener for the clear rating button
$('.clear-rating').click(function() {
  $('.input-no-rate').click();
})
