//-------global variables--------------
var credits = 500; //beginning Credits
var winAmount = 0;
var soundOn = false; //boolean for sound
let randomNr = []; //array for 3 random numbers
var win = false; //boolean for win
var name = "";  //winning heading name
var creditsSpendNumber = ""; //spend number of credits

// Audio variables with path
const bgAudio = new Audio("sounds/vc_background.mp3");
const spinAudio = new Audio("sounds/spin.mp3");
const jackpotAudio = new Audio("sounds/jackpot.mp3");

// Audio volume
bgAudio.volume = 0.5;
spinAudio.volume = 0.3;
jackpotAudio.volume = 0.75;

//-------doc loaded--------------
$(document).ready(function(){
    //Show the new credits value
    $("#credits").html(credits);

    //Show random spins
    for(var i = 1; i <= 3; i++)
    {
        ranNum = Math.floor(Math.random() * 8);
        $('#' + i).html("<img src='img/" + ranNum + ".png' width='120vw' height='120vh' class='img'>");
    }
});

//-------functions --------------
function spin() //When spin button is pressed
{
    creditsSpendNumber = $("#selectAmountCredits").val() //select 

    win = false; //to avoid winning everytime

    if(credits === 0 || credits < creditsSpendNumber)  //if you dont have credits or if your selected amount is higher than your credits value
    {
        alert("you dont have enough credits!")
    }
    else
    {
        $("#btnSpin").prop("onclick", null) //remove the onclick attribute to avoid spamming this function

        $("#slotContainerFooter").fadeOut(""); //hide the bottom viv from the slot container

        credits  -= creditsSpendNumber; //pay credits to spin
        $("#credits").html(credits); //update the new credits value

        //shows slot 
        for(let i = 1; i <= 3; i++)
        {
            $('#' + i).fadeOut(); //hide every slot

            randomNr[i] =  Math.floor(Math.random() * 8);  //generate random number into the array
            
            setTimeout(function(){  //every 650s the spin sound plays and the slot is showing up
                if(soundOn === true)
                {
                    spinAudio.play();
                }
                $('#' + i).html("<img src='img/" + randomNr[i] + ".png' width='120vw' height='120vw' class='img'>");
                $('#' + i).slideDown();
            }, i * 650);
        }

        //Wins
        setTimeout(function () {
            if(randomNr[1] === 7 && randomNr[2] === 7 && randomNr[3] === 7) // if 7 7 7
            {
                name = "jackpot"; //name of the win + name of the image
                winAmount = 1000 * creditsSpendNumber; //the amount that the player gets
                win = true; //win is true
            }
            else if(randomNr[1] === 0 && randomNr[2] === 0 && randomNr[3] === 0) // if 0 0 0 (maybe I give free spins)
            {
                name= "triple-0"
                winAmount = 5 * creditsSpendNumber;
                win = true;
            }
            else if(randomNr[1] === randomNr[2] && randomNr[1] === randomNr[3] && randomNr[2] === randomNr[3]) //if 1 1 1 - 6 6 6 
            { 
                name="triple-number"
                winAmount = (100 * randomNr[1]) * creditsSpendNumber;
                win = true;
            }

            if(win === true) //if winning
            {
                setTimeout(function () {
                    openBox(name, winAmount); //show dialogue
                    if(soundOn === true)
                    {
                        bgAudio.pause() //pause the background music to avoid ear rape
                        jackpotAudio.play();
                        setTimeout(function () {
                            bgAudio.play() //after 5s the background music continues
                        }, 5000);
    
                    }
                }, 200);

                credits  += winAmount; //get the new win amount
            }
            
        },2200);

        setTimeout(function () {
            $("#credits").html(credits); //update the new credits value

            $("#slotContainerFooter").fadeIn();//show the spin clicker and music toggle and credit amount
            $("#btnSpin").attr("onclick", "spin()")
        }, 2400);
    }
}

//open dialogue
function openBox(text, amount)
{
    //content of the modal
    $("#outputModal").html(
                            "<div style='text-align:center;'>" +
                                "<h1> Congratulation! </h1>" +
                                "<h2>Win: " + text + " </h2>" +
                                "<img src='img/" + name + ".gif' height='350px' width='250px'>" +
                                "<h3> Credits: +" + amount + "</h3>");

    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    //open the modal
    modal.style.display = "block";


    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

//sound management
function manageSound(){

    if(soundOn === true) //if toggle is on and user clicks on the toggle
    {
        bgAudio.pause();
        soundOn = false;
    }
    else
    {
        bgAudio.play(); 
        bgAudio.loop = true;
        soundOn = true;
    }
}
