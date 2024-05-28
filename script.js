//#region define
let currentUser = null;
const usersData = {};

const iconIdsArr = ["#icon-1", "#icon-2", "#icon-3", "#icon-4", "#icon-5"];
const recieveGoldCondition = [0, 1, 2, 3, 4, 5, 6];
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

let DataStore = { spins: 0, wins: 0, loses: 0, gold: 0, diamond: 0 };
const LocalStore = window.localStorage;
let isSpinning = false;

// Add references to the audio elements
const backgroundMusic = document.getElementById("background-music");
const winningSound = document.getElementById("winning-sound");
const spinSound = document.getElementById("spin-sound");

let goldBetAmount = 1;
//#endregion

//#region login
function login(username) {
  currentUser = username;
  loadUserData();
  document.getElementById("login-modal").style.display = "none";
}

function logout() {
  currentUser = null;
  document.getElementById("login-modal").style.display = "block";
}

function saveUserData() {
  if (currentUser) {
    localStorage.setItem(
      `slot_machine_${currentUser}`,
      JSON.stringify(DataStore)
    );
  }
}

function loadUserData() {
  if (currentUser) {
    const data = localStorage.getItem(`slot_machine_${currentUser}`);
    if (data) {
      DataStore = JSON.parse(data);
    } else {
      DataStore = { spins: 0, wins: 0, loses: 0, gold: 5, diamond: 0 };
    }
    refreshStats();
  }
}

document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  if (username) {
    login(username);
  }
});

// Get the modal
const modal = document.getElementById("login-modal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

function showLoginModal() {
  modal.style.display = "block";
}

// When the user clicks the button, open the modal
window.onload = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
//#endregion

//#region audio
// Function to play the background music
function playBackgroundMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.volume = 0.1;
    backgroundMusic.play().catch((error) => {
      console.log("Autoplay error:", error);
    });
  }
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0; // Reset to the beginning
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

//#endregion

//#region lights

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
//#endregion

//#region games
function CheckResource() {
  var gold = DataStore.gold;
  if (gold > 0) {
    if (goldBetAmount == 0) {
      showMessagePopup("Please increase bet gold!");
      return false;
    } else if (gold < goldBetAmount) {
      showMessagePopup("Not enough gold to bet!");
      return false;
    }
    return true;
  } else {
    showMessagePopup("Not enough gold to play!");
    return false;
  }
}

function Play() {
  if (!currentUser) {
    showLoginModal();
    return;
  }
  if (!CheckResource() || isSpinning) {
    return;
  }
  DataStore.gold -= goldBetAmount;
  refreshStats();
  isSpinning = true;
  playSpinSound();
  $(".reel img").addClass("spinning");
  let dice = [];
  for (let i = 0; i < 3; i++) {
    dice.push(Math.floor(Math.random() * images.length));
  }

  DataStore.spins += 1;
  spinCount = DataStore.spins;
  saveUserData();
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
    isSpinning = false;
    stopSpinSound();
  }, Math.max(...delays) + 500);

  if (DataStore.gold < goldBetAmount) {
    resetBetAmount();
  }
}

function changeSlotImages(slotIndex) {
  let randomIndex = Math.floor(Math.random() * images.length);
  $(`.reel.s${slotIndex + 1}`).html(`<img src="${images[randomIndex]}" />`);
}

function displayResultForReel(reelIndex, result) {
  $(`.reel.s${reelIndex + 1} img`).removeClass("spinning");
  $(`.reel.s${reelIndex + 1}`).html(`<img src="${images[result]}" />`);
}

function resetBetAmount() {
  let DS = DataStore;
  let currentGold = DS.gold;
  //reset amount bet gold when current bet gold more big than user gold
  if (currentGold < goldBetAmount) {
    goldBetAmount = currentGold;
  }
  refreshBetAmount();
}

function refreshBetAmount() {
  const goldBetAmountElement = document.getElementById("gold-bet-amount");
  goldBetAmountElement.textContent = goldBetAmount;
}

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

// Update your functions to save data after each change
function winCondition(num1, num2, num3, spinCount) {
  if (num1 == num2 && num2 == num3) {
    let DS = DataStore;
    DS.wins += 1;

    if (recieveGoldCondition.includes(num1)) {
      let goldRewardAmount = getGoldReward(num1);
      DS.gold += getGoldReward(num1);
      showPopup(goldRewardAmount, "Image/coin.png");
    } else {
      let diamonRewardAmount = getDiamondReward(num1);
      DS.diamond += diamonRewardAmount;
      showPopup(diamonRewardAmount, "Image/diamond.png");
    }
    refreshStats();
    saveUserData(); // Save user data
  }
}

