import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";



import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateInput = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosen = selectedDates[0];
    if (!chosen) return;
    if (chosen <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({ title: "Error", message: "Please choose a date in the future", position: "topRight" });
      return;
    }
    userSelectedDate = chosen;
    startBtn.disabled = false;
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;
  startBtn.disabled = true;
  dateInput.disabled = true;


  updateTimerDisplay(convertMs(userSelectedDate - new Date()));

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(convertMs(0));
      dateInput.disabled = false;

      return;
    }

    updateTimerDisplay(convertMs(diff));
  }, 1000);
});

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = days;
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
