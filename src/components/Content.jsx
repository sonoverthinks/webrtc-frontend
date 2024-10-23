import { useContext } from "react";
import Video from "./Video";
import { SocketContext } from "../SocketContext";

const Content = () => {
  const { myVideo, callAccepted, callEnded, call, userVideo } =
    useContext(SocketContext);
  return (
    <div className="grid flex-1 gap-4 p-4 lg:grid-cols-2">
      {/* Video Windows */}
      <Video user="you" video={myVideo} />
      {callAccepted && !callEnded && (
        <Video video={userVideo} user={call.name} />
      )}
    </div>
  );
};

export default Content;
