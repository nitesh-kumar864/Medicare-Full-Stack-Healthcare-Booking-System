import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { Send, Clock } from "lucide-react";

const ChatPage = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const scrollRef = useRef(null);

  const fetchMessages = async () => {
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

  useEffect(() => {
    if (!appointmentId) return;
    if (!socket.connected) socket.connect();

    socket.emit("join-room", { appointmentId });
    fetchMessages();

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [appointmentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send-message", { appointmentId, text });
    setText("");
  };

  return (
    <div className="pt-24 h-screen bg-gray-50 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-4xl h-full flex flex-col bg-white shadow-2xl border-x overflow-hidden mb-4">

        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              D
            </div>
            <h2 className="font-bold text-gray-800">
              Medical Consultation
            </h2>
          </div>
        </div>

        {/* CHAT BODY */}
        <div
          ref={scrollRef}
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
                    isDoctor ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="max-w-[85%] md:max-w-[70%]">
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                        isDoctor
                          ? "bg-white text-gray-800 border rounded-bl-none"
                          : "bg-blue-600 text-white rounded-br-none"
                      }`}
                    >
                      {m.text}
                    </div>
                    <p
                      className={`text-[10px] mt-1 opacity-60 ${
                        isDoctor ? "text-left" : "text-right"
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

        {/* INPUT*/}
        <div className="p-4 bg-white border-t flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent outline-none text-gray-700"
              placeholder="Write your message..."
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
