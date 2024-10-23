// import Call from "./svg/Call";
// import HangUp from "./svg/HangUp";
import SignOut from "./svg/Signout";
// import { fetchWithToken } from "../utils/fetchWithToken";

import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { SocketContext } from "../SocketContext";
// import copy from "copy-to-clipboard";

// eslint-disable-next-line react/prop-types
const SideNav = ({ children }) => {
  const context = useContext(AuthContext);
  const { logout } = context;
  const {
    me,
    onlineUsers,
    name,
    setName,
    callUser,
    isInGroupChat,
    joinActiveListAs,
    leaveActiveList,
    // testCall,
  } = useContext(SocketContext);
  return (
    <div className="w-[400px] border-r bg-slate-100">
      <div className="p-4 border-b">
        <div className="w-full">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 transition-colors rounded-lg bg-slate-200 hover:bg-slate-100 hover:text-red-600 group"
          >
            <span className="font-medium">Log Out</span>
            <div className="w-4 h-4 transition-colors group-hover:text-red-600">
              <SignOut />
            </div>
          </button>
        </div>
      </div>
      <div className="">
        <div className="container p-4 mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <form className="w-full" noValidate autoComplete="off">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                {/* Account Info Section */}
                <div className="space-y-4">
                  <p className="mb-2 text-base font-semibold">
                    {`Others will see you as: ${name}`}
                  </p>
                  <input
                    type="text"
                    placeholder="name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {isInGroupChat ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        leaveActiveList(me);
                        setName("");
                      }}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Leave Group Chat
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        joinActiveListAs(name);
                      }}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Join Group Chat
                    </button>
                  )}
                </div>
              </div>
            </form>
            {children}
          </div>
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="p-6 space-y-2 bg-white rounded-lg shadow-lg">
          <p className="mb-2 text-base font-semibold">Active Users:</p>
          {onlineUsers?.map((user) => {
            return (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* <div className="w-8 h-8 bg-gray-400 rounded-full" /> */}
                  <span className="text-base text-black">{user.username}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    callUser(user.id);
                  }}
                  // disabled={activeCall !== null}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Call
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
