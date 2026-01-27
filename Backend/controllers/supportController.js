import supportModel from "../models/supportModel.js";

//  USER –  send query
export const createSupportTicket = async (req, res) => {
  try {
    const userId = req.userId;

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message || !subject) {
      return res.json({ success: false, message: "All fields are required" });
    }

    await supportModel.create({ userId, name, email, subject, message });

    res.json({ success: true, message: "Your query has been submitted" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

//  USER – user seen queries 
export const getMySupportTickets = async (req, res) => {
  try {
    const userId = req.userId;
    const tickets = await supportModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ADMIN 
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await supportModel.find().sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export const replySupportTicket = async (req, res) => {
  try {
    const { ticketId, reply } = req.body;

    await supportModel.findByIdAndUpdate(ticketId, {
      adminReply: reply,
      status: "answered",
    });

    res.json({ success: true, message: "Reply sent to user" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
