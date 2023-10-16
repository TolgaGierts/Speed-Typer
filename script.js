const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endGameEl = document.getElementById("end-game-container");
const settingBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
let randomWord;
let score = 0;
let time = 10;
let difficulty;

//Focus on start
text.focus();

const timeInterval = setInterval(updateTime, 1000);

//Event Listeners
difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
  score = 0;
  showRandomWord(difficulty);
  time = 10;
  updateScore();
  updateTime();
});

text.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  if (insertedText === randomWord) {
    showRandomWord(difficulty);
    e.target.value = "";
    updateScore();
    time += 5;
    updateTime();
  }
});

// Functions

//  random word API
async function getWords() {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/all`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Show random word in h1
async function showRandomWord(difficulty = "Easy") {
  const words = await getWords();
  let wordsArr = [];
  if (difficulty === "Easy") {
    wordsArr = words.filter((word) => word.length <= 5);
  } else if (difficulty === "Medium") {
    wordsArr = words.filter((word) => word.length >= 5 && word.length < 10);
  } else {
    wordsArr = words.filter((word) => word.length >= 10);
  }
  let randIndex = Math.floor(Math.random() * wordsArr.length);
  randomWord = wordsArr[randIndex];
  word.innerText = randomWord;
}

function updateScore() {
  score++;
  scoreEl.innerText = score;
}

function updateTime() {
  time--;
  timeEl.innerText = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);
    // end game
    gameOver();
  }
}

//game over show end screen
function gameOver() {
  endGameEl.innerHTML = `<h1>Time ran out</h1>
    <p>Your Final Score : ${score}</p>
    <button onclick="location.reload()">Play again</button>`;
  endGameEl.style.display = "flex";
}

showRandomWord();
