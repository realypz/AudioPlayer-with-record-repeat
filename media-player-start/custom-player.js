// $(document).ready(function(){

var media = document.querySelector('video');

var controls = document.querySelector('.controls');

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var record = document.querySelector('.record');
var playRecord = document.querySelector('.play-record');
var speedDown = document.querySelector('.speedDown');
var speedUp = document.querySelector('.speedUp');
var progressBar = document.getElementById("progressBar");

var timerWrapper = document.querySelector('.timer');

var timer = document.querySelector('.controls .playTimeText');

var timerBar = document.querySelector('.timer div');

var repeatModeText = document.querySelector('.repeatMode');
var videoPlayer = document.querySelector('.player');
var speedText = document.querySelector('.controls .speedText');

var dragFileBackground = document.getElementById("dragFile-Background");

var volumeSlider = document.getElementById('volume-slider');

videoPlayer.style.background = "black";


// -------------------- 『 color used in the script 』 --------------------
var blueColor = 'rgba(26, 158, 219, 0.925)';
var greenColor = 'rgba(10, 226, 64, 0.925)';
var whiteColor = '#3f3f3f';
var redColor = '#ee4612';



// -------------------- 『progressBar』 --------------------
$(document).ready(function(){
  progressBar.addEventListener('mousedown', function (e) {
    adjustProgress(e);
  });

  progressBar.addEventListener('mouseup', function (e) {
    adjustProgress(e);
  });

  // progressBar.addEventListener('mousemove', function (e) {
  //   adjustProgress(e);
  // });
  
  function adjustProgress(e){
    var clickedPos = e.pageX - $("progress").offset().left;  // mouse-clicked_x - progressBar-offset left
    var barWidth = $("progress").width();
    var progressRatio = clickedPos/barWidth;
    progressBar.value = progressRatio;
    // alert("Progress Ratio " +  media.duration);

    media.currentTime = progressRatio * media.duration;

  }
});




// For test record time purpose
recordTimeDisplay = {
    recordStartTime: document.querySelector('.recordStartTime'),
    recordEndTime: document.querySelector('.recordEndTime'),
}

media.removeAttribute('controls');
controls.style.visibility = 'visible';



// -------------------- 『Play/Pause button 』 --------------------
play.addEventListener('click', playPauseMedia);

function playPauseMedia() {
    if(media.paused) {

      play.setAttribute('data-icon','u');

      dragFileBackground.style.setProperty("z-index", "0");

      media.play();

      // playRecord.removeAttribute('disabled', true);
      record.removeAttribute('disabled', true);

    } else {
      play.setAttribute('data-icon','P');
      media.pause();

      // playRecord.removeAttribute('disabled', true);
      record.removeAttribute('disabled', true);
    }
}



// -------------------- 『 Stop buttom 』 --------------------

stop.addEventListener('click', function(){
    stopMedia();
});

media.addEventListener('ended', stopMedia);

function stopMedia() {
    media.pause();
    media.currentTime = 0;
    play.setAttribute('data-icon','P');


    playRecord.style.removeProperty('color');
    playRecord.setAttribute('disabled', true);

    record.style.removeProperty('color');
    record.setAttribute('disabled', true);

    recordOBJ.startTime = null;
    recordOBJ.endTime = null;
    recordOBJ.isRecording = false;
    recordOBJ.playingRecord = false;
    recordOBJ.hasRecord = false;

    dragFileBackground.style.setProperty("z-index", "1");
}




// -------------------- 『 Start/stop recording button 』 --------------------
record.setAttribute("disabled", true);
record.addEventListener('click', startStopRecord)


record.addEventListener('keydown', function(e){
  console.log(e.keyCode);
});

play.removeEventListener('keydown', function (){});



// Set activated effect (for the 'record' button)
function setActivatedEffect(button){
    button.setAttribute('color', redColor);
}

playRecord.setAttribute('disabled', true);  

function recordObj() {
    this.startTime = null;
    this.endTime = null;
    this.isRecording = false;
    this.playingRecord = false;
    this.hasRecord = false;
    
    this.reset = function(){
        this.startTime = null;
        this.endTime = null;
        this.isRecording = false;
        this.playingRecord = false;
        this.hasRecord = false;
        recordTimeDisplay.recordStartTime.textContent = "Record start time: ";
        recordTimeDisplay.recordEndTime.textContent = "Record end time: "; 
        repeatModeText.textContent = "Repeat mode: " + "False";
        playRecord.removeAttribute('disabled', true);
        playRecord.style.removeProperty('color');
    }
};

