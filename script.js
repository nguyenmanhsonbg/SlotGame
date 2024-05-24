/*****************************************************************************
 *  script.js
 *  ---------
 *  Where all the fun happens :)
 *
 *  Created by: E.Cope						Last edit: 3/27/21
 *****************************************************************************/

// Global variables
const iconIdsArr = ["#icon-1", "#icon-2", "#icon-3", "#icon-4", "#icon-5"];
const slotClassArr = [".s1", ".s2", ".s3"];
let spinCount = 0;
const images = [
  "Image/slot-symbol1.png", // 7
  "Image/slot-symbol2.png", // cherries
  "Image/slot-symbol3.png", // bell
  "Image/slot-symbol4.png", // bar
  "Image/slot-symbol5.png", // bar
  "Image/slot-symbol6.png", // bar
  "Image/slot-symbol7.png", // bar
];
let DataStore = { wins: 0, loses: 0, most: 0, least: 0 };
const LocalStore = window.localStorage;

// Utility functions
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
    $("#try-your-luck").text("WINNER!");
    $("#try-your-luck").css("color", "lawngreen");
    $("#reset-btn").css("visibility", "visible");
    DataStore.wins += 1;
    LocalStore.setItem("NUM_WINS", DataStore.wins);
    let least = DataStore.least || 9999;
    let most = DataStore.most;
    if (spinCount > most) {
      LocalStore.setItem("MOST_SPINS", spinCount);
    }
    if (spinCount < least) {
      LocalStore.setItem("LEAST_SPINS", spinCount);
    }
    refreshStats();
  }
}

function startStorage() {
  if (LocalStore.getItem("NUM_WINS") !== null) {
    DataStore.wins = parseInt(LocalStore.getItem("NUM_WINS"));
    DataStore.loses = parseInt(LocalStore.getItem("NUM_LOSES"));
    DataStore.most = parseInt(LocalStore.getItem("MOST_SPINS"));
    DataStore.least = parseInt(LocalStore.getItem("LEAST_SPINS"));
  } else {
    LocalStore.setItem("NUM_WINS", DataStore.wins);
    LocalStore.setItem("NUM_LOSES", DataStore.loses);
    LocalStore.setItem("MOST_SPINS", DataStore.most);
    LocalStore.setItem("LEAST_SPINS", DataStore.least);
  }
  return DataStore;
}

function refreshStats() {
  $("#win-spins").text(DataStore.wins);
  $("#lose-spins").text(DataStore.loses);
  $("#most-spins").text(DataStore.most);
  $("#least-spins").text(DataStore.least);
}

function resetLocalStorage() {
  const conf = confirm("Are you sure you want to reset your game stats?");
  if (conf) {
    DataStore = { wins: 0, loses: 0, most: 0, least: 0 };
    refreshStats();
  }
}

function changeSlotImages(slotIndex) {
  let randomIndex = Math.floor(Math.random() * images.length);
  $(`.reel.s${slotIndex + 1}`).html(`<img src="${images[randomIndex]}" />`);
}

function displayResultsSequentially(dice) {
  let index = 0;
  function displayNextSlot() {
    if (index < dice.length) {
      $(`.reel.s${index + 1} img`).removeClass("spinning");
      $(`.reel.s${index + 1}`).html(`<img src="${images[dice[index]]}" />`);
      index++;
      setTimeout(displayNextSlot, 1000);
    } else {
      winCondition(dice[0], dice[1], dice[2], spinCount);
      refreshStats();
    }
  }
  displayNextSlot();
}

function Play() {
  let dice = [];
  for (let i = 0; i < 3; i++) {
    dice.push(Math.floor(Math.random() * images.length));
  }

  spinCount += 1;
  $("#num-spins").text(spinCount);
  DataStore.loses += 1;
  LocalStore.setItem("NUM_LOSES", DataStore.loses);

  console.log(`DEBUG: (${dice[0]}, ${dice[1]}, ${dice[2]})`);

  // Start the spinning animation for all reels
  $(".reel img").removeClass("stopping").addClass("spinning");

  // Function to change images during spinning
  const changeImagesInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      let randomIndex = Math.floor(Math.random() * images.length);
      $(`.reel.s${i + 1}`).html(`<img src="${images[randomIndex]}" />`);
    }
  }, 200);

  // Function to stop a specific reel
  function stopReel(reelIndex, diceValue, delay) {
    setTimeout(() => {
      $(`.reel.s${reelIndex + 1} img`)
        .removeClass("spinning")
        .addClass("stopping");
      $(`.reel.s${reelIndex + 1}`).html(`<img src="${images[diceValue]}" />`);

      if (reelIndex === 2) {
        clearInterval(changeImagesInterval); // Clear interval after the last reel stops
        winCondition(dice[0], dice[1], dice[2], spinCount);
        refreshStats();
      }
    }, delay);
  }

  // Stop each reel sequentially with custom delays
  stopReel(0, dice[0], 1000); // Stop the first reel after 1 second
  stopReel(1, dice[1], 4000); // Stop the second reel after 2 seconds
  stopReel(2, dice[2], 7000); // Stop the third reel after 3 seconds
}

$(document).ready(function () {
  disappear();
  $("#num-spins").text(spinCount);

  if (typeof Storage !== "undefined") {
    DataStore = startStorage();
    refreshStats();
  } else {
    console.warn(
      "Web Storage not supported! Features for this site will be missing."
    );
  }

  // handle-btn click
  $("#handle-btn").click(() => {
    $("#handle-btn").attr("src", "Image/SlotHandlePush.png");
    setTimeout(() => {
      $("#handle-btn").attr("src", "Image/SlotHandle.png");
    }, 200);
    Play();
  });

  // spin-btn click
  $("#spin-btn").click(() => {
    $("#spin-btn").attr("src", "Image/SlotButtonPressed.png");
    setTimeout(() => {
      $("#spin-btn").attr("src", "Image/SlotButton.png");
    }, 200);
    Play();
  });

  $("#reset-btn").click(() => {
    location.reload();
  });
});
