let score = 0;
let seconds = 30;
let timerId;
let imageTimer;
let count = 0; // used to give each ball a unique id
let removeTimers = {}; // keep each ball's remove timeout so we can clearTimeout them

function addScore(){
    score++;
    $("#score").text(score + " pts");
}

function randomX(){
    return Math.floor(Math.random() * ($("#gamespace").width() - 100));
}

function randomY(){
    return Math.floor(Math.random() * ($("#gamespace").height() - 100));
}

function timer(){

    $("#timer").text(seconds + " seconds left.");

    $("#timer").show();

    if(seconds == 0){

        // stop everything when time runs out
        clearTimeout(timerId);
        clearTimeout(imageTimer);

        for(let id in removeTimers){
            clearTimeout(removeTimers[id]);
        }
        removeTimers = {};

        // remove leftover balls so they are not visible or clickable
        $("#gamespace").empty();

        alert("Game over! Your score is " + score + " pts.");

        resetGame();

    }else{

        seconds--;
        timerId = setTimeout(timer, 1000);

    }

}

function randomInterval(){
    return Math.floor(Math.random() * 2001); // 0 to 2000 ms
}

function randomRemoveTime(){
    return Math.floor(Math.random() * 2001) + 500; // 500 to 2500 ms
}

function addImage(){

    let xPos = randomX();
    let yPos = randomY();
    let ballId = "ball" + count; // unique id for this ball

    $("#gamespace").append(
        `<img id="${ballId}" src="img/soccerball.png" class="soccerBall" style="left: ${xPos}px; top: ${yPos}px;" alt="Soccer Ball">`
    );

    count++;

    // make this ball disappear on its own after a random time
    removeTimers[ballId] = setTimeout(function(){
        $("#" + ballId).remove();
        delete removeTimers[ballId];
    }, randomRemoveTime());

    imageTimer = setTimeout(addImage, randomInterval());

}

function resetGame(){

    // reset so the player can start a new game
    score = 0;
    seconds = 30;
    count = 0;

    $("#score").text("0 pts");
    $("#timer").text("30 seconds left.");
    $("#timer").hide();
    $("#gamespace").empty();

    // turn Start click back on
    $("#start_button").on("click", function() {
        $(this).off("click"); // stop Start from being clicked again
        gameBeginning();
    });

}

function gameBeginning(){

    timer();

    addImage();

}

$(document).ready(function() {

    $("footer").load("load.html");
    
    let gamerName = prompt("What is your first name?");

    $("#welcome").text(`Are you ready to play Soccer POP, ${gamerName}?`);
    
    $("#start_button").css({

        width: "150px",
        height: "50px",
        fontSize: "18px",
        backgroundColor: "red",
        color: "white"

    });

    //make images clickable even if they are added later
    $("#gamespace").on("click", ".soccerBall", function(){
        let ballId = $(this).attr("id");

        // clear auto-remove timeout because the player already clicked it
        if(ballId && removeTimers[ballId]){
            clearTimeout(removeTimers[ballId]);
            delete removeTimers[ballId];
        }

        addScore();
        $(this).remove(); // clicked image disappears
    });
    
    $("#start_button").on("click", function() {
        $(this).off("click"); // stop Start from being clicked again
        gameBeginning();
    });

});
