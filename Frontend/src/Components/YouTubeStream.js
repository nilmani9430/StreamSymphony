import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';

const OnGoLive = ({ rtmpUrl, streamKey }) => {
    const [media, setMedia] = useState(null);
    const [audioPermission, setAudioPermission] = useState(false);
    const [videoPermission, setVideoPermission] = useState(false);
    const location = useLocation();
    const userVideoRef = useRef(null);
    const socket = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize socket connection
        // socket.current = io('http://localhost:9000'); // Update this URL to your server URL

        // Load user media on component mount
        const loadMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: audioPermission,
                    video: videoPermission
                });
                setMedia(mediaStream);
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error('Error accessing user media:', error);
            }
        };
        loadMedia();
    }, [audioPermission, videoPermission]);

    const startRecording = () => {
        if (media) {
            const options = {
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000,
                framerate: 25
            };
            const mediaRecorder = new MediaRecorder(media, options);

            mediaRecorder.ondataavailable = (event) => {
                // console.log('Binary stream available', event.data);
                // Emit binary stream data to socket.io server
                socket.current.emit('binarystream', event.data);    
            };

            mediaRecorder.start(25);

            // Redirect to localhost:9000 with rtmpUrl and streamKey
            window.location.href = `http://localhost:9000/?rtmpUrl=${encodeURIComponent(location.state.rtmpUrl)}&streamKey=${encodeURIComponent(location.state.streamKey)}`;
            // console.log("Redirected")
        }
    };

    const stopRecordingAndGoBack = () => {
        if (media) {
            media.getTracks().forEach(track => track.stop());
        }
        navigate(-1); // Go back to previous page
    };

    return (
        <div>
            <h1 id="title" className="text-5xl font-bold text-center text-purple-700">Stream Symphony</h1>
            <br />
            <div className="flex flex-col items-center">
                <video ref={userVideoRef} autoPlay muted className="rounded-lg shadow-md mb-4" />
                {!audioPermission && (
                    <button className="btn-blue mb-2" onClick={() => setAudioPermission(true)}>Allow Audio</button>
                )}
                {!videoPermission && (
                    <button className="btn-blue mb-2" onClick={() => setVideoPermission(true)}>Allow Video</button>
                )}
                {audioPermission && videoPermission && (
                    <>
                        <button className="btn-red mb-4" onClick={startRecording}>Start</button>
                        <button className="btn-red" onClick={stopRecordingAndGoBack}>Go Back</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OnGoLive;
