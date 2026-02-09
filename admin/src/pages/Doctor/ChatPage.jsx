import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../socket";
import { Send, User, Clock } from "lucide-react";

const ChatPage = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!appointmentId) return;
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      socket.emit("join-room", { appointmentId });
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", handleConnect);
    socket.on("new-message", handleNewMessage);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-message", handleNewMessage);
    };
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send-message", { appointmentId, text });
    setText("");
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col items-center pt-20 overflow-hidden">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden mx-4">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <User size={24} />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              Patient Consultation
            </h2>
          </div>
          <span className="hidden md:block text-xs font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">
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
              <Clock size={48} className="mb-2" />
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const isDoctor = m.senderRole === "doctor";
              return (
                <div
                  key={i}
                  className={`flex ${
                    isDoctor ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[85%] md:max-w-[70%]">
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                        isDoctor
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                    <p
                      className={`text-[10px] mt-1 opacity-60 ${
                        isDoctor ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(
                        m.createdAt || Date.now()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-3 bg-gray-50 border rounded-2xl px-4 py-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent outline-none text-gray-700"
              placeholder="Write a medical advice..."
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
