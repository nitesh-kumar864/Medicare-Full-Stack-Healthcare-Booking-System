import {
  MessageSquare,
  Clock,
  User,
  Mail,
  Calendar,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const SupportTicketItem = ({
  ticket,
  isExpanded,
  toggleExpand,
  getStatusConfig,
  formatDate,
  copyTicketId,
}) => {
  const status = getStatusConfig(ticket);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Ticket Header */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50"
        onClick={() => toggleExpand(ticket._id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {ticket.subject}
              </h3>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}
              >
                {status.icon}
                {status.text}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(ticket.createdAt)}
              </span>

              <span
                className="flex items-center gap-1 cursor-pointer hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  copyTicketId(ticket._id);
                }}
              >
                ID: {ticket._id.slice(-8)} <Copy size={14} />
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(ticket._id);
            }}
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg"
          >
            {isExpanded ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200 pt-6">
          {/* User Message */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User size={20} className="text-gray-500" />
              <h4 className="font-semibold text-gray-900">Your Message</h4>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
              <p className="text-gray-700 whitespace-pre-line">
                {ticket.message}
              </p>
            </div>
          </div>

          {/* Admin Reply */}
          {ticket.adminReply ? (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={20} className="text-green-600" />
                <h4 className="font-semibold text-gray-900">
                  Admin Response
                </h4>
                <span className="text-sm text-gray-500 ml-auto">
                  {formatDate(ticket.updatedAt)}
                </span>
              </div>

              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-gray-800 whitespace-pre-line">
                  {ticket.adminReply}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Response Pending
                  </h4>
                  <p className="text-sm text-gray-600">
                    Our support team will respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Created: {formatDate(ticket.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Updated: {formatDate(ticket.updatedAt)}
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                {ticket.email}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                {ticket.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketItem;
