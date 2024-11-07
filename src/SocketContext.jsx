import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer/simplepeer.min.js";

const SocketContext = createContext();

const socket = io("https://webrtc-backend-5rhc.onrender.com");
// const socket = io("https://warm-wildwood-81069.herokuapp.com");

// eslint-disable-next-line react/prop-types
const SocketContextProvider = ({ children }) => {
  const [me, setMe] = useState(""); // socketID
  const [isInGroupChat, setIsInGroupChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("me", (id) => setMe(id));
    //
    // socket.emit("user:join", { username: "username" });

    socket.on("users:list", (usersList) => {
      setOnlineUsers(usersList);
    });

    socket.on("user:joined", (user) => {
      console.log(`${user.username} joined the chat`);
    });

    socket.on("user:left", (user) => {
      console.log(`${user.username} left the chat`);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users:list");
      socket.off("user:joined");
      socket.off("user:left");
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    console.log("🚀 ~ answerCall ~ peer:", peer);
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const joinActiveListAs = (name) => {
    socket.emit("user:join", { username: name });
    setIsInGroupChat(true);
  };
  const leaveActiveList = (me) => {
    socket.emit("user:leaveActiveList", { socketId: me });
    setIsInGroupChat(false);
  };

  const testCall = () => {
    socket.emit("user:disconnect", { socketId: me });
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    // window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        onlineUsers,
        callUser,
        leaveCall,
        answerCall,
        joinActiveListAs,
        testCall,
        isInGroupChat,
        leaveActiveList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
