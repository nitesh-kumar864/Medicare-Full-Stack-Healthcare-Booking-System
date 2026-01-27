import {
  MessageSquare,
  User,
  Send,
  AlertCircle,
  Filter,
  Calendar,
  RefreshCw,
  Shield,
} from "lucide-react";

const SupportQueriesUI = ({
  filteredTickets,
  statusFilter,
  setStatusFilter,
  fetchTickets,
  replyText,
  setReplyText,
  sendReply,
  formatDate,
  getStatusBadge,
}) => {
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl">
          <MessageSquare className="text-primary" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Support Tickets
          </h1>
          <p className="text-gray-600">Manage customer queries</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-900">Filters</h3>

            {statusFilter !== "all" && (
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                Active: {statusFilter}
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
            </select>

            <button
              onClick={fetchTickets}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-2"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredTickets.length === 0 && (
        <div className="bg-white rounded-2xl border p-10 text-center">
          <AlertCircle size={42} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            No tickets found
          </h3>
          <p className="text-gray-500 mt-1">
            Try changing filters or refresh tickets
          </p>
        </div>
      )}

      {/* TICKETS GRID */}
      {filteredTickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((t) => {
            const status = getStatusBadge(t);

            return (
              <div
                key={t._id}
                className={`bg-white rounded-2xl shadow-sm border p-6 transition
                ${
                  !t.adminReply
                    ? "border-yellow-300"
                    : "hover:shadow-md"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {t.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${status.color}`}
                  >
                    {status.icon} {status.text}
                  </span>
                </div>

                {/* Subject */}
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {t.subject}
                  </h4>
                  <span className="text-xs text-gray-500">
                    <Calendar size={12} className="inline mr-1" />
                    {formatDate(t.createdAt)}
                  </span>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all">
                  <b>Query:</b> {t.message}
                </p>

                {/* Admin Reply */}
                {t.adminReply && (
                  <div className="mt-4 p-3 bg-blue-50 border rounded-xl text-sm text-blue-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={16} />
                      <span className="font-semibold">
                        Admin Reply
                      </span>
                    </div>
                    {t.adminReply}
                  </div>
                )}

                {/* Reply Box (ONLY if pending) */}
                {!t.adminReply && (
                  <>
                    <textarea
                      rows={3}
                      placeholder="Type your reply..."
                      className="w-full mt-4 p-3 border rounded-xl focus:ring-2 focus:ring-primary resize-none"
                      value={replyText[t._id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [t._id]: e.target.value,
                        })
                      }
                    />

                    <button
                      onClick={() => sendReply(t._id)}
                      disabled={!replyText[t._id]?.trim()}
                      className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Send size={18} className="inline mr-1" />
                      Send Reply
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SupportQueriesUI;
