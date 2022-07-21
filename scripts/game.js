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
    let response = await fetch("http://localhost:3000/questions.json");
    let data = await response.json()
    let firstQuestion = data[0]
    document.getElementById("card_image").src = `../imgs/${firstQuestion.img}`
    document.getElementById("question_number").innerText = `1 out of ${data.length}`
}