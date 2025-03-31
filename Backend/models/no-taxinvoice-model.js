const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  partyName: { type: String,default:""},
  DateOfIssue:{type:String,default:""},
  invoicePDF: { type: Buffer, required: true }, // Store PDF as Buffer
});

module.exports = mongoose.model("Invoice", InvoiceSchema);