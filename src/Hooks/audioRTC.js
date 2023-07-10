import { useEffect, useState, useRef, useCallback } from "react";
import { ACTIONS } from "../actions";
import socketInit from "../socket";
import freeice from "freeice";
import { useStateWithCallback } from "./useStateWithCallback";
import { addUser, removeUser } from "../http";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]); //mongo id
  const [messages, setMessages] = useState([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const clientsRef = useRef([]);

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      console.log("clients", clients, lookingFor);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // Handle new peer as soon as clients list is updated

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // If already connected then prevent connecting again
      if (peerId in connections.current) {
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }
      console.log("adding");

      // Store it to connections
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      // Handle new ice candidate on this peer connection
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      // Handle on track event on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          // console.log('peer', audioElements.current, peerId);

          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }

              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      // Add connection to peer connections track
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      connections.current[peerId].ondatachannel = (event) => {
        console.log("connected", connections.current[peerId]);
        handleDataChannel(event.channel, connections.current[peerId]);
      };

      // Create an offer if required
      if (createOffer) {
        const dataChannelOptions = {
          ordered: false, // do not guarantee order
          maxPacketLifeTime: 3000, // in milliseconds
        };
        // Create a data channel for text messaging
        connections.current[peerId].dataChannel = connections.current[
          peerId
        ].createDataChannel("chat", dataChannelOptions);
        connections.current[peerId].ondatachannel = (event) => {
          console.log("receiverd", event);
        };
        console.log("channel", connections.current[peerId].dataChannel);
        handleDataChannel(
          connections.current[peerId].dataChannel,
          connections.current[peerId]
        );

        // Set up event handlers for the data channel

        const offer = await connections.current[peerId].createOffer();

        // Set as local description
        await connections.current[peerId].setLocalDescription(offer);

        // send offer to the server
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      } else {
      }
    };

    // Listen for add peer event from ws
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, [clients]);

  useEffect(() => {
    const startCapture = async () => {
      // Start capturing local audio stream.

      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    startCapture().then(() => {
      // add user to clients list
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        console.log("localElement", localElement);
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      // Emit the action to join
      socket.current.emit(ACTIONS.JOIN, {
        roomId,
        user,
      });
    });
    addUser({ roomId, userId: user.id });

    // Leaving the room
    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      console.log("leaving", user.id);
      removeUser({ roomId, userId: user.id });
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  // Handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      // console.log('ices', connections.current[peerId]);
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // Handle session description

  useEffect(() => {
    const setRemoteMedia = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      // If session descrition is offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];

        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("unload", function () {
      alert("leaving");
      removeUser({ roomId, userId: user.id });
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    });
  }, []);

  useEffect(() => {
    const handleRemovePeer = async ({ peerID, userId }) => {
      console.log("leaving", peerID, userId);

      if (connections.current[peerID]) {
        connections.current[peerID].close();
      }

      delete connections.current[peerID];
      delete audioElements.current[peerID];

      setClients((list) => list.filter((c) => c.id !== userId));
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  useEffect(() => {
    // handle mute and unmute
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      console.log("muting", userId);
      setMute(true, userId);
    });

    socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
      console.log("unmuting", userId);
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);

      console.log("idx", clientIdx);

      // const connectedClients = clientsRef.current.filter(
      //     (client) => client.id !== userId
      // );

      const connectedClientsClone = JSON.parse(
        JSON.stringify(clientsRef.current)
      );
      console.log(connectedClientsClone);

      if (clientIdx > -1) {
        connectedClientsClone[clientIdx].muted = mute;
        console.log("muuuu", connectedClientsClone);
        setClients((_) => connectedClientsClone);
      }
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  const handleMute = (isMute, userId) => {
    console.log("Mute", isMute, userId);
    let settled = false;

    if (userId === user.id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          if (isMute) {
            console.log("socket");
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId: user.id,
            });
          } else {
            socket.current.emit(ACTIONS.UNMUTE, {
              roomId,
              userId: user.id,
            });
          }
          console.log(
            "localMediaStream ",
            localMediaStream.current.getTracks()
          );
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
        console.log("repeat");
      }, 200);
    }
  };
  // Add a new message to the chat
  const addMessage = useCallback(
    (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    },
    [setMessages]
  );

  function handleDataChannel(textChannel, connection) {
    connection.dataChannel = textChannel;
    textChannel.onopen = handleDataChannelOpen;
    textChannel.onmessage = (event) => handleDataChannelMessage(event);
  }

  // Handle opening of the data channel
  const handleDataChannelOpen = (event) => {
    console.log("Data channel is open");
  };

  // Handle incoming message from data channel
  const handleDataChannelMessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("message", message);
    addMessage(message);
  };

  // Send a message to all connected peers
  const sendMessage = async (message) => {
    console.log(message);
    const data = JSON.stringify(message);
    for (const connection of Object.values(connections.current)) {
      // await
      if (
        connection.dataChannel &&
        connection.dataChannel.readyState === "open"
      ) {
        console.log("sending");
        await connection.dataChannel.send(data);
      }
    }
    addMessage(message);
  };

  return {
    clients,
    provideRef,
    handleMute,
    localStream: localMediaStream.current,
    sendMessage,
    messages,
  };
};