//get gold reward base on item
function getGoldReward(num) {
  var rate = 0;
  switch (num) {
    //book x15
    case 0:
      rate = 15;
      break;
    //arrow x15
    case 1:
      rate = 15;
      break;
    //sword x15
    case 2:
      rate = 15;
      break;
    //magnet x9
    case 3:
      rate = 9;
      break;
    //boom x50
    case 4:
      rate = 50;
      break;
    //toxic x15
    case 5:
      rate = 15;
      break;
    //king x 25
    case 6:
      rate = 25;
      break;
    default:
      console.warn("Unknown num");
  }
  return rate * goldBetAmount;
}

function getDiamondReward(num) {
  var rate = 0;
  switch (num) {
    //book x30
    case 0:
      rate = 30;
      break;
    //boom x50
    case 4:
      rate = 50;
      break;
    default:
      console.warn("Unknown num");
  }

  return rate * goldBetAmount;
}
//#endregion

//#region storage
function startStorage() {
  const LS = LocalStore;
  let DS = DataStore;
  if (LS.getItem("NUM_SPINS") !== null) {
    DS.spins = parseInt(LS.getItem("NUM_SPINS"));
    DS.gold = parseInt(LS.getItem("NUM_GOLD"));
    DS.diamond = parseInt(LS.getItem("NUM_DIAMOND"));
  } else {
    LS.setItem("NUM_SPINS", DS.spins);
    LS.setItem("NUM_GOLD", DS.gold);
    LS.setItem("NUM_DIAMOND", DS.diamond);
  }
  return DS;
}

function resetLocalStorage() {
  const conf = confirm("Are you sure you want to reset your game stats?");
  if (conf) {
    DataStore = { spins: 0, wins: 0, loses: 0, gold: 0, diamond: 0 };
    saveUserData(); // Save user data
    refreshStats();
  }
}

//#endregion

//#region stats
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
  let currentGold = DS.gold;
  updateStat("#spin-time-count", DS.spins);
  updateStat("#win-count", DS.wins);
  updateStat("#lose-count", DS.loses);
  updateStat("#gold-count", DS.gold);
  updateStat("#diamond-count", DS.diamond);
  updateStat("#coin-count", currentGold);
  updateStat("#diamond-count", DS.diamond);
  refreshBetAmount();
}
//#endregion

//#region popup
function showPopup(amount, icon) {
  $("#win-amount").text(amount);
  $("#win-icon").attr("src", icon); // Set the correct icon
  const popup = $("#win-popup");
  popup.removeClass("hide").addClass("show").css("display", "block");
  playWinningSound();
}

function hidePopup() {
  const popup = $("#win-popup");
  popup.removeClass("show").addClass("hide");
  setTimeout(() => {
    popup.css("display", "none");
    stopWinningSound(); // Stop the winning sound when the popup is hidden
  }, 500); // Duration of the hide animation
}

// Function to show a custom message popup
function showMessagePopup(message) {
  $("#message-text").text(message);
  const popup = $("#message-popup");
  popup.removeClass("hide").addClass("show").css("display", "block");
}

function hideMessagePopup() {
  const popup = $("#message-popup");
  popup.removeClass("show").addClass("hide");
  setTimeout(() => {
    popup.css("display", "none");
  }, 500); // Duration of the hide animation
}

// Event listener for the message close button
$("#message-close-btn").click(() => {
  hideMessagePopup();
});
//#endregion
$(document).ready(function () {
  disappear();
  cycleLightStyles();
  $("#spin-time-count").text(spinCount);
  if (typeof Storage !== "undefined") {
    if (currentUser) {
      loadUserData();
    }
    refreshStats();
  } else {
    console.warn(
      "Web Storage not supported! Features for this site will be missing."
    );
  }

  $("#handle-btn").click(() => {
    if (!currentUser) {
      showLoginModal();
      return;
    }
    if (!isSpinning) {
      $("#handle-btn").attr("src", "Image/SlotHandlePush.png");
      setTimeout(() => {
        $("#handle-btn").attr("src", "Image/SlotHandle.png");
      }, 200);
    }
    Play();
  });

  $("#spin-btn").click(() => {
    if (!currentUser) {
      showLoginModal();
      return;
    }

    if (!isSpinning) {
      $("#spin-btn").attr("src", "Image/SlotButtonPressed.png");
      setTimeout(() => {
        $("#spin-btn").attr("src", "Image/SlotButton.png");
      }, 200);
    }
    Play();
  });

  $("#claim-btn").click(() => {
    $("#claim-btn img").css("transform", "scale(0.95)");
    setTimeout(() => {
      $("#claim-btn img").css("transform", "scale(1)");
      hidePopup();
    }, 200);
  });

  $("#increase-bet").click(() => {
    if (!currentUser) {
      showLoginModal();
      return;
    }
    if (goldBetAmount < DataStore.gold) {
      goldBetAmount += 1;
      refreshBetAmount();
    } else {
      showMessagePopup("Not enough gold to bet");
    }
  });

  $("#decrease-bet").click(() => {
    if (!currentUser) {
      showLoginModal();
      return;
    }
    if (goldBetAmount > 1) {
      goldBetAmount -= 1;
      refreshBetAmount();
    }
  });

  $(".ray-img").addClass("rotate");
});
