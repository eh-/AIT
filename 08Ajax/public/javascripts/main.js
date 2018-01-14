// TODO: add your JavaScript here!

function textEle(tag, textIn){
	let newNode = document.createElement(tag);
	newNode.appendChild(document.createTextNode(textIn));
	return newNode;
}

let filterBtn = document.querySelector('#filterBtn');
filterBtn.addEventListener('click', function(evt){
	evt.preventDefault();
	let filterUrl = 'api/places';
	let params = [];
	if(document.getElementsByName('location')[0].value)
		params.push('location=' + encodeURIComponent(document.getElementsByName('location')[0].value));
	if(document.getElementsByName('cuisine')[0].value !== '')
		params.push('cuisine=' + encodeURIComponent(document.getElementsByName('cuisine')[0].value));
	if(params.length){
		console.log(params);
		filterUrl += '?' + params.join('&');
	}
	let req = new XMLHttpRequest();
	req.open('GET', filterUrl, true);
	req.onload = function(){
		if(req.status >= 200 && req.status < 400){
			let restaurants = JSON.parse(req.responseText);
			let tableBody = document.querySelector('#places-list');
			for(let i = 0; i < restaurants.length; i++){
				let newRow = document.createElement('tr');
				newRow.appendChild(textEle('td', restaurants[i]['name']));
				newRow.appendChild(textEle('td', restaurants[i]['cuisine']));
				newRow.appendChild(textEle('td', restaurants[i]['location']));
				tableBody.appendChild(newRow);
			}
		}
	};
	req.send();
});