import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { matchIntent } from "./matcher";
import { QUICK_QUESTIONS } from "./quickQuestions";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Medicare assistant. How can I help you today?", isBot: true }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle normal typed message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            const reply = matchIntent(userMsg);
            setMessages(prev => [...prev, { text: reply, isBot: true }]);
            setIsTyping(false);
        }, 700);
    };

    // Handle quick-question click
    const handleQuickQuestion = (item) => {
        setMessages(prev => [...prev, { text: item.question, isBot: false }]);
        setIsTyping(true);

        setTimeout(() => {
            const reply = item.answer || matchIntent(item.question);
            setMessages(prev => [...prev, { text: reply, isBot: true }]);
            setIsTyping(false);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700"
                >
                    <FaRobot className="text-xl" />
                </button>
            ) : (
                <div className="w-80 h-[520px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-sky-500/90 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <FaRobot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Medicare Assistant</h3>
                                <p className="text-[11px] text-blue-100">Ask anything about appointments & services</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white focus:outline-none"
                            aria-label="Close chatbot"
                        >
                            <FaTimes className="h-4 w-4" />
                        </motion.button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-3 flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`px-3 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-line ${msg.isBot
                                            ? "bg-gray-100 text-gray-800"
                                            : "bg-blue-600 text-white"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>

                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Typing...
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* QUICK QUESTIONS */}
                    <div className="px-3 py-2 border-t bg-white max-h-44 overflow-y-auto">
                        <h4 className="text-[11px] font-semibold tracking-widest text-blue-600 uppercase mb-2">
                            Quick Questions
                        </h4>

                        {Object.entries(QUICK_QUESTIONS).map(([category, items]) => (
                            <div key={category} className="mb-3">
                                <p className="text-[11px] font-medium text-gray-700 mb-1">
                                    {category.replace("_", " ")}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {items.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickQuestion(item)}
                                            className="text-[11px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition"
                                        >
                                            {item.question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask something..."
                            className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-3 rounded-full hover:bg-blue-700"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
