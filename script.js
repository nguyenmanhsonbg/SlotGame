const iconIdsArr = ["#icon-1", "#icon-2", "#icon-3", "#icon-4", "#icon-5"];
const goldConsumingAmount = 3;
const goldRewardAmount = 4;
const diamonRewardAmount = 4;
const recieveGoldCondition = [1, 2, 3, 5, 6];
const recieveDiamondCondition = [0, 4];
const slotClassArr = [".s1", ".s2", ".s3"];
let spinCount = 0;
const images = [
  "Image/slot-symbol1.png", // book
  "Image/slot-symbol2.png", // arrow
  "Image/slot-symbol3.png", // sword
  "Image/slot-symbol4.png", // magnet
  "Image/slot-symbol5.png", // boom
  "Image/slot-symbol6.png", // toxic
  "Image/slot-symbol7.png", // king
];

let DataStore = { spins: 0, wins: 0, loses: 0, gold: 10, diamond: 0 };
const LocalStore = window.localStorage;
let isSpinning = false;

// script.js

// Add references to the audio elements
const backgroundMusic = document.getElementById("background-music");
const winningSound = document.getElementById("winning-sound");
const spinSound = document.getElementById("spin-sound");

// Function to play the background music
function playBackgroundMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch((error) => {
      console.log("Autoplay error:", error);
    });
  }
}

// Function to play the spin sound
function playSpinSound() {
  if (!spinSound.paused) {
    spinSound.pause();
    spinSound.currentTime = 0;
  }
  spinSound.play();
}

// Function to stop the spin sound
function stopSpinSound() {
  spinSound.pause();
  spinSound.currentTime = 0; // Reset to the beginning
}

// Function to play the winning sound
function playWinningSound() {
  if (!winningSound.paused) {
    winningSound.pause();
    winningSound.currentTime = 0;
  }
  winningSound.play();
}

// Function to stop the winning sound
function stopWinningSound() {
  winningSound.pause();
  winningSound.currentTime = 0; // Reset to the beginning
}

// Function to handle first user interaction
function handleFirstInteraction() {
  playBackgroundMusic();
  document.removeEventListener("click", handleFirstInteraction);
  document.removeEventListener("keydown", handleFirstInteraction);
}

// Add event listeners for first user interaction
document.addEventListener("click", handleFirstInteraction);
document.addEventListener("keydown", handleFirstInteraction);

function rng(min, max) {
  const rand = Math.random() * (max - min) + min;
  return Math.floor(rand);
}

function disappear() {
  for (let i = 0; i < iconIdsArr.length; i++) {
    for (let j = 0; j < slotClassArr.length; j++) {
      $(`${slotClassArr[j]}`).find(`${iconIdsArr[i]}`).css("display", "none");
    }
  }
}

function magicAct(num1, num2, num3) {
  disappear();
  for (let i = 0; i < iconIdsArr.length; i++) {
    if (num1 == i) {
      $(".s1").find(`${iconIdsArr[num1]}`).css("display", "initial");
    }
    if (num2 == i) {
      $(".s2").find(`${iconIdsArr[num2]}`).css("display", "initial");
    }
    if (num3 == i) {
      $(".s3").find(`${iconIdsArr[num3]}`).css("display", "initial");
    }
  }
}

function winCondition(num1, num2, num3, spinCount) {
  if (num1 == num2 && num2 == num3) {
    let DS = DataStore;
    let LS = LocalStore;
    DS.wins += goldRewardAmount;
    LS.setItem("NUM_WINS", DS.wins);
    if (recieveGoldCondition.includes(num1)) {
      DS.gold += goldRewardAmount;
      LS.setItem("NUM_GOLD", DS.gold);
      showPopup(goldRewardAmount, "Image/coin.png"); // Show popup with reward amount
    } else {
      DS.diamond += diamonRewardAmount;
      LS.setItem("NUM_DIAMOND", DS.diamond);
      showPopup(diamonRewardAmount, "Image/diamond.png"); // Show popup with reward amount
    }
    playWinningSound();
    refreshStats();
  }
}

