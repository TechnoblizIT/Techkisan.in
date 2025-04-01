const express = require('express')
const router=express.Router()
const managerModel=require("../models/manager-model")
const employeeModel=require('../models/employee-model')
const taxInvoiceModel=require('../models/taxinvoice-model')
const noTaxinvoiceModel=require('../models/no-taxinvoice-model')
const messageModel = require('../models/message-model')
router.get('/', function(req, res){
    res.send('Hello, World!')
})

router.get("/assignments" , async function(req, res){
const employee=await employeeModel.findOne({username:"pradumankathade3ec2e4"})
const manager=await managerModel.findOne({username:"johndoea9465d"})
employee.manager=manager._id

manager.employees=employee._id
await manager.save()
await employee.save()
res.send("Assigned successfully")


})

router.get("/messages", async (req, res) => {
    try {
      const messages = await messageModel.find();
     
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  router.get("/download_invoice/:id",async (req, res) => {
    try {
      let invoice = await taxInvoiceModel.findById(req.params.id);
  
      if (!invoice) {
        invoice = await noTaxinvoiceModel.findById(req.params.id);
      }
  
      if (!invoice || !invoice.invoicePDF) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice_${invoice.invoiceNumber}.pdf`,
      });
  
      res.send(invoice.invoicePDF);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invoice", error });
    }
  });
  
  
module.exports = router