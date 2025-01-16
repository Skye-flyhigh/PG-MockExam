const questionContainer = document.getElementById("question-container");
const submitBtn = document.querySelector(".submit-btn");
const navbar = document.getElementById("nav");
const selectorMenu = document.getElementById("selectors");
const levelSelector = document.getElementById("level-selector");
const questionSelector = document.getElementById("question-selector");
const score = document.getElementById("score");
const burgerToggle = document.getElementById("burger-toggle");

let numOfQuestions = questionSelector.value;
let level = levelSelector.value;

//Loading event
window.addEventListener("DOMContentLoaded", () => {
  reset();
  displayQuestion(numOfQuestions, level);
});

// **************** navbar options ***********************
// fixed navbar
window.addEventListener("scroll", () => {
  const scrollHeight = window.scrollY;
  const navHeight = navbar.getBoundingClientRect().height;
  if (scrollHeight > navHeight) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
});

// select the level of the mock exam
levelSelector.addEventListener("change", (e) => {
  let newLevel = e.currentTarget.value;
  reset();
  displayQuestion(numOfQuestions, newLevel);
  level = newLevel;
});

// select the number of questions
questionSelector.addEventListener("change", (e) => {
  let newNum = Number(e.currentTarget.value); //e.currentTarget returns a string
  reset();
  displayQuestion(newNum, level);
  numOfQuestions = newNum;
});
// select the category of the questions

// Toggle for the selectors on small screens
burgerToggle.addEventListener("click", () => {
  if (burgerToggle.ariaExpanded === "false") {
    selectorMenu.classList.remove("collapse");
    burgerToggle.setAttribute(
      "aria-expanded",
      `${(burgerToggle.getAttribute("aria-expanded") !== "true").toString()}`
    );
  } else {
    selectorMenu.classList.add("collapse");
    burgerToggle.setAttribute(
      "aria-expanded",
      `${(burgerToggle.getAttribute("aria-expanded") === "false").toString()}`
    );
  }
});

