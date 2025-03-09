import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';

function Meeting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaAllowed, setMediaAllowed] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id, navigate]);

  const startMedia = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        await videoRef.current.play();
      }

      setStream(userStream);
      setMediaAllowed(true);
      setVideoEnabled(true);
      setAudioEnabled(true);
    } catch (error) {
      console.error('Media access error:', error);
      alert('Please allow camera and microphone access.');
    }
  };

  const handleLeaveMeeting = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (screenStream) screenStream.getTracks().forEach(track => track.stop());

    if (videoRef.current) videoRef.current.srcObject = null;
    if (screenRef.current) screenRef.current.srcObject = null;

    setStream(null);
    setScreenStream(null);
    setMediaAllowed(false);
    setVideoEnabled(false);
    setAudioEnabled(false);
    setIsScreenSharing(false);
    setIsRecording(false);

    navigate('/');
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !audioEnabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !videoEnabled));
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        if (screenRef.current) {
          screenRef.current.srcObject = displayStream;
          await screenRef.current.play();
        }

        setScreenStream(displayStream);
        setIsScreenSharing(true);

        displayStream.getVideoTracks()[0].onended = stopScreenSharing;
      } else {
        stopScreenSharing();
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      alert('Screen sharing failed.');
    }
  };

  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    setIsScreenSharing(false);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        let recordStream = stream;
        if (isScreenSharing && screenStream) {
          const videoTracks = [...screenStream.getVideoTracks(), ...stream.getVideoTracks()];
          const audioTracks = stream.getAudioTracks();
          recordStream = new MediaStream([...videoTracks, ...audioTracks]);
        }

        const recorder = new MediaRecorder(recordStream, { mimeType: 'video/webm' });
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `recording-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecordedChunks(chunks);
        setIsRecording(true);
      } catch (error) {
        console.error('Recording error:', error);
        alert('Recording failed.');
      }
    } else if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Meeting Room: {id}</Typography>
        </Grid>

        {!mediaAllowed ? (
          <Grid item xs={12} sx={{ textAlign: 'center', my: 4 }}>
            <Button variant="contained" color="primary" onClick={startMedia}>
              Join with Camera and Microphone
            </Button>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: isScreenSharing ? '1fr 1fr' : '1fr', 
                gap: 2,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    minHeight: '480px',
                    maxHeight: '70vh',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    transform: 'scaleX(-1)',
                    display: 'block'
                  }}
                />
                {isScreenSharing && (
                  <video
                    ref={screenRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      minHeight: '480px',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      backgroundColor: '#1a1a1a',
                      display: 'block'
                    }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" color={audioEnabled ? "primary" : "error"} onClick={toggleAudio} startIcon={audioEnabled ? <MicIcon /> : <MicOffIcon />}>
                  {audioEnabled ? "Mute" : "Unmute"}
                </Button>

                <Button variant="contained" color={videoEnabled ? "primary" : "error"} onClick={toggleVideo} startIcon={videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}>
                  {videoEnabled ? "Stop Video" : "Start Video"}
                </Button>

                <Button variant="contained" color={isScreenSharing ? "error" : "primary"} onClick={toggleScreenShare} startIcon={isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}>
                  {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                </Button>

                <Button variant="contained" color="error" onClick={handleLeaveMeeting}>
                  Leave Meeting
                </Button>

                <Button variant="contained" color={isRecording ? "error" : "primary"} onClick={toggleRecording} startIcon={isRecording ? <StopIcon /> : <FiberManualRecordIcon />}>
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

export default Meeting;

// Remove the duplicate component code below this line