var recordOBJ = new recordObj();

function startStopRecord(){
    if (recordOBJ.isRecording == false && recordOBJ.hasRecord == false){
        recordOBJ.startTime = media.currentTime;

        console.log('断点1');
        recordTimeDisplay.recordStartTime.textContent = "Record start time: " + recordOBJ.startTime;

        recordOBJ.isRecording = true;

        // Disable the playRecord button
        playRecord.setAttribute('disabled', true);

        // set the record button to red color
        record.style.color = redColor;

    } else if (recordOBJ.isRecording == true && recordOBJ.hasRecord == false){
        recordOBJ.endTime = media.currentTime;

        recordTimeDisplay.recordEndTime.textContent = "Record end time: " + recordOBJ.endTime;

        recordOBJ.isRecording = false;
        recordOBJ.hasRecord = true;

        playRecord.removeAttribute("disabled", true);

        record.style.color = greenColor;
        playRecord.style.removeProperty('color');

        // Immediately play the recorded part.
        playingTheRecord();

    }
}

// -------------------- 『 Respond the keyboard short-cuts 』 --------------------
window.addEventListener("keydown", function(e) {
  e.preventDefault();
  // e.stopPropagation();
  var code = e.keyCode;
  if (code == 82 && recordOBJ.hasRecord == false && recordOBJ.playingRecord == false){
    startStopRecord();
  } else if (code == 82 && recordOBJ.hasRecord == true && recordOBJ.playingRecord == true){
    playingTheRecord();
    // 暂停重播后立即进入下一段录制
    startStopRecord();
  } else if (code == 82 && recordOBJ.playingRecord == true 
            && recordOBJ.hasRecord == true 
            && recordOBJ.isRecording == false){
    playingTheRecord();
    startStopRecord();
  } else if (code == 67 && recordOBJ.playingRecord == true 
              && recordOBJ.hasRecord == true 
              && recordOBJ.isRecording == false){
    playingTheRecord();
}
  else if (code == 32){
    playPauseMedia();
  }
  else if (code == 83){
    stopMedia();
  }
});


// -------------------- 『 media response to "click" 』 --------------------
// Pause or play when click in the media area
media.addEventListener("click", playPauseMedia);




// -------------------- 『 Play record button 』 --------------------
playRecord.addEventListener('click', playingTheRecord);

function playingTheRecord(){
    if (recordOBJ.playingRecord == false 
      && recordOBJ.hasRecord == true
      && recordOBJ.isRecording == false){

          media.currentTime = recordOBJ.startTime;
          recordOBJ.playingRecord = true;
          repeatModeText.textContent = "Repeat mode: " + "True";

          // Disable the record button
          record.setAttribute("disabled", true);
          playRecord.style.color = blueColor; // Set blue when playing record

    } else if (    recordOBJ.playingRecord == true 
                && recordOBJ.hasRecord == true 
                && recordOBJ.isRecording == false) {
        media.currentTime = recordOBJ.endTime;
        recordOBJ.playingRecord = false;
        repeatModeText.textContent = "Repeat mode: " + "False";

        recordTimeDisplay.recordStartTime.textContent = "Record start time: ";
        recordTimeDisplay.recordEndTime.textContent = "Record end time: "; 

        // Enable the record button
        record.removeAttribute("disabled", true);
        record.style.removeProperty('color');
        recordOBJ.reset();      
        playRecord.style.color = whiteColor; // Set white when stop playing record
    }    
}


// The displayed time updated.
media.addEventListener('timeupdate', elapsedTimeUpdate);

function elapsedTimeUpdate(){
    // console.log(media.currentTime);
    if (Math.abs(media.currentTime - recordOBJ.endTime) <= 0.2 
        &&  recordOBJ.playingRecord == true ){
        media.currentTime = recordOBJ.startTime; 
    } 

};





// -------------------- 『 SpeedUp and SpeedDown button 』 --------------------
speedDown.addEventListener('click', mediaSlowDown);
speedUp.addEventListener('click', mediaSpeedUp);

var intervalSpeedUp;
var intervalSpeedDown;
  
function mediaSlowDown() {
  media.playbackRate -= 0.1;
  enableDisableSpeedAdjust();
}

function mediaSpeedUp() {
  media.playbackRate += 0.1;
  enableDisableSpeedAdjust();
}

