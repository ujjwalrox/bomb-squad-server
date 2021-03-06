var score = 0;
var time = 60;
var timeleft = time;
var status = 0;
var x;
var rfid;


function startCountdown(){
    if (x != undefined) {
       timeleft = time; 
       status = 0;
    }
    $('#defused').prop('disabled', false);
    $('#exploded').prop('disabled', false);
    x = setInterval(function(){ progress() }, 1000);
}

function progress() {
    timeleft = timeleft - 1;
    status = ((time - timeleft)/time)*100;

    document.getElementById("countdown").innerHTML = timeleft + "s";
    document.getElementById("progressbar").style.width = status.toString() + "%";

    if (timeleft < 0) {
        explode();
        
    }
}

function explode(){

	clearInterval(x);
	timeleft = time;
	document.getElementById("countdown").innerHTML = "EXPLODED";
	document.getElementById("progressbar").style.width = "100%";
    var parameters = { state: 3, bomb: document.getElementById("bombNumber").innerHTML };
    $('#defused').prop('disabled', true);
    $('#exploded').prop('disabled', true);
    $.get('/changeState', parameters);
    score -= 30;
    document.getElementById("score").innerHTML = String(score);
}

function defuse(){
	clearInterval(x);
    timeleft = time;
	document.getElementById("countdown").innerHTML = "DEFUSED";
    var parameters = { state: 2, bomb: document.getElementById("bombNumber").innerHTML };
    $('#exploded').prop('disabled', true);
    $('#defused').prop('disabled', true);
    $.get('/changeState', parameters);
    score += 50;
    document.getElementById("score").innerHTML = String(score);

}

$(document).ready(function(){
    var socket = io.connect();
    console.log(socket);
    socket.on('updateHeader',function(data){
        if(timeleft == time || rfid !== data.rfid){
            if (timeleft > 0 && timeleft < time) {
                var parameters = { state: 3, bomb: document.getElementById("bombNumber").innerHTML };
                $.get('/changeState', parameters);
                score -= 30;
                document.getElementById("score").innerHTML = String(score);
                document.getElementById("bombNumber").innerHTML = String(data.bombnumber);
                rfid = data.rfid;
                clearInterval(x);
                startCountdown();
            }
            else{
                document.getElementById("bombNumber").innerHTML = String(data.bombnumber); 
                rfid = data.rfid;
                clearInterval(x);
                startCountdown();
            } 
        }
        
    });

});