// ***************** main function of this page! ********************
function displayQuestion(num, level) {
  //Have some randomness goodness in the questions, but all the questions needs to be individual! Get a function that randomise single numbers at one event (a click or window reload)
  function getRanArr(lgth) {
    let arr = [];
    do {
      let ran = Math.floor(Math.random() * lgth);
      arr = arr.indexOf(ran) > -1 ? arr : arr.concat(ran);
    } while (arr.length < lgth);
    return arr;
  }
  //fetch the content from external JSON file
  fetch("content.json")
    .then((response) => response.json())
    .then((data) => {
      //Filter the questions to get the targeted level
      const filteredQuestions = data.filter((question) => {
        if (level === "Surprise") {
          return question
        } else {
          return question.level === level;
        }
      });
      
      const arr = getRanArr(filteredQuestions.length); // this number will depend on the number of questions in a given level
      
      // Create a question container for each of the selected question in a random order
      for (let i = 0; i < num; i++) {
        let item = filteredQuestions[arr[i]];        
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = item.id;
        element.setAttributeNode(attr);
        element.classList.add(
          "bg-slate-300",
          "rounded-md",
          "border",
          "px-5",
          "py-5",
          "flex",
          "flex-col",
          "gap-4",
          "justify-center",
          "m-2",
          "dark:bg-slate-800",
          "dark:text-white",
          "dark:border-gray-600",
          "w-11/12",
          "max-w-2xl"
        );

        let category = item.category;
        switch (category) {
          case 'POF':
            category = "Principle of Flight";
            break;
          case "Met": 
            category = "Meteorology";
            break;
          case "Airlaw":
            category = "Rules of the air and Air law";
            break;
          case "Airmanship":
            category = "Airmanship";
            break;
          default:
            category = "";
        }
        let level = item.level;
        switch (level) {
          case 'EP':
            level = "Elementary Pilot";
            break;
          case "CP": 
            level = "Club Pilot";
            break;
          case "P":
            level = "Pilot";
            break;
          case "AP":
            level = "Advanced Pilot";
            break;
          default:
            level = "";
        }
        
        element.innerHTML = `<!-- question start -->
            <h3 id="question-${i + 1}" class="font-semibold sm:text-lg text-base">${i + 1}. ${item.question}</h3>
            <div id="answer-container-${i + 1}" class="bg-white rounded-md p-4 gap-3 flex flex-col sm:text-base text-sm dark:bg-slate-900 dark:text-white">
            </div>
            <div class="flex"><p class="text-xs">Category: ${category}, ${level}</p></div>
            <!-- question end -->
            `;
        questionContainer.appendChild(element);
        // <i class="fa fa-question-circle-o" id="report-question"></i>

        // display pictures in the questions in the question container
        let questionTitle = document.getElementById(`question-${i + 1}`);

        if (Object.hasOwn(item, "img")) {
          const img = document.createElement("img");
          img.src = item.img;
          img.alt = item.id;
          img.style.width = "500px";
          img.style.height = "auto";
          img.classList.add("rounded-md", "self-center");

          element.insertBefore(img, questionTitle);
        }
        // display as many answers as there are in the database, assuming the database has always the same structure with the answers at the end.
        let answersIndex = Object.keys(item).indexOf("a1");
        let answersKeys = Object.keys(item).slice(answersIndex);
        let answers = Object.values(item).slice(answersIndex);
        let answerRandomArr = getRanArr(answersKeys.length);
        // console.log(answersKeys, answers, answerRandomArr); //randomise those answers

        let answerContainer = document.getElementById(
          `answer-container-${i + 1}`
        );
        
        answersKeys.forEach((answerKey) => {
          const answer = document.createElement("div");
          const index = answersKeys.indexOf(answerKey);
          answer.setAttribute("id", answerKey);
          answer.innerHTML = `
                <input type="radio" id="${answerKey}-${i + 1}" name="${item.id}" value="${answerKey}" class="radio-answer mr-1">
                <label for="${answerKey}-${i + 1}" class="${answerKey}">${answers[index]}</label>
                `;
          answerContainer.appendChild(answer);
        });
      }
      // ******************** Submit *****************************
      //Submit to validate the answer and check the write from wrong
      submitBtn.addEventListener("click", () => {
        let amountCorrect = 0;
        console.log("click");
        
        //find the id of all displayed questions in the DOM
        const selectedQuestions = [];
        
        
        let nodeList = document.querySelectorAll("article");
        nodeList.forEach((article) => {
          selectedQuestions.push(article.dataset.id);
        });

        // loop through all the question and select the radios
        for (let i = 0; i < selectedQuestions.length; i++) {
          let myRadios = document.getElementsByName(selectedQuestions[i]);

          // find the right answer
          let solutionValue = data.find(
            (x) => x.id === selectedQuestions[i]
          ).solution;

          //loop to check & mark answers for selected radios
          for (let j = 0; j < myRadios.length; j++) {
            let radioValue = myRadios[j];
            radioValue.parentNode.classList.remove(
              "bg-green-200",
              "bg-red-200",
              "dark:bg-green-600",
              "dark:bg-red-600"
            );

            if (radioValue.value == solutionValue && radioValue.checked) {
              amountCorrect++;
              radioValue.parentNode.classList.add(
                "bg-green-200",
                "dark:bg-green-600",
                "rounded-lg"
              );
            } else if (radioValue !== solutionValue && radioValue.checked) {
              radioValue.parentNode.classList.add(
                "bg-red-200",
                "dark:bg-red-600",
                "rounded-lg"
              );
            }
          }
        }

        // ******************* Scoring **************************
        score.classList.remove(
          "hidden",
          "bg-green-200",
          "dark:bg-green-600",
          "bg-red-200",
          "dark:bg-red-600"
        );
        score.innerText = Math.floor((amountCorrect / selectedQuestions.length) * 100) + "%";
        (amountCorrect / selectedQuestions.length) * 100 > "69"
          ? score.classList.add("bg-green-200", "dark:bg-green-600")
          : score.classList.add("bg-red-200", "dark:bg-red-600");
      });
    });
}

//Function to clear the previous questions and score
function reset() {
  questionContainer.innerHTML = "";
  score.classList.add("hidden");
}
