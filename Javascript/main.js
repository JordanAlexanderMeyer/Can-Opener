var topic = document.getElementById('topic');
var side = document.getElementById('side');
var submit = document.getElementById('submit');
var roomValue = '';

document.getElementById("submit").disabled = true;
topic.addEventListener("change", populate);
side.addEventListener("change", enableButton);
submit.addEventListener("click", pressedSubmit);

function pressedSubmit() {
	var topicValue = topic.value;
	var sideValue = side.value;
	var serverdown = "MoshPit";
	var query = `query GetNum($topicValue: String!, $sideValue: String!) {
		getNum(topic: $topicValue, side: $sideValue)
	}`;

	fetch('/api', {
	 	method: 'POST',
	 	headers: {
	  		'Content-Type': 'application/json',
	    	'Accept': 'application/json',
	  	},
	  	body: JSON.stringify({
	    	query,
	    	variables: { topicValue, sideValue },
	  	})
	})
	.then(r => r.json())
	.then(function(data) {
		console.log(data['data']['getNum']);
		roomValue = data['data']['getNum'];
		location.href = `call.html?topic=${topicValue}&side=${sideValue}&room=${roomValue}`;
	})
	.catch(function(error) {
		console.log(error);
	  	location.href = `call.html?topic=${topicValue}&side=${sideValue}&room=${serverdown}`;
	});

}

function populate() {
	side.innerHTML = "";
	if(topic.value == "default") {
		var optionArray = ["default|Choose Your Side"];
	} else if(topic.value == "abortion") {
		var optionArray = ["default|Choose Your Side", "pro_life|Pro-Life", "pro_choice|Pro-Choice"];
	} else if(topic.value == "gun_control") {
		var optionArray = ["default|Choose Your Side", "for|For", "against|Against"];
	}
	for(var option in optionArray) {
		var pair = optionArray[option].split("|");
		var newOption = document.createElement("option");
		newOption.value = pair[0];
		newOption.innerHTML = pair[1];
		side.options.add(newOption);
	}
	enableButton();
}

function enableButton() {
	if(topic.value != 'default' && side.value != 'default') {
		document.getElementById('submit').disabled = false;
	} else {
		document.getElementById('submit').disabled = true;
	}
}