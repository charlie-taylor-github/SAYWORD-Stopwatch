const fps = 100;
const interval = 1000 / fps;

const timerElement = document.querySelector('circle#progress');
const timeText = document.querySelector('#time');

const finishedContainer = document.querySelector('#finished-container');

const pages = [
  {
    name: 'timer',
    page: document.querySelector('#timer-page')
  },
  {
    name: 'standard',
    page: document.querySelector('#standard-page')
  },
  {
    name: 'hotpotato',
    page: document.querySelector('#hotpotato-page')
  }
];

let currentPage = 'standard';
let currentMode = 'standard';
let timer = null;

function update() {
  updatePageVisibility();

  for (const mode of ['standard', 'pressure', 'hotpotato']) {
    if (mode === currentMode) {
      document.querySelector(`#${mode}-button`).style.color = '#FE8F1A';
    } else {
      document.querySelector(`#${mode}-button`).style.color = 'black';
    }
  }

  if (timer) {
    timer.update(interval);

    if (timer.active) {
      document.querySelector('#play-button').innerText = 'Pause';
      updateTimerText(timer.totalTime - timer.time);
    } else {
      document.querySelector('#play-button').innerText = 'Play';
      if (timer.innerText != `time's up`) updateTimerText(timer.totalTime - timer.time);
    }
  }
}

function init() {
  const standardPageButtons = document.querySelectorAll('#standard-page-menu > h3');
  for (const btn of standardPageButtons) {
    btn.addEventListener('click', e => {
      const text = e.target.innerText;
      const totalTime = Number(text[0] + text[1]);
      setStandardPage(totalTime);
    });
  }

  const hotpotatoPageButtons = document.querySelectorAll('#hotpotato-page-menu > h3');
  for (const btn of hotpotatoPageButtons) {
    btn.addEventListener('click', e => {
      const text = e.target.innerText;
      const totalTime = Number(text[0]) * 60;
      setHotpotatoPage(totalTime);
    });
  }

  const menuButtons = document.querySelectorAll('#menu > h3');
  for (const btn of menuButtons) {
    btn.addEventListener('click', e => {
      if (e.target.id === 'standard-button') {
        currentPage = 'standard';
        currentMode = 'standard';
      }
      if (e.target.id === 'pressure-button') {
        setPressurePage();
      }
      if (e.target.id === 'hotpotato-button') {
        currentPage = 'hotpotato';
        currentMode = 'hotpotato';
      }
    });

    const timerHitbox = document.querySelector('#timer');
    timerHitbox.addEventListener('click', e => {
      e.stopImmediatePropagation()
      if (currentMode === 'standard' && timer.active) {
        timer.reset();
        timer.start();
      }
      if (currentMode === 'pressure' && timer.active) {
        timer.setTime(timer.totalTime - 1000);
        timer.reset();
        timer.start();
      }

      if (!timer.active) {
        timer.start();
      }
    });
  }

  const playbackButtons = document.querySelectorAll('#options > h3');
  for (const btn of playbackButtons) {
    btn.addEventListener('click', e => {
      if (e.target.id === 'play-button') {
        if (timer.active) timer.stop();
        else timer.start();
      }
      if (e.target.id === 'reset-button') {
        if (currentMode === 'pressure') {
          setPressurePage();
        } else {
          timer.reset();
        }
      }
    });
  }

  setInterval(update, interval);
}


// RANDOM FUNCTIONS
function setStandardPage(totalTime) {
  currentPage = 'timer';
  currentMode = 'standard';
  timer = new Timer(timerElement, onStop);
  timer.setTime(totalTime * 1000);
  timer.reset();
}

function setPressurePage() {
  currentPage = 'timer';
  currentMode = 'pressure';
  timer = new Timer(timerElement, onStop);
  timer.setTime(30 * 1000);
  timer.reset();
}

function setHotpotatoPage(totalTime) {
  currentPage = 'timer';
  currentMode = 'hotpotato';
  timer = new Timer(timerElement, onStop);
  timer.setTime(totalTime * 1000);
  timer.reset();
}

function onStop() {
  timeText.innerText = `time's up`;
  const audio = new Audio('./assets/time_up.mp3');
  audio.play();
  if (currentMode === 'pressure') {
    timer.setTime(30 * 1000);
  }
}

function updateTimerText(ms) {
  let secs = Math.floor(ms / 1000);
  let mins = Math.floor(secs / 60);
  ms = Math.floor(ms % 1000 / 10);
  secs = secs % 60;
  function pad(num) {
    return num.toString().padStart(2, '0');
  }
  timeText.innerText = `${pad(mins)}:${pad(secs)}:${pad(ms)}`;
}

function updatePageVisibility() {
  for (const page of pages) {
    if (page.name === currentPage) {
      page.page.style.display = 'block';
    } else {
      page.page.style.display = 'none';
    }
  }

  if (currentPage === 'timer') {
    document.querySelector('#options-container').style.display = 'block';
  } else {
    document.querySelector('#options-container').style.display = 'none';
  }
}

init();
