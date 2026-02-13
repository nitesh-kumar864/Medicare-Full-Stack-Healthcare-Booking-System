import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Send,
  Clock,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from "lucide-react";

// Helper to format dates
const getMessageDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm w-fit mb-4 ml-4">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const handleComingSoon = () => {
  toast.info("Coming Soon");
};


const ChatPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingStatus, setTypingStatus] = useState(null);
  const scrollRef = useRef(null);

  const [doctor, setDoctor] = useState(null);
  const [showActions, setShowActions] = useState(false);



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
          setDoctor(res.data.doctor);
        }

      } catch (err) { console.error("Fetch messages error", err); }
    };
    fetchMsg();

    if (!socket.connected) socket.connect();
    socket.emit("join-room", { appointmentId });
    socket.emit("mark-seen", { appointmentId });

    const handleTypingStatus = ({ role, typing }) => setTypingStatus(typing ? role : null);

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.senderRole !== socket.user?.role) {
        socket.emit("mark-seen", { appointmentId });
      }
    };

    const handleMessagesSeen = ({ seenBy }) => {
      setMessages((prev) => prev.map((m) => {
        if (m.senderRole !== seenBy) {
          return { ...m, seen: true }
        };
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, typingStatus]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send-message", { appointmentId, text });
    socket.emit("typing-stop", { appointmentId });
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      socket.emit("typing-start", { appointmentId });
    } else {
      socket.emit("typing-stop", { appointmentId });
    }
  };

  let lastDate = null;

  return (
    <div className="fixed inset-0 top-16 bg-gray-100 flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-md md:max-w-3xl h-full bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* --- HEADER --- */}
        <div className="h-16 px-4 bg-white border-b flex items-center justify-between shadow-sm shrink-0">

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-600"
            >
              <ArrowLeft size={22} />
            </button>

            {doctor?.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-12 h-12 rounded-full object-cover shadow-md  bg-primary"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                {doctor?.name?.charAt(0) || "D"}
              </div>
            )}

            <div className="flex flex-col">
              <h2 className="font-semibold text-gray-800 leading-tight">
                {doctor?.name || "Loading..."}
              </h2>

              <span className="text-xs text-gray-500">
                {doctor?.speciality}
              </span>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4 text-blue-600">
            <button 
            onClick={handleComingSoon} 
            className="hover:bg-blue-50 p-2 rounded-full">
              <Phone size={20} />
            </button>

            <button 
            onClick={handleComingSoon} 
            className="hover:bg-blue-50 p-2 rounded-full">
              <Video size={20} />
            </button>

            <button 
            onClick={handleComingSoon} 
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setShowActions(!showActions)}
              className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
            >
              <MoreVertical size={22} />
            </button>
          </div>
        </div>

        {showActions && (
          <div className="md:hidden bg-white border-b shadow-sm flex justify-around py-2 animate-slide-down">
            <button
              onClick={handleComingSoon}
              className="flex flex-col items-center text-blue-600 text-xs"
            >
              <Phone size={22} />
              Call
            </button>

            <button
              onClick={handleComingSoon}
              className="flex flex-col items-center text-blue-600 text-xs"
            >
              <Video size={22} />
              Video
            </button>
          </div>
        )}

        {/* --- CHAT BODY --- */}
        <div className="flex-1 overflow-y-auto bg-[#e5ddd5] relative">
          <div className="p-4 flex flex-col space-y-2 relative z-0 pb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50 text-gray-500 mt-20">
                <Clock size={64}
                  className="mb-4 text-gray-400" />
                <p className="text-lg font-medium">You’re now connected. Start your consultation.</p>
                <p className="text-sm">Say hello to your doctor.</p>
              </div>
            ) : (
              messages.map((m, i) => {
                const isDoctor = m.senderRole === "doctor";
                const isMe = !isDoctor;
                const msgDate = getMessageDate(m.createdAt);
                const showDate = lastDate !== msgDate;
                lastDate = msgDate;

                return (
                  <React.Fragment key={i}>
                    {showDate && (
                      <div className="flex justify-center my-4 sticky top-2 z-10">
                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm opacity-90">
                          {msgDate}
                        </span>
                      </div>
                    )}
                    <div className={`flex w-full ${isMe
                      ? "justify-end"
                      : "justify-start"}`}>
                      <div className={`relative max-w-[80%] md:max-w-[65%] px-4 py-2 rounded-xl shadow-sm text-[15px] leading-relaxed 
                        ${isMe
                          ? "bg-[#dcf8c6] text-gray-900 rounded-tr-none"
                          : "bg-white text-gray-900 rounded-tl-none"
                        }`
                      }>
                        <p className="break-words mb-1">{m.text}</p>
                        <div className={`flex items-center justify-end gap-1 text-[10px] ${isMe
                          ? "text-gray-500"
                          : "text-gray-400"
                          }`}>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {isMe && (
                            <span>{m.seen
                              ? <CheckCheck size={14}
                                className="text-blue-500" />
                              : <Check size={14}
                                className="text-gray-400" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}

            {typingStatus === 'doctor' && (
              <div className="flex w-full justify-start animate-fade-in"><TypingIndicator /></div>
            )}

            {/* Scroll Anchor */}
            <div ref={scrollRef} className="h-1" />
          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="bg-gray-100 px-4 py-3 border-t flex items-center gap-2 shrink-0">
          <button
            onClick={handleComingSoon}
            className="text-gray-500 hover:text-gray-700 p-2 transition">
            <Smile size={24} />
          </button>

          <button
            onClick={handleComingSoon}
            className="text-gray-500 hover:text-gray-700 p-2 transition hidden md:block">
            <Paperclip size={22} />
          </button>
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={handleTyping}
              onBlur={() => socket.emit("typing-stop", { appointmentId })}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full py-3 px-5 bg-white rounded-full border-none focus:ring-1 focus:ring-blue-500 outline-none text-gray-700 shadow-sm placeholder-gray-400"
              placeholder="Type a message..."
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className={`p-3 rounded-full shadow-md transition-all duration-200 
          ${text.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700 scale-100"
                : "bg-gray-300 text-gray-500 scale-95 cursor-not-allowed"}`}>
            <Send size={20}
              className={text.trim()
                ? "ml-0.5" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;