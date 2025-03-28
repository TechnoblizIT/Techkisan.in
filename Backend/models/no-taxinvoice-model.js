const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoicePDF: { type: Buffer, required: true }, // Store PDF as Buffer
});

module.exports = mongoose.model("Invoice", InvoiceSchema);