function startStorage() {
  const LS = LocalStore;
  let DS = DataStore;
  if (LS.getItem("NUM_SPINS") !== null) {
    DS.spins = parseInt(LS.getItem("NUM_SPINS"));
    DS.wins = parseInt(LS.getItem("NUM_WINS"));
    DS.loses = parseInt(LS.getItem("NUM_LOSES"));
    DS.gold = parseInt(LS.getItem("NUM_GOLD"));
    DS.diamond = parseInt(LS.getItem("NUM_DIAMOND"));
  } else {
    LS.setItem("NUM_SPINS", DS.spins);
    LS.setItem("NUM_WINS", DS.wins);
    LS.setItem("NUM_LOSES", DS.loses);
    LS.setItem("NUM_GOLD", DS.gold);
    LS.setItem("NUM_DIAMOND", DS.diamond);
  }
  return DS;
}

// New animation styles
function blinkingLights() {
  clearInterval(window.lightInterval);
  const lightsOn = document.querySelectorAll(".light-on");
  window.lightInterval = setInterval(() => {
    lightsOn.forEach((light) => {
      light.style.opacity = light.style.opacity === "1" ? "0" : "1";
    });
  }, 500); // Blinking every 0.5 seconds
}

function chasingLights() {
  clearInterval(window.lightInterval);
  const lightsOn = document.querySelectorAll(".light-on");
  let index = 0;
  window.lightInterval = setInterval(() => {
    lightsOn.forEach((light, i) => {
      light.style.opacity = i === index ? "1" : "0";
    });
    index = (index + 1) % lightsOn.length;
  }, 200); // Chasing every 0.2 seconds
}

function waveLights() {
  clearInterval(window.lightInterval);
  const lightsOn = document.querySelectorAll(".light-on");
  let index = 0;
  window.lightInterval = setInterval(() => {
    lightsOn.forEach((light, i) => {
      light.style.opacity = Math.abs(i - index) <= 2 ? "1" : "0";
    });
    index = (index + 1) % lightsOn.length;
  }, 300); // Wave effect every 0.3 seconds
}

function randomLights() {
  clearInterval(window.lightInterval);
  const lightsOn = document.querySelectorAll(".light-on");
  window.lightInterval = setInterval(() => {
    lightsOn.forEach((light) => {
      light.style.opacity = Math.random() > 0.5 ? "1" : "0";
    });
  }, 400); // Random change every 0.4 seconds
}

// Function to start the chosen light style
function startLightStyle(style) {
  switch (style) {
    case "blinking":
      blinkingLights();
      break;
    case "chasing":
      chasingLights();
      break;
    case "wave":
      waveLights();
      break;
    case "random":
      randomLights();
      break;
    default:
      console.warn("Unknown light style");
  }
}

// Cycle through styles
function cycleLightStyles() {
  const styles = ["blinking", "chasing", "wave", "random"];
  let currentIndex = 0;
  setInterval(() => {
    startLightStyle(styles[currentIndex]);
    currentIndex = (currentIndex + 1) % styles.length;
  }, 3000); // Switch style every 3 seconds
}

function updateStat(statId, newValue) {
  const statElement = $(statId);
  const oldValue = parseInt(statElement.text());
  statElement.text(newValue);

  if (newValue > oldValue) {
    statElement.addClass("increase");
    setTimeout(() => {
      statElement.removeClass("increase");
    }, 500);
  } else if (newValue < oldValue) {
    statElement.addClass("decrease");
    setTimeout(() => {
      statElement.removeClass("decrease");
    }, 500);
  }
}

function refreshStats() {
  let DS = DataStore;
  updateStat("#spin-time-count", DS.spins);
  updateStat("#win-count", DS.wins);
  updateStat("#lose-count", DS.loses);
  updateStat("#gold-count", DS.gold);
  updateStat("#diamond-count", DS.diamond);
  updateStat("#coin-count", DS.gold); // Display current gold amount
  updateStat("#diamond-count", DS.diamond); // Display current diamond amount
}

