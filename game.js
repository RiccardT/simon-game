
var buttonColors = ["green", "red", "yellow", "blue"];
var gamePattern = [];
var levelCounter = 0;
var userProgressionAtCurrentLevel = 0;

allowUserToStartGame();

function allowUserToStartGame() {
  $("body").on('keypress', function(event) {
    nextSequence();
    turnOnGameInterfacingForButtons();
    $('#level-title').text(`Level ${levelCounter}`);
    disAllowUserFromRestartingGame();
  });
}

function turnOnGameInterfacingForButtons() {
  $('.btn').on('click', gameLogic);
}

function gameLogic() {
  var gameOver = false;
  var chosenButton = $(this);
  if (correctButtonWasSelected(chosenButton)) {
    notifyUserOfCorrectChoiceWithButtonAnimation(chosenButton);
    userProgressionAtCurrentLevel += 1;
  }
  else {
    gameOver = true;
  }
  if (endOfLevelReached()) {
    userProgressionAtCurrentLevel = 0;
    setTimeout(function () {
      nextSequence();
    }, 1000);
  }
  else if (gameOver) {
    allowUserToStartGame();
    tellUserTheyLost();
    disAllowUserFromClickingOnButtons();
    resetGameState();
  }
}

function disAllowUserFromRestartingGame() {
  $("body").off('keypress');
}

function disAllowUserFromClickingOnButtons() {
  $('.btn').off('click');
}

function nextSequence() {
  var randomNumber = getRandomInteger(4);
  pushRandomColorOntoGamePatternWithRandomNumber(randomNumber);
  alertUserOfNextPatternWithRandomNumber(randomNumber);
  levelCounter += 1;
  $('#level-title').text(`Level ${levelCounter}`);

}

function pushRandomColorOntoGamePatternWithRandomNumber(randomNumber) {
  var randomColor = buttonColors[randomNumber];
  gamePattern.push(randomColor);
}

function alertUserOfNextPatternWithRandomNumber(randomNumber) {
  var randomColor = buttonColors[randomNumber];
  var randomButton = $(`#${randomColor}`);
  flashJQueryElement(randomButton, 75);
  playCorrespondingColorSoundForButton(randomButton);
}

function getRandomInteger(max) {
  return Math.floor(Math.random() * max);
}

function notifyUserOfCorrectChoiceWithButtonAnimation(chosenButton) {
  animateClicked(chosenButton);
  flashJQueryElement(chosenButton, 75);
  playCorrespondingColorSoundForButton(chosenButton);
}

function animateClicked(clickedElement) {
  clickedElement.addClass('pressed');
  setTimeout(function () {
    clickedElement.removeClass('pressed');
  }, 100);
}

function flashJQueryElement(element, flashInterval) {
  element.fadeOut(flashInterval).fadeIn(flashInterval);
}

function playCorrespondingColorSoundForButton(selectedButton) {
  var selectedButtonColor = selectedButton.attr('id');
  var audio = new Audio(`sounds/${selectedButtonColor}.mp3`);
  audio.play();
}


function resetGameState() {
  gamePattern = [];
  userProgressionAtCurrentLevel = 0;
  levelCounter = 0;
  atBeginningOfGame = true;
}

function correctButtonWasSelected(selectedButton) {
  var selectedButtonColor = selectedButton.attr('id');
  return gamePattern[userProgressionAtCurrentLevel] == selectedButtonColor;
}

function endOfLevelReached() {
  return userProgressionAtCurrentLevel == gamePattern.length;
}

function tellUserTheyLost() {
  $('#level-title').text('Game Over, Press Any Key to Restart');
  var domBody = $('body');
  playGameOverSound();
  domBody.addClass('game-over');
  setTimeout(function () {
    domBody.removeClass('game-over');
  }, 200);

}

function playGameOverSound() {
  var gameOverAudio = new Audio('sounds/wrong.mp3');
  gameOverAudio.play();
}
