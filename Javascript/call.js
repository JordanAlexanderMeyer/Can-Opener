var urlParams = new URLSearchParams(window.location.search);
var topicValue = urlParams.get('topic');
var sideValue = urlParams.get('side');
var roomValue = urlParams.get('room');

document.getElementById('videochat').src = "https://appr.tc/r/" + roomValue;

window.onbeforeunload = removeFromQueue;

function removeFromQueue() {
	//delete the pathname from the queue it is in
	var query = `query DelNum($topicValue: String!, $sideValue: String!, $roomValue: String!) {
		delNum(topic: $topicValue, side: $sideValue, room: $roomValue)
	}`;

	fetch('/api', {
	 	method: 'POST',
	 	headers: {
	  		'Content-Type': 'application/json',
	    	'Accept': 'application/json',
	  	},
	  	body: JSON.stringify({
	    	query,
	    	variables: { topicValue, sideValue, roomValue },
	  	})
	})
	.then(r => r.json())
	.then(function(data) {
		console.log(data['data']['delNum']);
	})
	.catch(function(error) {
		console.log(error);
	});
}