const userVideo = document.getElementById('user-video');
const startButton = document.getElementById('start-btn');
const toggleAudioButton = document.getElementById('toggle-audio-btn');
const toggleVideoButton = document.getElementById('toggle-video-btn');
const endButton = document.getElementById('end-btn');
const state = { media: null, isAudioEnabled: true, isVideoEnabled: true };
const socket = io();
let mediaRecorder;

startButton.addEventListener('click', () => {
    alert("Streaming Started ! ")
    mediaRecorder = new MediaRecorder(state.media, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        framerate: 25
        // Kamjor CPU :)
    });

    mediaRecorder.ondataavailable = ev => {
        console.log('Binary stream available', ev.data);
        socket.emit('binarystream', ev.data);
    };

    mediaRecorder.start(25);
});

toggleAudioButton.addEventListener('click', () => {
    state.isAudioEnabled = !state.isAudioEnabled;
    state.media.getAudioTracks()[0].enabled = state.isAudioEnabled;
    toggleAudioButton.textContent = state.isAudioEnabled ? 'Disable Audio' : 'Enable Audio';
});

toggleVideoButton.addEventListener('click', () => {
    state.isVideoEnabled = !state.isVideoEnabled;
    state.media.getVideoTracks()[0].enabled = state.isVideoEnabled;
    toggleVideoButton.textContent = state.isVideoEnabled ? 'Disable Video' : 'Enable Video';
});

endButton.addEventListener('click', () => {
    alert("Stream ended, goodbye!");
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    // Turn off the camera
    state.media.getVideoTracks()[0].enabled = false;
    toggleVideoButton.textContent = 'Enable Video'; 
});

window.addEventListener('load', async e => {
    const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    state.media = media;
    userVideo.srcObject = media;
});