function resetLocalStorage() {
  const conf = confirm("Are you sure you want to reset your game stats?");
  if (conf) {
    DataStore = { spins: 0, wins: 0, loses: 0, gold: 10, diamond: 0 };
    LocalStore.setItem("NUM_SPINS", 0);
    LocalStore.setItem("NUM_WINS", 0);
    LocalStore.setItem("NUM_LOSES", 0);
    LocalStore.setItem("NUM_GOLD", 0);
    LocalStore.setItem("NUM_DIAMOND", 0);
    refreshStats();
  }
}

function CheckResource() {
  var gold = DataStore.gold;
  if (gold < goldConsumingAmount) {
    console.log("Not enough gold !");
    return false;
  }
  return true;
}

function Play() {
  if (!CheckResource() || isSpinning) {
    return;
  }

  isSpinning = true; // Set spinning flag to true
  $(".reel img").addClass("spinning");

  let dice = [];
  for (let i = 0; i < 3; i++) {
    dice.push(Math.floor(Math.random() * images.length));
  }

  DataStore.gold -= goldConsumingAmount;
  DataStore.spins += 1;
  spinCount = DataStore.spins;

  localStorage.setItem("NUM_SPINS", DataStore.spins);
  localStorage.setItem("NUM_GOLD", DataStore.gold);
  $("#spin-time-count").text(spinCount);
  refreshStats();
  console.log(`DEBUG: (${dice[0]}, ${dice[1]}, ${dice[2]})`);

  let spinIntervals = [];
  for (let i = 0; i < 3; i++) {
    spinIntervals.push(
      setInterval(() => {
        changeSlotImages(i);
      }, 100)
    );
  }

  const delays = [1000, 3000, 5000];
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      clearInterval(spinIntervals[i]);
      displayResultForReel(i, dice[i]);
    }, delays[i]);
  }

  setTimeout(() => {
    winCondition(dice[0], dice[1], dice[2], spinCount);
    refreshStats();
    isSpinning = false; // Reset spinning flag
    stopSpinSound();
  }, Math.max(...delays) + 500);
}

function changeSlotImages(slotIndex) {
  let randomIndex = Math.floor(Math.random() * images.length);
  $(`.reel.s${slotIndex + 1}`).html(`<img src="${images[randomIndex]}" />`);
}

function displayResultForReel(reelIndex, result) {
  $(`.reel.s${reelIndex + 1} img`).removeClass("spinning");
  $(`.reel.s${reelIndex + 1}`).html(`<img src="${images[result]}" />`);
}

function showPopup(amount, icon) {
  $("#win-amount").text(amount);
  $("#win-icon").attr("src", icon); // Set the correct icon
  const popup = $("#win-popup");
  popup.removeClass("hide").addClass("show").css("display", "block");
}

function hidePopup() {
  const popup = $("#win-popup");
  popup.removeClass("show").addClass("hide");
  setTimeout(() => {
    popup.css("display", "none");
    stopWinningSound(); // Stop the winning sound when the popup is hidden
  }, 500); // Duration of the hide animation
}

$(document).ready(function () {
  disappear();
  cycleLightStyles();

  $("#spin-time-count").text(spinCount);

  if (typeof Storage !== "undefined") {
    DataStore = startStorage();
    refreshStats();
  } else {
    console.warn(
      "Web Storage not supported! Features for this site will be missing."
    );
  }

  $("#handle-btn").click(() => {
    $("#handle-btn").attr("src", "Image/SlotHandlePush.png");
    setTimeout(() => {
      $("#handle-btn").attr("src", "Image/SlotHandle.png");
    }, 200);
    playSpinSound();
    Play();
  });

  $("#spin-btn").click(() => {
    $("#spin-btn").attr("src", "Image/SlotButtonPressed.png");
    setTimeout(() => {
      $("#spin-btn").attr("src", "Image/SlotButton.png");
    }, 200);
    playSpinSound();
    Play();
  });

  $("#claim-btn").click(() => {
    $("#claim-btn img").css("transform", "scale(0.95)");
    setTimeout(() => {
      $("#claim-btn img").css("transform", "scale(1)");
      hidePopup();
    }, 200);
  });

  $(".ray-img").addClass("rotate");

  $("#reset-btn").click(() => {
    location.reload();
  });
});
