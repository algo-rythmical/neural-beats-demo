import { fetchAudio, isPromptValid, streamToBlob, classifyAudio } from "./audio.js";  

document.addEventListener("DOMContentLoaded", async function () {
    const generateBtn = document.getElementById("generateBtn");
  const transitionState = document.getElementById("transitionState");
  const downloadBtn = document.getElementById("downloadBtn");
  const classifyBtn = document.getElementById("classifyBtn");
  const downloadLink = document.getElementById("downloadLink");
  const audio = document.getElementById("audio");
  const canvas = document.getElementById("canvas");
  const promptInput = document.getElementById("promptInput");
  const classificationInput = document.getElementById("classification-file");
  const ctx = canvas.getContext("2d");

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256; //256 // Change to increase/decrease granularity
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  analyser.smoothingTimeConstant = 0.9; // Adjust this for smoothing

  // Generate music
  generateBtn.addEventListener("click", async function () {
    const prompt = promptInput.value;

    if (!isPromptValid(prompt)) {
      console.log("Invalid prompt", prompt); //TODO: do sth in UI
      return;
    }
    generateBtn.style.display = "none";
    transitionState.style.display = "block";

    try {
      const audioRes = await fetchAudio(prompt);
      const blob = await streamToBlob(audioRes.body);
      let url = window.URL.createObjectURL(blob);

      audio.src = url;
      // downloadLink.href = url;

      transitionState.style.display = "none";
      canvas.style.display = "block";
      downloadBtn.style.display = "block";
      generateBtn.style.display = "block";

      generateBtn.innerHTML = "Regenerate Music";
    } catch (error) {
      console.log(error); //TODO: do sth in UI
    }
  });
    


  // Audio player controls
  window.onload = function () {
    var audio = document.getElementById("audio");
    var playPauseBtn = document.getElementById("play-pause-btn");
    var songProgressBar = document.getElementById("song-progress-bar");
    var currentTimeDisplay = document.getElementById("current-time");
    var rewindBtn = document.getElementById("rewind-btn");
    var forwardBtn = document.getElementById("forward-btn");
  
    playPauseBtn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
        audioContext.resume().then(() => {
          draw();
        });
      } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
      }
    });
    rewindBtn.addEventListener("click", function () {
      audio.currentTime -= 10; // Rewind the song by 10 seconds
    });

    forwardBtn.addEventListener("click", function () {
      audio.currentTime += 10; // Forward the song by 10 seconds
    });

    audio.addEventListener("timeupdate", function () {
      var progress = audio.currentTime / audio.duration;
      songProgressBar.style.width = progress * 100 + "%";

      var minutes = Math.floor(audio.currentTime / 60);
      var seconds = Math.floor(audio.currentTime % 60);
      currentTimeDisplay.textContent =
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    });
    audio.addEventListener("ended", function () {
      playPauseBtn.innerHTML = '<i class="fa fa-play"></i>'; // Change the button back to the play state
    });
    var volumeControl = document.getElementById("volume");

    volumeControl.addEventListener("input", function () {
      audio.volume = volumeControl.value;
    });
  };


  // Audio visualizer
  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#2C2C34"; // background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / (0.6 * bufferLength)) * 5; // Adjusted bar width for 60% of the frequencies
    let x = 0;

    const startFreqIndex = Math.floor(0.1 * bufferLength);
    const endFreqIndex = Math.floor(0.8 * bufferLength);

    // Create the gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(1, "#b86a52");
    gradient.addColorStop(0, "#00adb5");

    for (let i = startFreqIndex; i < endFreqIndex; i++) {
      let barHeight = (dataArray[i] / 255) * canvas.height;

      ctx.fillStyle = gradient; //"#00adb5";  // Color of bars
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 3;
    }
  }

  audio.onplay = function () {
    audioContext.resume().then(() => {
      draw();
    });
  };

 //Highlight the active navigation link when on selected page
//  function updateActiveNavLink() {
//   const navLinks = document.querySelectorAll(".navbar a");
//   const currentPage = window.location.pathname || "/home";

//   navLinks.forEach((link) => {
//     link.classList.remove("active");
//     if (link.getAttribute("href") === currentPage) {
//       link.classList.add("active");
//     }
//   });
// }
// updateActiveNavLink();

  // navigation links hover effect
  document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", function () {
        this.classList.add("hover");
      });

      link.addEventListener("mouseleave", function () {
        this.classList.remove("hover");
      });
    });
  });

  // Downloding the music
  downloadBtn.addEventListener("click", function () {
    let link = document.createElement("a");
    link.href = audio.src;
    link.download = "download.mp3";
    link.click();
    link.remove()
  });

});
