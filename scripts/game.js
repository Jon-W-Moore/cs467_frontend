// Add event listener to start timer as soon as the page loads
window.addEventListener("load", function() {
    const timer = document.getElementById("timer");
    let time = -1,
        intervalId;

    function incrementTime() {
        time++;
        let current_time = ("" + Math.trunc(time / 60)).slice(-2) + ":" + ("0" + (time % 60)).slice(-2)
        timer.textContent = current_time
        document.body.dataset.timer = current_time
    }
    incrementTime();
    intervalId = setInterval(incrementTime, 1000);

    getData(intervalId)
});

// Function to fetch data from API
async function getData(intervalId) {
    let url = "http://127.0.0.1:5000"
    let response = await fetch(`${url}/allquiz`);

    let data = await response.json()

    document.body.dataset.current_question = 0

    let answers = data.answers
    let questions = data.questions

    let current_question = document.body.dataset.current_question
    setNextQuestion(current_question, questions, url)

    document.getElementById("pass").onclick = function() {
            let nextQuestion = parseInt(document.body.dataset.current_question) + 1
            document.body.dataset.current_question = nextQuestion
            setNextQuestion(nextQuestion, questions, url)
        }
        // load questions from server
    const questionContainer = document.getElementById("question_container")
    for (let i = 0; i < answers.length; i++) {
        let newEl = document.createElement("input")
        newEl.type = "button"
        newEl.className = "question_button"
        newEl.onclick = function(event) {
            checkAnswer(event, questions, url, intervalId)
        }
        newEl.value = answers[i]
        newEl.id = `answer-${i + 1}`
        questionContainer.appendChild(newEl)
    }
}

// Function to send data to API
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// Function to check if answer is correct
function checkAnswer(e, questions, url, intervalId) {
    let answer_id = e.target.id.split("-")[1]
    let question_id = document.getElementById("card_image").dataset.image_id
    let currentScore = parseInt(document.getElementById("score").innerHTML)

    postData(`${url}/answer`, { question_id: question_id, answer_id_by_user: answer_id, current_score: currentScore })
        .then((response) => {
            if (response.success) {
                document.getElementById(`answer-${answer_id}`).style.backgroundColor = 'green'
                setTimeout(() => { document.getElementById(`answer-${answer_id}`).style.backgroundColor = 'white'; }, 500);

                document.getElementById("score").innerHTML = response.score

            } else {
                document.getElementById(`answer-${answer_id}`).style.backgroundColor = 'red'
                setTimeout(() => { document.getElementById(`answer-${answer_id}`).style.backgroundColor = 'white'; }, 500);
            }
        });

    document.body.dataset.current_question++
        let currentQuestion = document.body.dataset.current_question

    // if final question, stop timer
    if (questions.length === parseInt(currentQuestion)) {
        document.body.dataset.timer = clearInterval(intervalId);
        // open end modal
        document.getElementById("endModal").style.display = "block";
        document.getElementById("endText").innerHTML = `
            <h1>You finished in ${document.getElementById("timer").innerHTML} with a score of ${document.getElementById("score").innerHTML}</h1>
            <br/>
            <a href="./dashboard.html">
                <input type="button" value="Return home">
            </a>
            <input type="button" onClick="window.location.reload();" value="Try again!">
        `
    }
    setNextQuestion(currentQuestion, questions, url)
}

// Function to set next question
function setNextQuestion(currentQuestion, questions, url) {
    let question = questions[currentQuestion]
    document.getElementById("card_image").src = `${url}/${question.image}`
    document.getElementById("card_image").dataset.image_id = ('image_id', question.id)
    document.getElementById("card_image").dataset.answer_id = ('image_id', question.answer_id)
    document.getElementById("question_number").innerText = `${parseInt(currentQuestion) + 1} out of ${questions.length}`
    document.getElementById("hintText").innerText = question.hint.length === 0 ? "No extra info available. Give it your best guess!" : question.hint
}

// Handle opening and closing hint modal
const hintModal = document.getElementById("hintModal");

document.getElementById("hint").onclick = function() {
    hintModal.style.display = "block";
}

document.getElementById("closeHint").onclick = function() {
    hintModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == hintModal) {
        hintModal.style.display = "none";
    }
}