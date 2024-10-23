import { useContext } from "react";
import { SocketContext } from "../SocketContext";

const Control = () => {
  const { answerCall, call, callAccepted, callEnded, leaveCall } =
    useContext(SocketContext);
  return (
    <div className="flex items-center justify-center p-10 border-t bg-slate-100">
      {/* <p>this is control</p> */}
      {call.isReceivingCall && !callAccepted && (
        <div className="flex items-center justify-around p-4 space-x-4 bg-blue-50/80 rounded-lg animate-[pulse_3s_ease-in-out_infinite]">
          <h1 className="text-lg font-medium">
            <span className="text-blue-600">{call.name}</span> is calling
          </h1>
          <button
            onClick={answerCall}
            className="px-4 py-2 text-white transition-all duration-300 bg-blue-500 rounded-md hover:bg-blue-600 hover:shadow-md hover:scale-102"
          >
            Answer
          </button>
        </div>
      )}
      {callAccepted && !callEnded && (
        <button
          onClick={leaveCall}
          className="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
        >
          HANG UP
        </button>
      )}
    </div>
  );
};

export default Control;
