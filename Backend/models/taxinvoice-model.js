const mongoose = require("mongoose");

const TaxInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoicePDF: { type: Buffer, required: true }, 
});

module.exports = mongoose.model("TaxInvoice", TaxInvoiceSchema);