function enableDisableSpeedAdjust(){

  if (media.playbackRate >= 2.0){
    speedUp.setAttribute('disabled', true);
  }else {
    speedUp.removeAttribute('disabled', true);
  }

  if (media.playbackRate <= 0.5 ){
    speedDown.setAttribute('disabled', true);
  }else{
    speedDown.removeAttribute('disabled',true);
  }

  speedText.textContent = media.playbackRate.toFixed(1) + 'px';
}

  



// -------------------- 『 Updating the elapsed time & Progress bar』 --------------------
media.addEventListener('timeupdate', setProgressbar, false);

function setProgressbar() {
    var minutes = Math.floor(media.currentTime / 60);
    var seconds = Math.floor(media.currentTime - minutes * 60);
    var minuteValue;
    var secondValue;
  
    if (minutes < 10) {
      minuteValue = '0' + minutes;
    } else {
      minuteValue = minutes;
    }
  
    if (seconds < 10) {
      secondValue = '0' + seconds;
    } else {
      secondValue = seconds;
    }
  
    var mediaTime = minuteValue + ':' + secondValue;
    timer.textContent = mediaTime;
  
    // progressBar.value = media.currentTime/500;
    progressBar.value = media.currentTime/media.duration;
}

speedDown.classList.remove('active');
speedUp.classList.remove('active');
clearInterval(intervalSpeedDown);
clearInterval(intervalSpeedUp);




// -------------------- 『 Full Screen button 』 --------------------
var fullScreen = document.querySelector('.fullScreen');
var docElm = document.documentElement; 
var inFullscreen = false;

fullScreen.addEventListener('click', function () {
  if (inFullscreen == false){
    docElm.requestFullscreen();
    inFullscreen = true;
    // alert(document.exitFullscreen);
  } else {    

    if (document.exitFullscreen) {  
      document.exitFullscreen();  
  }  
  else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
  }  
  else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
  }  
  else if (document.msExitFullscreen) {  
      document.msExitFullscreen();  
  } 
    
    inFullscreen = false;
  } 
})





// -------------------- 『 Resize body 』 --------------------
var videoHeight;

adjustAppearance();

window.addEventListener('resize', function (e){
  adjustAppearance();
});

function adjustAppearance () {
  // Adjust the bottom border of the player
  videoHeight = $(window).height() - $(".controls").height();
  $(".mainVideo").height(videoHeight);

  $("#dragFile-Background").height(videoHeight);
}



  
  
// -------------------- 『Drag and Drop media file 』 --------------------
// Getting the file source is defined in event "drop", but the 
// other three events do happen before the "drop" event happens.
// Thus we need to prevent the default event happens until the last
// event has been reached.


// The dragFile background and the video player shoudld response to "dragging"
// a file.
respondDragDrop(dragFileBackground);

respondDragDrop(media);

function respondDragDrop (dropZone){
  dropZone.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
  }, false);

  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
  }, false);

  dropZone.addEventListener("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
  }, false);

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var file = e.dataTransfer.files[0];
    var fileURL = URL.createObjectURL(file);

    startPlayMedia(fileURL);
  });
}



// -------------------- 『 Open file by selecting from explorer 』 --------------------
var fileInput = document.getElementById("fileInput");

var playSelectedFile = function (event) {
  var URL = window.URL || window.webkitURL;
  var file = this.files[0];
  console.log(file);
  var fileURL = URL.createObjectURL(file);
  startPlayMedia(fileURL);
};


function startPlayMedia(fileURL) {
  media.removeEventListener('timeupdate', elapsedTimeUpdate);
  media.removeEventListener('timeupdate', setProgressbar, false);

  media.src = fileURL;

  media.addEventListener('timeupdate', elapsedTimeUpdate);
  media.addEventListener('timeupdate', setProgressbar, false);

  play.setAttribute('data-icon','u');

  // Hide the select file/drag file pannel
  dragFileBackground.style.setProperty("z-index", "0");

  media.play();
}


fileInput.addEventListener('change', playSelectedFile);





// -------------------- 『 Volume slide bar 』 --------------------


// window.setInterval(changeVolume(), 1);

// volume.addEventListener("onchange", changeVolume, true);

media.addEventListener('timeupdate', changeVolume, true);

function changeVolume() {

 var x = volumeSlider.value;
 var y = x / 100;

 video.volume = y;

}

// }); // 全剧终