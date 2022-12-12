let message = document.getElementById("recordedAudio")

let warningMessage = document.getElementsByClassName('warning')[0]

let mouth = document.getElementById("mouth")

let audioCtx;
let source;

function mouthAnimation(){
    document.documentElement.setAttribute('data-theme', 'normal')
    mouth.style.animation = null
}

function playSound(file, speed=1, pitchShift=1, loop=false, autoplay=true) {

    if(pitchShift) {

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createBufferSource();
        request = new XMLHttpRequest();

        request.open('GET', file, true);

        request.responseType = 'arraybuffer';


        request.onload = function() {
            var audioData = request.response;

        audioCtx.decodeAudioData(audioData, function(buffer) {
            myBuffer = buffer;
            songLength = buffer.duration;
            source.buffer = myBuffer;
            source.playbackRate.value = speed;
            source.connect(audioCtx.destination);
            source.loop = loop;

            mouth.style.animation = 'mouth 0.6s infinite'
            setTimeout(mouthAnimation, (buffer.duration / speed)* 1000);
        },

        function(e){"Error with decoding audio data" + e.error});

        }

        request.send();
        source.play=source.start
    } else {
        source=new Audio(file)
        source.playbackRate=speed
        source.loop=loop
    }
    if(autoplay) {
        source.play()
    }
    return source
}

navigator.mediaDevices.getUserMedia({audio:true})
.then(stream => {handlerFunction(stream)})

function handlerFunction(stream) {
  try{
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
      audioChunks.push(e.data);
      if (rec.state == "inactive"){
        let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
        recordedAudio.src = URL.createObjectURL(blob);
        recordedAudio.controls=false;
        source=playSound(message.src, pitch=1.5);
      }
    }
  }
  catch(err){
    warningMessage.style.display = 'flex'
  }
}

record.onclick = e => {
  record.disabled = true;
  record.style.backgroundColor = "#fe8801"
  stopRecord.disabled=false;
  audioChunks = [];
  rec.start();
}

stopRecord.onclick = e => {
  record.disabled = false;
  stop.disabled=true;
  record.style.backgroundColor = "red"
  rec.stop();
}

function playMessage() {
    source=playSound(message.src, pitch=1.5);
}
function playDemonMessage() {
    document.documentElement.setAttribute('data-theme', 'demon')
    source=playSound(message.src, pitch=0.7);
}