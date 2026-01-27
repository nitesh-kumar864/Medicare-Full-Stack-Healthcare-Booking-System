import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

import SupportQueriesUI from "../../components/support-queries/SupportQueriesUI";

const SupportQueries = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // ---------------- FETCH ALL TICKETS ----------------
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/support/admin/all`,
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        setTickets(data.tickets);
        setFilteredTickets(data.tickets);
      }
    } catch {
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER ----------------
  const filterTickets = () => {
    let filtered = tickets;

    if (statusFilter === "pending") {
      filtered = filtered.filter((t) => !t.adminReply);
    } else if (statusFilter === "replied") {
      filtered = filtered.filter(
        (t) => t.adminReply && !t.resolved
      );
    } else if (statusFilter === "resolved") {
      filtered = filtered.filter((t) => t.resolved);
    }

    setFilteredTickets(filtered);
  };

  useEffect(() => {
    if (aToken) fetchTickets();
  }, [aToken]);

  useEffect(() => {
    filterTickets();
  }, [statusFilter, tickets]);

  // ---------------- SEND REPLY ----------------
  const sendReply = async (ticketId) => {
    const reply = replyText[ticketId]?.trim();
    if (!reply) return toast.warning("Please enter a message");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/support/admin/reply`,
        { ticketId, reply },
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        toast.success("Reply sent");
        setReplyText({ ...replyText, [ticketId]: "" });
        fetchTickets();
      }
    } catch {
      toast.error("Failed to send reply");
    }
  };

  // ---------------- UI HELPERS ----------------
  const getStatusBadge = (t) => {
    if (t.adminReply) {
      return {
        text: "Replied",
        color: "bg-blue-100 text-blue-800",
        icon: "replied",
      };
    }

    return {
      text: "Pending",
      color: "bg-amber-100 text-amber-800",
      icon: "pending",
    };
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <Loader
        title="Loading tickets..."
        subtitle="Please wait"
      />
    );
  }

  // ---------------- JSX ----------------
  return (
    <SupportQueriesUI
      filteredTickets={filteredTickets}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      fetchTickets={fetchTickets}
      replyText={replyText}
      setReplyText={setReplyText}
      sendReply={sendReply}
      formatDate={formatDate}
      getStatusBadge={(t) => {
        const badge = getStatusBadge(t);

        // map icon string → actual icon JSX
        if (badge.icon === "replied") {
          return {
            ...badge,
            icon: (
              <span className="inline-flex items-center">
                💬
              </span>
            ),
          };
        }

        return {
          ...badge,
          icon: (
            <span className="inline-flex items-center">
              ⚠️
            </span>
          ),
        };
      }}
    />
  );
};

export default SupportQueries;
