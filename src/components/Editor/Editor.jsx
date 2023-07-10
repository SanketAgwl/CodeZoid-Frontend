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
  const [EditorRef, setEditorRef] = useState(null);

  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

  useEffect(() => {
    if (EditorRef) {
      const ydoc = new Y.Doc();

      let provider = null;
      try {
        const signalingUrl = `ws://${window.location.hostname}:4444`;
        provider = new WebrtcProvider(roomId, ydoc, {
          signaling: [signalingUrl],
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
