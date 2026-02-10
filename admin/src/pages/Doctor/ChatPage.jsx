import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../socket";
import axios from "axios";
import { Send, User, Clock } from "lucide-react";

const ChatPage = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingStatus, setTypingStatus] = useState(null);

  const scrollAreaRef = useRef(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);


  useEffect(() => {
    if (!appointmentId) return;

    const fetchMsg = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/chat/${appointmentId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Fetch messages error", err);
      }

    };

    fetchMsg();
    // socket setup 
    if (!socket.connected) socket.connect();
    socket.emit("join-room", { appointmentId });

    // We emit this immediately so existing unread messages get marked
    socket.emit("mark-seen", { appointmentId });

    const handleTypingStatus = ({ role, typing }) => {
      setTypingStatus(typing ? role : null);
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);

      // If the message is NOT from me, I have now seen it.
      if (msg.senderRole !== socket.user?.role) {
        socket.emit("mark-seen", { appointmentId });
      }
    };

    const handleMessagesSeen = ({ seenBy }) => {
      setMessages((prev) =>
        prev.map((m) => {

          //if Doctor saw it, update User's messages to seen
          if (m.senderRole !== seenBy) {
            return { ...m, seen: true };
          }
          return m;
        })
      );
    };

    socket.on("typing-status", handleTypingStatus);
    socket.on("new-message", handleNewMessage);
    socket.on("messages-seen", handleMessagesSeen);

    return () => {
      socket.off("typing-status", handleTypingStatus);
      socket.off("new-message", handleNewMessage);
      socket.off("messages-seen", handleMessagesSeen);
    };
  }, [appointmentId]);

  //  send message
  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send-message", { appointmentId, text });
    setText("");
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col items-center pt-20 overflow-hidden">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col bg-white shadow-xl rounded-2xl border overflow-hidden mx-4">

        {/* HEADER */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <User size={22} />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              Patient Consultation
            </h2>
          </div>
          <span className="hidden md:block text-xs px-3 py-1 bg-gray-100 rounded-full">
            ID: {appointmentId}
          </span>
        </div>

        {/* CHAT BODY */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F9FAFB] space-y-6"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <Clock size={40} className="mb-2" />
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const isDoctor = m.senderRole === "doctor";
              return (
                <div
                  key={i}
                  className={`flex ${isDoctor ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${isDoctor
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border text-gray-800 rounded-bl-none"
                        }`}
                    >
                      {m.text}
                    </div>
                    <p
                      className={`text-xs mt-1 opacity-60 ${isDoctor ? "text-left" : "text-right"
                        }`}
                    >
                     
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                      {m.senderRole !== "user" && (
                        <span
                          className={`ml-2 text-sm ${m.seen ? "text-green-600 font-bold" : "text-gray-400"
                            }`}
                        >
                          {m.seen ? "✓✓" : "✓"}
                        </span>
                      )}

                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t bg-white">
          {typingStatus && (
            <p className="text-sm text-green-600 font-bold px-4 pb-1">
              {
                typingStatus === 'doctor'
                  ? "doctor is typing"
                  : "User is typing"
              }
            </p>
          )}
          <div className="flex items-center gap-3 bg-gray-50 border rounded-2xl px-4 py-2">
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                socket.emit("typing-start", { appointmentId });

                if (e.target.value === "") {
                  socket.emit("typing-stop", { appointmentId });
                }

              }}

              onBlur={() => {
                socket.emit("typing-stop", { appointmentId });
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent outline-none text-gray-700"
              placeholder="Write your message..."
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
