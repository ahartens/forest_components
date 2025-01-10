let audioContext;
let intervalId;
let isPlaying = false;

const puslingDiv = 'single_song_view'

function playClick() {
  const osc = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, audioContext.currentTime); // Frequency of the beep sound
  envelope.gain.setValueAtTime(1, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // 100ms duration

  osc.connect(envelope);
  envelope.connect(audioContext.destination);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.1);
}

export function startMetronome(bpm) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const interval = (60 / bpm) * 1000; // Interval in milliseconds
  const bodyContainer = document.getElementById(puslingDiv);

  // bodyContainer.style.animationDuration = `${animationDuration}s`;

  let previous = 0;
  const colors = {0:'#fff',1:'#ddd'}

  intervalId = setInterval(() => {
    playClick();
    console.log("CLICKED metrom")
    // // const event = new CustomEvent('beat');
    // document.dispatchEvent(event);
    bodyContainer.style.backgroundColor = colors[previous%2]
    previous += 1;

  }, interval);
}

export function stopMetronome() {
  clearInterval(intervalId);
}

export function setupMetronome() {
  const bpmInput = document.getElementById('bpmInput');
  const bodyContainer = document.getElementById(puslingDiv);

  function toggleMetronome() {
    const bpm = Math.max(20, Math.min(200, parseInt(bpmInput.value)));
    if (isPlaying) {
      stopMetronome();
      // bodyContainer.classList.remove('pulsing-bg');
    } else {
      startMetronome(bpm);
      // bodyContainer.classList.add('pulsing-bg');
    }
    isPlaying = !isPlaying;
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      toggleMetronome();
      bpmInput.blur(); // Remove focus from the input field
    }
  });

  // Add click event to the metronome circle
  const metronomeCircle = document.querySelector('.pulse-circle');
  metronomeCircle.addEventListener('click', function() {
    toggleMetronome();
  });
}


// ------pulsingCirclce
export function createPulsingCircle() {
  const diameter = 120;
  const radius = diameter / 2;
  const min_radius = radius*3/4

  const svg = d3.select('#metronome')
    .append('svg')
    .attr('width', diameter)
    .attr('height', diameter)
    .append('g')
    .attr('transform', `translate(${radius}, ${radius})`);

  const circle = svg.append('circle')
    .attr('class', 'pulse-circle')
    .attr('r', min_radius);

  function pulse(bpm) {
    // console.log("pulsing")
    // console.log(bpm)
    const interval = (60 / bpm) * 1000; // Interval in milliseconds
    const expansionDuration = interval / 6; // 1/5th of the contraction duration
    const contractionDuration = interval * 5 / 6; // Remainder of the interval

    circle.transition()
      .duration(expansionDuration) // Duration of one pulse expansion
      .attr('r', radius)
      .transition()
      .duration(contractionDuration) // Duration of one pulse contraction
      .attr('r', min_radius);
  }

  // Start pulsing on each beat
  document.addEventListener('beat', () => {
    const bpm = Math.max(20, Math.min(200, parseInt(document.getElementById('bpmInput').value)));
    pulse(bpm);
  });
}

// document.addEventListener('DOMContentLoaded', () => {
//   console.log("STARTING METRONOME")
//   createPulsingCircle();
//   setupMetronome();
// });