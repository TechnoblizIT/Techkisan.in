const mongoose = require("mongoose");

const TaxInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  partyName: { type: String,default:""},
  DateOfIssue:{type:String,default:""},
  invoicePDF: { type: Buffer, required: true }, 
});

module.exports = mongoose.model("TaxInvoice", TaxInvoiceSchema);