import React, { useEffect, useRef, useState } from "react";
import { CodemirrorBinding } from "y-codemirror";
import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import RandomColor from "randomcolor";
import "codemirror/mode/python/python"; // Import Python mode
import "codemirror/theme/material.css";
import "./EditorAddons";

const Editor = ({ roomId, user, runPython, code, setCode }) => {
  console.log(process.env.REACT_APP_SIGNALLING_URL);
  const [EditorRef, setEditorRef] = useState(null);

  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

  useEffect(() => {
    if (EditorRef) {
      const ydoc = new Y.Doc();

      let provider = null;
      try {
        const signalingUrl = [
          // `wss://${"signalling-ym5d.onrender.com"}`,
          // "wss://y-webrtc-ckynwnzncc.now.sh",
          // "wss://signaling.yjs.dev",
          // "wss://y-webrtc-signaling-eu.herokuapp.com",
          // "wss://y-webrtc-signaling-us.herokuapp.com",
        ];
        provider = new WebrtcProvider(roomId, ydoc, {
          signaling: [
            // `wss://${"signalling-ym5d.onrender.com"}`,
            // `ws://${window.location.hostname}:4444`,
            `wss://${process.env.REACT_APP_SIGNALLING_URL}`,
            // "wss://y-webrtc-ckynwnzncc.now.sh",
            // "wss://signaling.yjs.dev",
            // "wss://y-webrtc-signaling-eu.herokuapp.com",
            // "wss://y-webrtc-signaling-us.herokuapp.com",
          ],
          peerOpts: {
            // specify the peer options here
            // Example:
            config: {
              iceServers: [
                {
                  url: "stun:stun.relay.metered.ca:80",
                },
                {
                  url: "turn:a.relay.metered.ca:80",
                  username: "2bc2d9750f7946f545753ccd",
                  credential: "naeXsKmLVO9jcmlX",
                },
                {
                  url: "turn:a.relay.metered.ca:80?transport=tcp",
                  username: "2bc2d9750f7946f545753ccd",
                  credential: "naeXsKmLVO9jcmlX",
                },
                {
                  url: "turn:a.relay.metered.ca:443",
                  username: "2bc2d9750f7946f545753ccd",
                  credential: "naeXsKmLVO9jcmlX",
                },
                {
                  url: "turn:a.relay.metered.ca:443?transport=tcp",
                  username: "2bc2d9750f7946f545753ccd",
                  credential: "naeXsKmLVO9jcmlX",
                },
              ],
            },
          },
        });

        const yText = ydoc.getText("codemirror");
        const yUndoManager = new Y.UndoManager(yText);
        const awareness = provider.awareness;
        const color = RandomColor();

        awareness.setLocalStateField("user", {
          name: user.name,
          color: color,
        });

        const getBinding = new CodemirrorBinding(yText, EditorRef, awareness, {
          yUndoManager,
        });
      } catch (err) {
        console.log(err);
        alert(
          "Error in collaborating. Please try refreshing or come back later!"
        );
      }

      return () => {
        if (provider) {
          provider.disconnect();
          ydoc.destroy();
        }
      };
    }
  }, [EditorRef]);

  return (
    <div
      style={{
        display: "flex",
        height: "70vh",
        width: "100%",
        fontSize: "20px",
        overflowY: "scroll",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="body"
        style={{
          flex: 1,
          overflow: "scroll",
          height: "100%",
        }}
      >
        <CodeMirrorEditor
          value={code}
          onChange={(editor, data, value) => {
            setCode(value);
          }}
          autoScroll
          options={{
            mode: "python", // Set the mode to "python"
            theme: "material", // Set the desired theme
            lineWrapping: true,
            style: {},
            smartIndent: true,
            lineNumbers: true,
            foldGutter: true,
            tabSize: 4,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            autoCloseTags: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            extraKeys: {
              "Ctrl-Space": "autocomplete",
            },
          }}
          editorDidMount={(editor) => {
            handleEditorDidMount(editor);
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
