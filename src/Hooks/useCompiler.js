// import xwasm from "xwasm";
import { useEffect, useState } from "react";
import { usePython } from "react-py";
// import useWasm from "use-wasm";
// const Module = require("emscripten");

export function useCompiler({ input }) {
  // const [wasmModule, setWasmModule] = useState(null);
  const [output, setOutput] = useState("");
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  // const { isWasmEnabled, instance } = useWasm("");

  const compileCode = () => {
    console.log(input);
    runPython(input);
    console.log(stdout);
    console.log(stderr);
    console.log(isLoading);
    console.log(isRunning);
    // const instance = new Module.Instance(new Uint8Array(cppCode));
    // const result = instance.exports.run();
    // return result;
    // Import the xwasm module.
    // Create a new xwasm compiler.
    // const compiler = new xwasm();
    // Compile the C/C++ code to WebAssembly.
    // const wasmModule = await compiler.compile("code.cpp");
    // Load the WebAssembly module.
    // const instance = await WebAssembly.instantiate(wasmModule);
    // console.log(instance);
    // Call the C++ functions.
    // const { _main } = instance.exports;
    // console.log(_main);
    // _main();
    // // Compile c++ code to webAssembly using emscripten
    // const wasmModule = await emscripten.compile(cppCode, {
    //   output: "output.wasm",
    // });
    // console.log("compiled");
    // // Set the wasmModule in state.
    // setWasmModule(wasmModule);
  };

  const loadWebAssemblyModule = async () => {
    // // Load the WebAssembly module.
    // const instance = await WebAssembly.instantiate(wasmModule);
    // // Call the C++ functions.
    // const { _main } = instance.exports;
    // _main();
    // // Set the output in state.
    // setOutput(output + "Execution complete.");
  };

  useEffect(() => {
    console.log(stdout);
  }, [isRunning]);

  useEffect(() => {
    const compileAndLoad = () => {
      compileCode();
      // await loadWebAssemblyModule();
    };

    compileAndLoad();
  }, [input]);

  return output;
}
