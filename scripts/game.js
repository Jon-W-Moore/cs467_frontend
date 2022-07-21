window.addEventListener("load", function () {
    const timer = document.getElementById("timer");
    let time = -1, intervalId;
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

async function getData(intervalId) {
    let url = "http://127.0.0.1:5000/"
    let response = await fetch(`${url}/test1`);
    let data = await response.json()

    console.log(data)

    document.body.dataset.current_question = 0

    let answers = data.answers
    let questions = data.questions

    let current_question = document.body.dataset.current_question
    setNextQuestion(current_question, questions, url)

    // load questions from server
    let questionContainer = document.getElementById("question_container")
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

function checkAnswer(e, questions, url, intervalId) {
    let id = e.target.id.split("-")[1]
    if (id === document.getElementById("card_image").dataset.answer_id ) {
        document.getElementById(`answer-${id}`).style.backgroundColor = 'green'
        setTimeout(() => { document.getElementById(`answer-${id}`).style.backgroundColor = 'white'; }, 500);
        
        // increase the score by ten points 
        document.getElementById("score").innerHTML = parseInt(document.getElementById("score").innerHTML)+10
    } else {
        document.getElementById(`answer-${id}`).style.backgroundColor = 'red'
        setTimeout(() => { document.getElementById(`answer-${id}`).style.backgroundColor = 'white'; }, 500);
    }

    document.body.dataset.current_question ++
    let currentQuestion = document.body.dataset.current_question

    if (questions.length === parseInt(currentQuestion)) {
        document.body.dataset.timer = clearInterval(intervalId);
    }
    setNextQuestion(currentQuestion, questions, url)
}

function setNextQuestion(currentQuestion, questions, url) {
    let question = questions[currentQuestion]
    document.getElementById("card_image").src = `${url}/${question.image}`
    document.getElementById("card_image").dataset.image_id = ('image_id', question.id)
    document.getElementById("card_image").dataset.answer_id = ('image_id', question.answer_id)
    document.getElementById("question_number").innerText = `${parseInt(currentQuestion) + 1} out of ${questions.length}`
}