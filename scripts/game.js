window.addEventListener("load", function () {
    const timer = document.getElementById("timer");
    let time = -1, intervalId;
    function incrementTime() {
        time++;
        timer.textContent = ("" + Math.trunc(time / 60)).slice(-2) + ":" + ("0" + (time % 60)).slice(-2);
    }
    incrementTime();
    intervalId = setInterval(incrementTime, 1000);

    getData()
});

async function getData() {
    let url = "http://127.0.0.1:5000/"
    let response = await fetch(`${url}/test1`);
    let data = await response.json()
    let answers = data.answers
    let questions = data.questions

    let firstQuestion = questions[0]
    document.getElementById("card_image").src = `${url}/${firstQuestion.image}`
    document.getElementById("question_number").innerText = `1 out of ${questions.length}`
}