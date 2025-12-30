// script.js - logique du jeu
// Assure-toi que words.js est chargé avant ce fichier

// Configuration
const MAX_TRIES = 8;

const homeScreen = document.getElementById("home");
const gameScreen = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const guessBtn = document.getElementById("guessBtn");
const letterInput = document.getElementById("letterInput");
const wordDisplay = document.getElementById("wordDisplay");
const triesDisplay = document.getElementById("tries");
const guessedLettersEl = document.getElementById("guessedLetters");
const messageEl = document.getElementById("message");

let secretWord = "";
let revealed = [];
let triesLeft = MAX_TRIES;
let guessedLetters = new Set();
let gameOver = false;

function pickRandomWord() {
  if (!Array.isArray(WORDS) || WORDS.length === 0) {
    return "javascript";
  }
  const idx = Math.floor(Math.random() * WORDS.length);
  return WORDS[idx].toLowerCase();
}

function startGame() {
  secretWord = pickRandomWord();
  revealed = Array.from(secretWord).map(ch => (isLetter(ch) ? "_" : ch));
  triesLeft = MAX_TRIES;
  guessedLetters.clear();
  gameOver = false;
  updateUI();
  showScreen("game");
  message("Bonne chance ! Proposez une lettre.", "info");
  letterInput.focus();
}

function restartGame() {
  startGame();
}

function giveUp() {
  gameOver = true;
  revealed = Array.from(secretWord);
  updateUI();
  message(`Vous avez abandonné. Le mot était : ${secretWord}`, "lose");
}

function isLetter(ch) {
  return /^[a-zàâäéèêëîïôöùûüç-]$/i.test(ch);
}

function updateUI() {
  wordDisplay.textContent = revealed.join(" ");
  triesDisplay.textContent = triesLeft;
  guessedLettersEl.textContent = guessedLetters.size ? Array.from(guessedLetters).join(", ") : "-";
  if (gameOver) {
    letterInput.disabled = true;
    guessBtn.disabled = true;
  } else {
    letterInput.disabled = false;
    guessBtn.disabled = false;
  }
}

function message(text, type = "info") {
  messageEl.className = "message " + (type || "");
  messageEl.textContent = text;
}

function handleGuess() {
  if (gameOver) return;
  const raw = letterInput.value.trim().toLowerCase();
  letterInput.value = "";
  if (!raw) return;
  const letter = raw[0];
  if (!isLetter(letter)) {
    message("Veuillez entrer une lettre valide.", "info");
    return;
  }
  if (guessedLetters.has(letter)) {
    message(`Vous avez déjà proposé la lettre "${letter}".`, "info");
    return;
  }
  guessedLetters.add(letter);

  if (secretWord.includes(letter)) {
    // révéler toutes les occurrences
    for (let i = 0; i < secretWord.length; i++) {
      if (secretWord[i] === letter) revealed[i] = letter;
    }
    message(`Bien joué ! La lettre "${letter}" est dans le mot.`, "info");
  } else {
    triesLeft--;
    message(`Dommage, la lettre "${letter}" n'est pas dans le mot.`, "info");
  }

  // vérifier victoire
  if (!revealed.includes("_")) {
    gameOver = true;
    message(`Félicitations ! Vous avez deviné le mot : ${secretWord}`, "win");
  } else if (triesLeft <= 0) {
    gameOver = true;
    revealed = Array.from(secretWord);
    message(`Partie terminée. Le mot était : ${secretWord}`, "lose");
  }

  updateUI();
}

function showScreen(name) {
  if (name === "home") {
    homeScreen.classList.add("active");
    gameScreen.classList.remove("active");
  } else {
    homeScreen.classList.remove("active");
    gameScreen.classList.add("active");
  }
}

// événements
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
giveUpBtn.addEventListener("click", giveUp);
guessBtn.addEventListener("click", handleGuess);

letterInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleGuess();
  }
});

// initialisation
showScreen("home");
