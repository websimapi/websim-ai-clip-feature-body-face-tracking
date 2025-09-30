import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate, staticFile } from "remotion";
const Scene3D = ({ trackingData }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!trackingData || trackingData.length === 0) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center", backgroundColor: "#111" }, children: /* @__PURE__ */ jsxDEV("h1", { style: { color: "white" }, children: "No Tracking Data" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 10,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 16
    });
  }
  const dataIndex = Math.min(Math.floor(frame), trackingData.length - 1);
  const dataPoint = trackingData[dataIndex] || trackingData[trackingData.length - 1];
  const { rotation, position } = dataPoint;
  const translateX = interpolate(position.x, [-10, 10], [-10, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateY = interpolate(position.y, [-5, 5], [-5, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: {
    backgroundColor: bgColor,
    justifyContent: "center",
    alignItems: "center",
    // Establish 3D perspective for rotation effects
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
      "Generated Clip",
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "1rem", marginTop: "5px" }, children: [
        "Frame ",
        frame,
        " | Yaw: ",
        rotation.yaw.toFixed(1),
        "\xB0"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 67,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 58,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      width: "60%",
      maxWidth: "300px",
      aspectRatio: "1",
      transformStyle: "preserve-3d",
      transform
      // We rely on Remotion frame update, so no CSS transition is necessary here
    }, children: /* @__PURE__ */ jsxDEV(
      Img,
      {
        src: staticFile("avatar_head.png"),
        style: {
          width: "100%",
          height: "100%",
          objectFit: "contain",
          // Small adjustment to lift the head slightly off the bottom center
          transform: "translateY(-10%)"
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 81,
        columnNumber: 17
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 73,
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
      lineNumber: 94,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 49,
    columnNumber: 9
  });
};
const MyComposition = ({ trackingData }) => {
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV(Scene3D, { trackingData }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 113,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 112,
    columnNumber: 9
  });
};
export {
  MyComposition
};
