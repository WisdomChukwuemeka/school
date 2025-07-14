import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export const VideoRoom = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, roomId });
      }
    };

    pcRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    socket.on('offer', async (sdp) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit('answer', { sdp: answer, roomId });
    });

    socket.on('answer', async (sdp) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const joinRoom = () => {
    if (roomId.trim() !== '') {
      socket.emit('join', roomId);
      setJoined(true);
    }
  };

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStream;
    localStreamRef.current = localStream;

    localStream.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, localStream);
    });

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit('offer', { sdp: offer, roomId });

    setCallStarted(true);
  };

  const endCall = () => {
    pcRef.current.close();
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    setCallStarted(false);
    setJoined(false);
    setRoomId('');
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Room Video Chat</h1>

      {!joined && (
        <div className="mb-4 space-x-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border px-2 py-1"
          />
          <button
            onClick={joinRoom}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      )}

      {joined && !callStarted && (
        <button
          onClick={startCall}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Start Call
        </button>
      )}

      {callStarted && (
        <button
          onClick={endCall}
          className="bg-red-600 text-white px-4 py-2 rounded mb-4"
        >
          End Call
        </button>
      )}

      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 border" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border" />
      </div>
    </div>
  );
}
