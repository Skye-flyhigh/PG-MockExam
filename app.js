const examContent = [{
id: "P1",
level: "P", 
category: "POF",
question: "If your paraglider suffers from a large asymmetric collapse at low level (300ft) and immediately starts to dive and rotate, the optimum pilot action is to:",
a1: "Apply opposite weight shift and strong opposite brake to try and stop the turn.",
a2: "Deploy your emergency parachute.",
a3: "Apply a small amount of opposite brake, and weight shift to try and slow or stop the turn, use deep pumps on the collapsed side to help the glider re-inflate.",
a4: "Treat as a symmetrical collapse and pump both brakes deeply to counter the dive. Then steer out of the turn.",
solution: "a3"
}, {
    id: "P2",
    level: "P",
    category: "POF",
    question: "If a glider is flown at the top of its weight range its performance may be different to when it is flown at the bottom of its weight range. Some of the differences in performance caused by increasing the wing loading (but remaining within the recommended ranger) are likely to be:",
    a1: "A reduction in sink rate, improvement in glide angle, an increased best glide airspeed.",
    a2: "A slight increase in sink rate, no change to the glide angle, an increased best glide airspeed.",
    a3: "No change to the sink rate, reduction in the glide angle, increased top speed.",
    a4: "A reduction in sink rate, better glide angle, no change in top speed.",
    solution: "a2"
}, {
    id: "CP1",
    level: "CP",
    category: "Airlaw",
    question: "You are ridge soaring and have the ridge on your left. You are approaching a hang glider head on. What should you do?",
    a1: "Turn right",
    a2: "Turn left",
    a3: "Do nothing",
    solution: "a1"
}, {
    id: "CP2",
    level: "CP",
    category: "Airlaw",
    question: "You are on a converging course with another paraglider on your right hand side. You should:",
    a1: "Move out of their way",
    a2: "Hold your course",
    a3: "Use big ears",
    a3: "Stall the glider",
    solution: "a1"
} , {
    id: "CP3",
    level: "CP",
    category: "Airlaw",
    question: "You are coming in to land in a designated landing. It is a very busy with pilots above and below you. Which statement is correct?",
    a1: "The higher pilot has right of way",
    a2: "The lowest pilot on their final glide into land has right of way",
    a3: "The fastest pilot has right of way",
    a4: "The slowest pilot has right of way",
    a5: "The best pilot has right of way",
    solution: "a2"
} , {
    id: "CP4",
    level: "CP",
    category: "Airlaw",
    question: "You are ridge soaring and wish to overtake another pilot ahead of you. Should you...",
a1: "Overtake in between the ridge and the other glider",
a2: "Overtake between the valley and the other glider",
a3: "Overtake either side, being cautious of oncoming traffic",
solution: "a3"
}];

const questionContainer = document.getElementById("question-container");
const submitBtn = document.querySelector(".submit-btn");
const navbar = document.getElementById("nav");
const levelSelector = document.getElementById("level-selector");
const questionSelector = document.getElementById("question-selector");
const score = document.getElementById("score");

let numOfQuestions = Number(questionSelector.value);
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
    if(scrollHeight > navHeight) {
        navbar.classList.add("fixed");
    } else {
navbar.classList.remove("fixed");
    }
})

// select the level of the mock exam
levelSelector.addEventListener("change", (e) => {
    let newLevel = e.currentTarget.value;
    reset();
    displayQuestion(numOfQuestions, newLevel);
})

// select the number of questions
questionSelector.addEventListener("change", (e) => {
    let newNum = Number(e.currentTarget.value); //e.currentTarget returns a string
    reset();
    displayQuestion(newNum, level);
})

// select the category of the questions

