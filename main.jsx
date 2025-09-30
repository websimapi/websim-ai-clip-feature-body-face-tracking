import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { MyComposition } from "./composition.jsx";
const FPS = 30;
const DURATION_SECONDS = 5;
const DURATION_FRAMES = DURATION_SECONDS * FPS;
const generateTrackingData = (frames) => {
  const data = [];
  for (let i = 0; i < frames; i++) {
    const time = i / FPS;
    const seed = time * 100;
    const yaw = Math.sin(time * 2.5 + seed / 500) * 15;
    const pitch = Math.cos(time * 1.5 + Math.PI / 2 + seed / 800) * 8 + 5;
    const roll = Math.sin(time * 4 + seed / 300) * 3;
    const posX = Math.sin(time * 1.8 + seed / 450) * 10;
    const posY = Math.cos(time * 2.2 + seed / 700) * 5;
    const posZ = 100 + Math.sin(time * 0.5 + seed / 900) * 50;
    data.push({
      frame: i,
      rotation: { yaw, pitch, roll },
      // Degrees
      position: { x: posX, y: posY, z: posZ }
      // Relative units 
    });
  }
  return data;
};
const CameraCapture = ({ videoRef, isCapturing, onCaptureStart, onCaptureStop, onCameraToggle, isFrontCamera, trackingMode, onTrackingModeChange }) => {
  return /* @__PURE__ */ jsxDEV("div", { className: "video-capture-area", children: [
    /* @__PURE__ */ jsxDEV(
      "video",
      {
        ref: videoRef,
        autoPlay: true,
        playsInline: true,
        muted: true,
        style: { transform: isFrontCamera ? "scaleX(-1)" : "none" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 54,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "controls", style: { position: "absolute", bottom: "10px", width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }, children: [
      /* @__PURE__ */ jsxDEV("select", { value: trackingMode, onChange: (e) => onTrackingModeChange(e.target.value), disabled: isCapturing, children: [
        /* @__PURE__ */ jsxDEV("option", { value: "face", children: "Face Tracking" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("option", { value: "body", children: "Body Tracking" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 60,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 58,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("button", { onClick: onCameraToggle, disabled: isCapturing, children: [
        "Switch Camera (",
        isFrontCamera ? "Front" : "Back",
        ")"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 62,
        columnNumber: 17
      }),
      isCapturing ? /* @__PURE__ */ jsxDEV("button", { onClick: onCaptureStop, disabled: !isCapturing, children: "Stop Capture (5s)" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 66,
        columnNumber: 21
      }) : /* @__PURE__ */ jsxDEV("button", { onClick: onCaptureStart, disabled: isCapturing, children: "Start Motion Capture" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 57,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 52,
    columnNumber: 9
  });
};
const App = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [trackingMode, setTrackingMode] = useState("face");
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const setupCamera = useCallback(async (isFront) => {
    if (!navigator.mediaDevices) {
      setError("Media Devices API not supported.");
      return;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setError(null);
    try {
      const constraints = {
        video: {
          width: { ideal: 540 },
          height: { ideal: 960 },
          facingMode: isFront ? "user" : "environment"
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Cannot access camera. Ensure permissions are granted. Error: " + err.message);
    }
  }, []);
  useEffect(() => {
    setupCamera(isFrontCamera);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, [isFrontCamera, setupCamera]);
  const handleCameraToggle = () => {
    if (!isCapturing) {
      setIsFrontCamera((prev) => !prev);
    }
  };
  const handleTrackingModeChange = (mode) => {
    if (!isCapturing) {
      setTrackingMode(mode);
      setTrackingData(null);
    }
  };
  const handleCaptureStart = () => {
    if (!streamRef.current) {
      setError("Camera not active. Please check permissions and refresh.");
      return;
    }
    setTrackingData(null);
    setIsCapturing(true);
    console.log(`Starting data capture for ${DURATION_SECONDS} seconds...`);
    const simulationCallback = () => {
      const simulatedData = generateTrackingData(DURATION_FRAMES);
      setTrackingData(simulatedData);
      setIsCapturing(false);
      captureTimeoutRef.current = null;
      console.log("Data capture finished. Data points:", simulatedData.length);
    };
    captureTimeoutRef.current = setTimeout(simulationCallback, DURATION_SECONDS * 1e3);
  };
  const handleCaptureStop = () => {
    console.log("Cannot stop capture early in this simulation mode.");
  };
  const compositionWidth = 540;
  const compositionHeight = 960;
  return /* @__PURE__ */ jsxDEV("div", { id: "app-container", children: [
    /* @__PURE__ */ jsxDEV("h1", { children: [
      "AI Clip Generator (",
      trackingMode === "face" ? "Face" : "Body",
      " Tracking Demo)"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 177,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("p", { children: "Use your camera to generate deterministic motion data for the video composition." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 178,
      columnNumber: 13
    }),
    error && /* @__PURE__ */ jsxDEV("p", { style: { color: "red", fontWeight: "bold" }, children: error }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 180,
      columnNumber: 23
    }),
    /* @__PURE__ */ jsxDEV(
      CameraCapture,
      {
        videoRef,
        isCapturing,
        onCaptureStart: handleCaptureStart,
        onCaptureStop: handleCaptureStop,
        onCameraToggle: handleCameraToggle,
        isFrontCamera,
        trackingMode,
        onTrackingModeChange: handleTrackingModeChange
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 13
      }
    ),
    trackingData ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("h2", { children: "Preview Clip (5 seconds)" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 195,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "remotion-player-wrapper", children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: MyComposition,
          durationInFrames: DURATION_FRAMES,
          fps: FPS,
          compositionWidth,
          compositionHeight,
          controls: true,
          inputProps: { trackingData, trackingMode },
          autoplay: true,
          loop: true,
          style: { width: "100%", height: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 197,
          columnNumber: 25
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 196,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 194,
      columnNumber: 17
    }) : /* @__PURE__ */ jsxDEV("p", { children: isCapturing ? `Capturing ${trackingMode} motion data... Please move!` : `Perform motion capture above to generate a ${trackingMode} clip.` }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 212,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 176,
    columnNumber: 9
  });
};
createRoot(document.getElementById("app")).render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 218,
  columnNumber: 51
}));
