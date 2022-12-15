import { styled } from "@mui/material";

export default function IFramePlayer() {
  return (
    <IFrameContainer>
      <iframe
        id="player"
        name="player"
        title="player"
        frameBorder="none"
      ></iframe>
    </IFrameContainer>
  );
}

const IFrameContainer = styled("div")(() => ({
  height: 0,
  position: "relative",
  paddingBottom: "calc(100vh - 50px)",
  overflow: "hidden",
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
}));
