const apiKey='mIEK4fc9VpCjQAWHcZldPbrT01aRBtcTz3BH7RtGwFCZB5MBB9'
const secretKey='xw9uBSNDhw68IDtYE0KgaBHNLWy2sM2a2JV2VehH';
let token=''


const petForm= document.getElementById("pet-form");

petForm.addEventListener("submit",fetchAnimals);

function isValidate(zip){
	return /^\d{5}(-\d{4})?$/.test(zip)
}

async function fetchAnimals(e){
	e.preventDefault();
	const animal=document.getElementById("animal").value;
	const zip=document.getElementById("zip").value;
	if(!isValidate(zip)){
		showAlert("Enter a valid zipcode","alert-danger")
		return;
	}
	await fetchToken();
	let bearer= `Bearer ${token}`
	const url=`https://cors-anywhere.herokuapp.com/https://api.petfinder.com/v2/animals?type=${animal}&location=${zip}`
	fetch(url,{
		method:'GET',
		headers:{
			'Authorization':bearer
		}
	}).then(function(response){
		return response.json();
	}).then(function(data){
		showAnimals(data.animals)
	})
}

function showAnimals(pets){
	const results=document.getElementById("results");
	results.innerHTML='';
	let img='';
	pets.forEach(function(pet){
		console.log(pet);
		if(pet.photos[0]){
			img= pet.photos[0].medium;
		}

		const div= document.createElement("div");
		div.classList.add("card","card-body",'mb-3');
		div.innerHTML=`
			<div class='row'>
				<div class='col-sm-6'>
					<h4>${pet.name}  (${pet.age})</h4>
					<p class='text-secondary'>${pet.breeds.primary}</p>
					<p>${pet.contact.address.address1} ${pet.contact.address.address2} ${pet.contact.address.city}
						${pet.contact.address.state}  ${pet.contact.address.postcode}
					</p>
					<ul class='list-group'>
						<li class='list-group-item'>Phone: ${pet.contact.phone}</li>
						${pet.contact.email? `<li class="list-group-item">Email: ${pet.contact.email}</li>` : ""}
						<li class='list-group-item'>Shelter ID: ${pet.id}</li>
					</ul>
				</div>
				<div class='col-sm-6'>
					${img? `<img class='img-fluid rounded-circle mt-3 dog-images' src=${img} alt="photo">` : ""}
				</div>
			</div>
		`;
		results.appendChild(div)
	})
}

async function fetchToken(){
	const response=await fetch("https://api.petfinder.com/v2/oauth2/token", {
		body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
		headers: {
		"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "POST"
		}).then(function(response){
			return response.json();
		}).then(function(data){
			token=data.access_token;
	})
}


function showAlert(message,className){
	const div= document.createElement("div");
	div.className=`alert ${className}`;
	div.appendChild(document.createTextNode(message));
	const container=document.querySelector(".container");
	const form=document.querySelector("#pet-form");
	container.insertBefore(div,form);
	setTimeout(function(){
		document.querySelector(".alert").remove()
	},3000)
}