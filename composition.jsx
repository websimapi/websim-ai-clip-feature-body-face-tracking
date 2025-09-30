import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
const drawSkeleton = (landmarks, connections, scaleFactor, dotColor, lineColor) => {
  const points = Object.keys(landmarks).map((key) => {
    const [x, y, z] = landmarks[key];
    const px = x * scaleFactor;
    const py = y * scaleFactor;
    const pz = z * scaleFactor;
    return { key, px, py, pz };
  });
  const pointMap = points.reduce((acc, p) => ({ ...acc, [p.key]: p }), {});
  const lineElements = connections.map(([startKey, endKey], index) => {
    const p1 = pointMap[startKey];
    const p2 = pointMap[endKey];
    if (!p1 || !p2) return null;
    return /* @__PURE__ */ jsxDEV(
      "line",
      {
        x1: p1.px,
        y1: -p1.py,
        x2: p2.px,
        y2: -p2.py,
        stroke: lineColor,
        strokeWidth: "4",
        strokeLinecap: "round"
      },
      index,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 30,
        columnNumber: 14
      }
    );
  }).filter(Boolean);
  const dotElements = points.map(({ key, px, py, pz }) => /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "absolute",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: dotColor,
        // Position relative to the center of the parent container
        left: `calc(50% + ${px}px)`,
        top: `calc(50% - ${py}px)`,
        // Flip Y
        // Translate to center the div AND apply Z depth for 3D perspective effect
        transform: `translate(-50%, -50%) translateZ(${pz}px)`,
        zIndex: Math.round(100 + pz)
        // Simple stacking context adjustment for visualization
      }
    },
    key,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 42,
      columnNumber: 9
    }
  ));
  return { lineElements, dotElements };
};
const PoseVisualization = ({ trackingData, trackingMode, scaleFactor }) => {
  let connections;
  let dotColor;
  let lineColor;
  if (trackingMode === "body") {
    connections = [
      // Spine & Head
      ["hip", "spine_mid"],
      ["spine_mid", "shoulder_center"],
      ["shoulder_center", "head"],
      // Left Arm
      ["shoulder_center", "l_shoulder"],
      ["l_shoulder", "l_elbow"],
      ["l_elbow", "l_wrist"],
      // Right Arm
      ["shoulder_center", "r_shoulder"],
      ["r_shoulder", "r_elbow"],
      ["r_elbow", "r_wrist"],
      // Legs
      ["hip", "l_knee"],
      ["l_knee", "l_ankle"],
      ["hip", "r_knee"],
      ["r_knee", "r_ankle"]
    ];
    dotColor = "lime";
    lineColor = "lime";
  } else {
    connections = [
      ["forehead", "nose"],
      ["nose", "left_eye"],
      ["nose", "right_eye"],
      ["nose", "mouth"],
      ["left_eye", "right_eye"]
    ];
    dotColor = "yellow";
    lineColor = "yellow";
  }
  const { lineElements, dotElements } = drawSkeleton(trackingData.landmarks, connections, scaleFactor, dotColor, lineColor);
  return /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsxDEV("svg", { style: { position: "absolute", width: "100%", height: "100%", overflow: "visible" }, children: /* @__PURE__ */ jsxDEV("g", { transform: "translate(50%, 50%)", children: lineElements }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 115,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 114,
      columnNumber: 13
    }),
    dotElements
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 113,
    columnNumber: 9
  });
};
const Scene3D = ({ trackingData, trackingMode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!trackingData || trackingData.length === 0) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center", backgroundColor: "#111" }, children: /* @__PURE__ */ jsxDEV("h1", { style: { color: "white" }, children: "No Tracking Data" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 131,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 130,
      columnNumber: 16
    });
  }
  const dataIndex = Math.min(Math.floor(frame), trackingData.length - 1);
  const dataPoint = trackingData[dataIndex] || trackingData[trackingData.length - 1];
  const { rotation, position } = dataPoint;
  const VISUALIZATION_UNIT_SCALE = 6;
  const posXRange = [-15, 15];
  const posYRange = [-15, 15];
  const translateX = interpolate(position.x, [-10, 10], posXRange, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateY = interpolate(position.y, [-10, 10], posYRange, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(position.z, [50, 150], [1.2, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const transform = `
        translateX(${translateX}%) 
        translateY(${translateY}%) 
        scale(${scale}) 
        rotateX(${rotation.pitch}deg) 
        rotateY(${rotation.yaw}deg) 
        rotateZ(${rotation.roll}deg)
    `;
  const r = interpolate(frame, [0, durationInFrames], [50, 150]);
  const g = interpolate(frame, [0, durationInFrames], [50, 100]);
  const b = interpolate(frame, [0, durationInFrames], [100, 200]);
  const bgColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  const objectVerticalShiftStyle = trackingMode === "body" ? { top: "0%" } : { top: "-10%" };
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: {
    backgroundColor: bgColor,
    justifyContent: "center",
    alignItems: "center",
    perspective: "1000px",
    perspectiveOrigin: "50% 50%"
  }, children: [
    /* @__PURE__ */ jsxDEV("h1", { style: {
      position: "absolute",
      top: "5%",
      fontSize: "2rem",
      color: "white",
      textAlign: "center",
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
    }, children: [
      "Generated Clip (",
      trackingMode.toUpperCase(),
      " Tracking)",
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "1rem", marginTop: "5px" }, children: [
        "Frame ",
        frame,
        " | Yaw: ",
        rotation.yaw.toFixed(1),
        "\xB0 | Scale: ",
        scale.toFixed(2)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 195,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 186,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      // Set the container size relative to composition
      width: "70%",
      height: "70%",
      position: "relative",
      transformStyle: "preserve-3d",
      transform,
      ...objectVerticalShiftStyle,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsxDEV(
      PoseVisualization,
      {
        trackingData: dataPoint,
        trackingMode,
        scaleFactor: VISUALIZATION_UNIT_SCALE
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 213,
        columnNumber: 17
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 201,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      bottom: "10%",
      opacity: interpolate(frame, [durationInFrames - 60, durationInFrames - 30], [1, 0]),
      color: "white",
      fontSize: "3rem",
      fontWeight: "bold",
      textShadow: "3px 3px 6px rgba(0,0,0,0.8)"
    }, children: "PERFORMANCE CAPTURED" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 221,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 178,
    columnNumber: 9
  });
};
const MyComposition = ({ trackingData, trackingMode }) => {
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV(Scene3D, { trackingData, trackingMode }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 240,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 239,
    columnNumber: 9
  });
};
export {
  MyComposition
};
