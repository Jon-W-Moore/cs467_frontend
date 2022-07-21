window.addEventListener("load", function () {
    const timer = document.getElementById("timer");
    let time = -1, intervalId;
    function incrementTime() {
        time++;
        timer.textContent = ("" + Math.trunc(time / 60)).slice(-2) + ":" + ("0" + (time % 60)).slice(-2);
    }
    incrementTime();
    intervalId = setInterval(incrementTime, 1000);

    document.getElementById('pause').addEventListener('click', () => {
        clearInterval(intervalId);
    });
});

