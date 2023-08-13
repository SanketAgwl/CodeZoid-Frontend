import React, { useState, useEffect, useRef } from "react";
import { useWebRTC } from "../../Hooks/audioRTC";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Room.module.css";
import ChatBox from "../../components/ChatBox/ChatBox";
import ClientBox from "../../components/ClientBox/ClientBox";
import CodeRunBox from "../../components/CodeRunBox/CodeRunBox";
import Editor from "../../components/Editor/Editor";
import { getRoom } from "../../http";
import { usePython } from "react-py";
import muteSound from "../..//audio/mute.mp3";
import unmuteSound from "../../audio/unmute.mp3";
import { PythonProvider } from "react-py";
import { useNavigate } from "react-router-dom";

const ServiceMap = {
  coderunner: CodeRunBox,
  client: ClientBox,
  chat: ChatBox,
};

const Room = () => {
  const navigate = useNavigate();
  const muteAudioRef = useRef(null);
  const unmuteAudioRef = useRef(null);
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();
  // isLoading = true;
  const [serviceState, setServiceState] = useState("coderunner");
  const Service = ServiceMap[serviceState];
  const { id: roomId } = useParams();
  const [room, setRoom] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [isMuted, setMuted] = useState(true);
  const {
    clients,
    provideRef,
    handleMute,
    localStream,
    messages,
    sendMessage,
  } = useWebRTC(roomId, user);
  const [code, setCode] = useState(
    "#Your python code here. Happy Collaborating!"
  );

  console.log(user);

  const runCode = async () => {
    console.log(code);
    runPython(code);
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    handleMute(isMuted, user.id);
  }, [isMuted]);

  const handleMuteClick = (clientId) => {
    if (clientId !== user.id) return;
    setMuted((prev) => !prev);
    playFeedbackSound();
    console.log(isMuted);
  };

  const playFeedbackSound = () => {
    if (isMuted) {
      unmuteAudioRef.current.play();
    } else {
      muteAudioRef.current.play();
    }
  };
  return (
    <PythonProvider>
      <div className={styles.roomStyle}>
        <div className="container">
          <div className={styles.roomHeader}>
            <div className={styles.left}>
              <span className={styles.heading}>{room?.topic}</span>
              {/* <div className={styles.searchBox}>
            <img src="./images/search.png" alt="search" />
            <input type="text" className={styles.searchInput} />
          </div> */}
            </div>
            <div className={styles.right}>
              <div className={styles.serviceAccess}>
                <button
                  className={`styles.serviceAccessBackground ${
                    serviceState === "coderunner" && styles.active
                  }`}
                  onClick={() => {
                    setServiceState("coderunner");
                  }}
                >
                  <img src="/images/code.png" alt="" />
                </button>
                <button
                  className={`styles.serviceAccessBackground ${
                    serviceState === "chat" && styles.active
                  }`}
                  onClick={() => setServiceState("chat")}
                >
                  <img src="/images/speech.png" alt="" />
                </button>
                <button
                  className={`styles.serviceAccessBackground ${
                    serviceState === "client" && styles.active
                  }`}
                  onClick={() => setServiceState("client")}
                >
                  <img src="/images/person.png" alt="" />
                </button>
              </div>
              <div className={styles.separator} />
              <div className={styles.controls}>
                <button
                  className={`styles.micWrap ${
                    serviceState === "client" && styles.active
                  }`}
                  onClick={() => handleMuteClick(user.id)}
                >
                  {isMuted ? (
                    <img
                      className={styles.mic}
                      src="/images/mainmicoff.png"
                      alt="mic"
                    />
                  ) : (
                    <img
                      className={styles.micImg}
                      src="/images/mainmicon.png"
                      alt="mic"
                    />
                  )}
                </button>
                <div className={styles.leave} onClick={() => navigate(-1)}>
                  <img src="/images/leave.png" alt="leave" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.clientsWrap}>
          <div className={styles.clientLeft}>
            <Editor
              user={user}
              roomId={roomId}
              runPython={runPython}
              setCode={setCode}
            />
          </div>
          {serviceState !== "" && (
            <div className={styles.clientRight}>
              <Service
                clients={clients}
                provideRef={provideRef}
                handleMuteClick={handleMuteClick}
                user={user}
                stdout={stdout}
                stderr={stderr}
                isLoading={isLoading}
                isRunning={isRunning}
                code={code}
                runCode={runCode}
                messages={messages}
                sendMessage={sendMessage}
              />
              <button
                className={styles.closeButton}
                onClick={() => setServiceState("")}
              >
                <img src="/images/close.png" alt="close" />
              </button>
            </div>
          )}
        </div>
        <audio ref={muteAudioRef} src={muteSound} />
        <audio ref={unmuteAudioRef} src={unmuteSound} />
      </div>
    </PythonProvider>
  );
};

export default Room;
