let difficulty = "easy"; // Default difficulty level
let minLength = 50; // Default minimum length
let maxLength = 100; // Default maximum length

let quoteApiUrl=`https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`;

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let maxtime = 60;
let timer = "";
let mistakes = 0;
let count = 0;

//navigate to previous page in browser history
let btnback=document.querySelector('button');
  btnback.addEventListener('click',() => {
    window.history.back();
})

function setTime(){
    let totTime=parseInt(document.getElementById("totTime").value);
    time=totTime;
    maxtime=time;
}

function setDifficulty() {
  const selectElement = document.getElementById("difficulty");
  difficulty = selectElement.value;

  // Set minLength and maxLength based on the difficulty level chosen
  switch (difficulty) {
    case "Easy":
      minLength = 30;
      maxLength = 100;
      break;
    case "Medium":
      minLength = 200;
      maxLength = 300;
      break;
    case "Hard":
      minLength = 400;
      maxLength = 450;
      break;
    default:
      minLength = 50;
      maxLength = 100;
      break;
  }

  // Fetch a new quote with the updated length
  quoteSection.innerHTML="";
  //console.log(minLength);
  //console.log(maxLength);
  quoteApiUrl=`https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`;
  renderNewQuote();
}

//Display random quotes
const renderNewQuote = async () => {
  //Fetch contents from url
  const response = await fetch(quoteApiUrl);
  //Store response
  let data = await response.json(); /*'await' keyword in conjunction with the 'json()' method to handle a
                                  Promise returned by the json() method.This code is typically used in an asynchronous function.*/
  //Access quote
  quote = data.content;
  //Array of characters in the quote
  let arr = quote.split("").map((value) => {
    //wrap the characters in a span tag
    return "<span class='quote-chars'>" + value + "</span>";
  });
  //join array for displaying
  quoteSection.innerHTML += arr.join("");
};

//Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  count++;
  
  let quoteChars = document.querySelectorAll(".quote-chars");
  //Create an array from received span tags
  quoteChars = Array.from(quoteChars);
  //if user has finished entering the quote. regenerate new quote
  if (quoteChars.length == userInput.value.length) {
    quoteSection.innerHTML = "";
    userInput.value = "";
    renderNewQuote();
  }
  
  //array of user input characters
  let userInputChars = userInput.value.split("");

  //loop through each character in quote
  quoteChars.forEach((char, index) => {
    //Check if char(quote character) = userInputChars[index](input character)
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    //If user hasn't entered anything or backspaced
    else if (userInputChars[index] == null) {
      //Remove class if any
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }
    //If user enter wrong character
    else {
      //Checks if we alreasy have added fail class
      if (!char.classList.contains("fail")) {
        //increment and display mistakes
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }
    
  });
});

//Update Timer on screen
function updateTimer() {
  if (time == 0) {
    //End test if timer reaches 0
    displayResult();
  } 
  else {
    if(time!=maxtime){
        let currtime = (maxtime - time) / 60; // Calculate time taken as a fraction of a minute

        // Calculate accuracy and display it on the screen
        document.getElementById("accuracy1").innerText =
        Math.round(((count - mistakes) / count) * 100) + " %";
    }
    document.getElementById("timer").innerText = --time + "s";
  }
}

//Sets timer
const timeReduce = () => {
  time = maxtime;
  timer = setInterval(updateTimer, 1000);
};

//End Test
const displayResult = () => {
  //display result div
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (maxtime - time) / 60;
  }
  document.getElementById("cpm").innerText =
    (count /  timeTaken).toFixed(2) + " cpm"; //count is characters entered(correct+uncorrect)
  
  document.getElementById("accuracy").innerText =
    Math.round(((count - mistakes) / count) * 100) + " %";
};

//Start Test
const resetValues = () => {
  quoteSection.innerHTML = ""; 
  mistakes = 0;
  timer = "";
  time = 0;
  userInput.value = "";
  userInput.disabled = true;
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  document.querySelector(".result").style.display = "none";
  document.getElementById("mistakes").innerText = 0;
  document.getElementById("typing-speed").innerText = 0;
  document.getElementById("timer").innerText = "0s";
  document.getElementById("difficulty").value = "Easy";
  document.getElementById("totTime").value = "60";
  setTime();
  setDifficulty();
};

const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
    
    
    