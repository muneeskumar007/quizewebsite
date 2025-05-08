let quizData = [
  {
    question:"which of the following is not a storage class specifier in C",
    options:["auto","register","static","volatile"],
    correct:"volatile"
},
{
  question:"The reason for using pointers in a C program is",
  options:["Pointers allow different functions to share and modify their local variables.","To pass large structures so that complete copy of the structure can be avoided.","Pointers enable complex ''linked'' data structures like linked lists and binary trees.","All of the above"],
  correct:"All of the above"
},
{
    question:"In C  , parameters aren always",
    options:["passed by value","passed by reference","non pointer variable are passed by reference","passed by value result"],
    correct:"passed by value"
},
{
    question:"What is the use of '#pragma once'?",
    options:["Used to avoid assertions","Used in a c file to include a header file at least once.","Used to avoid multiple declarations of same variable.","Used in a header file to avoid its inclusion more than once."],
    correct:"Used in a header file to avoid its inclusion more than once."
},
{
    question:"which file is a generated after pre processing of a C programing",
    options:[".p",".i",".o",".m"],
    correct:".p"
},
{
  question:"If only one memory location is to be reserved for a class variable, no matter how many objects are instantiated, then the variable should be declared as ",
  options:["extern","static","volatile","const"],
  correct:".p"
},
{
  question:"Which of the followings is correct for a function definition along with storage-class specifier in C language?",
  options:["int fun(register int arg)","int fun(static int arg)","int fun(extern int arg)","All of the above are correct."],
  correct:"int fun(register int arg)"
},
{
  question:"Which of the following storage classes have global visibility in C/C++ ?",
  options:["Auto","Extern","Static","Register"],
  correct:"Extern"
},
{
    question:"what does the following C statement mean    'scanf(`%4s`,str);' ",
    options:["read exactly 4 characters from console","read maximum 4 character from console","read a string str in multiples of 4","nothing"],
    correct:"read maximum 4 character from console"
},
{
    question:"in C ,it possible to inherit class properites and function from one class to another",
    options:["  True","False"],
    correct:"True"
},
{
    question:"Which keyword is used to created a class in C",
    options:["class()","none of  the above","class=myclass","class"],
    correct:"none of  the above"
}, 
{
    question:"int x,y=5,z=5 ....x=y==z;......printf('%d',x);....getchar(); (NOTE:type panna katuppa irukunu single line la type pannite atha error nu consider pannathinga)",
    options:["0","1","5","compile error"],
    correct:"1"
}, 
];

const quizContainer = document.querySelector(".quiz-container");
const question = document.querySelector(".quiz-container .question");
const options = document.querySelector(".quiz-container .options");
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn");

let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = 12;
let timerInterval;

const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

quizData = shuffleArray(quizData);

const resetLocalStorage = () => {
  for (i = 0; i < MAX_QUESTIONS; i++) {
    localStorage.removeItem(`userAnswer_${i}`);
  }
};

resetLocalStorage();

const checkAnswer = (e) => {
  let userAnswer = e.target.textContent;
  if (userAnswer === quizData[questionNumber].correct) {
    score++;
    e.target.classList.add("correct");
  } else {
    e.target.classList.add("incorrect");
  }

  localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);

  let allOptions = document.querySelectorAll(".quiz-container .option");
  allOptions.forEach((o) => {
    o.classList.add("disabled");
  });
};

const createQuestion = () => {
  clearInterval(timerInterval);

  let secondsLeft = 15;
  const timerDisplay = document.querySelector(".quiz-container .timer");
  timerDisplay.classList.remove("danger");

  timerDisplay.textContent = `Time Left: 15 seconds`;

  timerInterval = setInterval(() => {
    timerDisplay.textContent = `Time Left: ${secondsLeft
      .toString()
      .padStart(2, "0")} seconds`;
    secondsLeft--;

    if (secondsLeft < 5) {
      timerDisplay.classList.add("danger");
    }

    if (secondsLeft < 0) {
      clearInterval(timerInterval);
      displayNextQuestion();
    }
  }, 1000);

  options.innerHTML = "";
  question.innerHTML = `<span class='question-number'>${
    questionNumber + 1
  }/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`;

  const shuffledOptions = shuffleArray(quizData[questionNumber].options);

  shuffledOptions.forEach((o) => {
    const option = document.createElement("button");
    option.classList.add("option");
    option.innerHTML = o;
    option.addEventListener("click", (e) => {
      checkAnswer(e);
    });
    options.appendChild(option);
  });
};

const retakeQuiz = () => {
  questionNumber = 0;
  score = 0;
  quizData = shuffleArray(quizData);
  resetLocalStorage();

  createQuestion();
  quizResult.style.display = "none";
  quizContainer.style.display = "block";
};

const displayQuizResult = () => {
  quizResult.style.display = "flex";
  quizContainer.style.display = "none";
  quizResult.innerHTML = "";

  const resultHeading = document.createElement("h2");
  resultHeading.innerHTML = `<h1 class="score">You have scored ${score} out of ${MAX_QUESTIONS}.</h1>`;
  quizResult.appendChild(resultHeading);

  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("question-container");

    const userAnswer = localStorage.getItem(`userAnswer_${i}`);
    const correctAnswer = quizData[i].correct;

    let answeredCorrectly = userAnswer === correctAnswer;

    if (!answeredCorrectly) {
      resultItem.classList.add("incorrect");
    }

    resultItem.innerHTML = `<div class="question">Question ${i + 1}: ${
      quizData[i].question
    }</div>
    <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
    <div class="correct-answer">Correct answer: ${correctAnswer}</div>`;

    quizResult.appendChild(resultItem);
  }

  const retakeBtn = document.createElement("button");
  retakeBtn.classList.add("retake-btn");
  retakeBtn.innerHTML = "Retake Quiz";
  retakeBtn.addEventListener("click", retakeQuiz);
  quizResult.appendChild(retakeBtn);
};

const displayNextQuestion = () => {
  if (questionNumber >= MAX_QUESTIONS - 1) {
    displayQuizResult();
    return;
  }

  questionNumber++;
  createQuestion();
};

nextBtn.addEventListener("click", displayNextQuestion);

startBtn.addEventListener("click", () => {
  startBtnContainer.style.display = "none";
  quizContainer.style.display = "block";
  createQuestion();
});