// ***************** main function of this page! ********************
function displayQuestion(num, level) {
    //Have some randomness goodness in the questions, but all the questions needs to be individual! Get a function that randomise single numbers at one event (a click or window reload)
    function getRanArr(lngth) {
        let arr = [];
        do {
            let ran = Math.floor(Math.random() * lngth); 
            arr = arr.indexOf(ran) > -1 ? arr : arr.concat(ran);
         } while (arr.length < lngth)
         return arr;
      }

    const arr = getRanArr(4); // this number will depend on the number of questions in a given level

    //Filter the questions to get the targeted level
const filteredQuestion = examContent.filter((question) => {return question.level === level})

// Create a question container for each of the selected question in a random order
    for (let i = 0; i < numOfQuestions; i++) {
        let item = filteredQuestion[arr[i]];
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id");
        attr.value = item.id;
        element.setAttributeNode(attr);
        element.classList.add("bg-slate-300", "rounded-md", "border", "px-5", "py-5", "flex", "flex-col", "gap-4", "justify-center", "max-w-2xl", "m-2", "dark:bg-slate-800", "dark:text-white", "dark:border-gray-600");
        
        element.innerHTML = `<!-- question start -->
        <h3 id="question" class="font-semibold sm:text-lg text-base">${i + 1}. ${item.question}</h3>
        <div id="answer-container" class="bg-white rounded-md p-4 gap-3 flex flex-col sm:text-base text-sm dark:bg-slate-900 dark:text-white">
            <div id="answer"><input type="radio" id="a1-${i + 1}" name="${item.id}" value="a1" class="radio-answer mr-1"><label for="a1-${i + 1}" class="a1">${item.a1}</label></div>
            <div id="answer"><input type="radio" id="a2-${i + 1}" name="${item.id}" value="a2" class="radio-answer mr-1"><label for="a2-${i + 1}" class="a2">${item.a2}</label></div>
            <div id="answer"><input type="radio" id="a3-${i + 1}" name="${item.id}" value="a3" class="radio-answer mr-1"><label for="a3-${i + 1}" class="a3">${item.a3}</label></div>
            <div id="answer"><input type="radio" id="a4-${i + 1}" name="${item.id}" value="a4" class="radio-answer mr-1"><label for="a4-${i + 1}" class="a4">${item.a4}</label></div>
        </div>
        <!-- question end -->
        `;

        questionContainer.appendChild(element);
    }
};

// ******************** Submit *****************************
//Submit to validate the answer and check the write from wrong
submitBtn.addEventListener("click", () => {
    let amountCorrect = 0;

    //find the id of all displayed questions in the DOM
    const selectedQuestions = []

    let nodeList = document.querySelectorAll("article");
    nodeList.forEach((article) => {
        selectedQuestions.push(article.dataset.id);
    })

    // loop through all the question and select the radios
    for (let i = 0; i < selectedQuestions.length; i++) {
        let myRadios = document.getElementsByName(selectedQuestions[i]);

        // find the right answer
        let solutionValue = examContent.find(x => x.id === selectedQuestions[i]).solution;

        //loop to check & mark answers for selected radios
        for (let j = 0; j < myRadios.length; j++) {
            let radioValue = myRadios[j];
            radioValue.parentNode.classList.remove("bg-green-200", "bg-red-200", "dark:bg-green-600", "dark:bg-red-600")

            if(radioValue.value == solutionValue && radioValue.checked) {
                amountCorrect++;
                radioValue.parentNode.classList.add("bg-green-200", "dark:bg-green-600", "rounded-lg");
            } else if(radioValue !== solutionValue && radioValue.checked) {
                radioValue.parentNode.classList.add("bg-red-200", "dark:bg-red-600", "rounded-lg");
            }
        }
    }

    // ******************* Scoring **************************
    score.classList.remove("hidden", "bg-green-200", "dark:bg-green-600", "bg-red-200", "dark:bg-red-600");
    score.innerText = amountCorrect+"/"+numOfQuestions+" ("+ amountCorrect/numOfQuestions*100 + "%"+ ")";

    (amountCorrect/numOfQuestions*100) > "69"? 
    score.classList.add("bg-green-200", "dark:bg-green-600") : 
    score.classList.add("bg-red-200", "dark:bg-red-600");
})

//Function to clear the previous questions and score
function reset() {
    questionContainer.innerHTML = "";
    score.classList.add("hidden");
}
