import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { HelpCircle } from "lucide-react";

import SupportHeaderFilter from "../components/support/SupportHeaderFilter";
import SupportTicketList from "../components/support/SupportTicketList";

const MySupport = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedTicket, setExpandedTicket] = useState(null);

  // ---------------- FORMAT DATE ----------------
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ---------------- FETCH TICKETS ----------------
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/support/my-tickets`,
        { headers: { token } }
      );

      if (data.success) {
        setTickets(data.tickets);
        setFilteredTickets(data.tickets);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER LOGIC ----------------
  useEffect(() => {
    if (statusFilter === "pending") {
      setFilteredTickets(tickets.filter((t) => !t.adminReply));
    } else if (statusFilter === "replied") {
      setFilteredTickets(tickets.filter((t) => t.adminReply));
    } else {
      setFilteredTickets(tickets);
    }
  }, [statusFilter, tickets]);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  // ---------------- STATUS CONFIG ----------------
  const getStatusConfig = (ticket) =>
    ticket.adminReply
      ? {
          text: "Replied",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "💬",
        }
      : {
          text: "Pending",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: "⏳",
        };

  // ---------------- HELPERS ----------------
  const toggleExpand = (id) =>
    setExpandedTicket(expandedTicket === id ? null : id);

  const copyTicketId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Ticket ID copied");
  };

  // ---------------- STATS ----------------
  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => !t.adminReply).length,
    replied: tickets.filter((t) => t.adminReply).length,
  };

  // ---------------- LOADING ----------------
  if (token && loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading your support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 md:px-8 bg-gray-50 min-h-screen pb-10">
      {/* HEADER + FILTER */}
      <SupportHeaderFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stats={stats}
        fetchTickets={fetchTickets}
      />

      {/* EMPTY STATE */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tickets found
          </h3>
          <button
            onClick={() => (window.location.href = "/help-center")}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold flex items-center gap-2 mx-auto"
          >
            <HelpCircle size={20} />
            Create Support Ticket
          </button>
        </div>
      ) : (
        <SupportTicketList
          tickets={filteredTickets}
          expandedTicket={expandedTicket}
          toggleExpand={toggleExpand}
          getStatusConfig={getStatusConfig}
          formatDate={formatDate}
          copyTicketId={copyTicketId}
        />
      )}
    </div>
  );
};

export default MySupport;
