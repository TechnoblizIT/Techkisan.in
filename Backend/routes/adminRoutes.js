const express = require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const adminModel=require('../models/admin-model');
const employeeModel=require('../models/employee-model');
const {loginUser}=require("../controllers/adminController");
const managerModel = require('../models/manager-model');
const internModel=require("../models/intern-model")
const announcementModel=require("../models/Announcement-model");
const AnnouncementModel = require('../models/Announcement-model');
const upload=require("../configs/mutler-setup")
const noTaxinvoiceModel = require('../models/no-taxinvoice-model');
router.post('/create', async(req, res) => {
    try{ bcrypt.genSalt("admin123", async function (err, salt) {
     const hashedPassword = await bcrypt.hash("admin123", 10);
      const newadmin = new adminModel({
       Name: "Test Admin",
       Email: "test@admin.com",
       Password: hashedPassword
      })
      await newadmin.save()
      console.log(newadmin)
     res.send("Successfully created Admin")
     })}catch(err){ console.log(err) }
     });

router.post("/login",loginUser)

router.get('/admindata',async function (req, res){
    try {
        const authHeader = req.headers.authorization;
        
        
       
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
    
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
    
        const employee = await employeeModel.find()
        const manager = await managerModel.find()
        const intern = await internModel.find()
        const Announcement=await announcementModel.find()
        const [employeeData, managerData, internData] = await Promise.all([
            employee,
            manager,
            intern
        ]);
        const allUsers = [...employeeData, ...managerData, ...internData];
        const employeeCount = await employeeModel.countDocuments()
        const managerCount=await managerModel.countDocuments()
        const internCount=await internModel.countDocuments()
        const totalsEmployess=employeeCount+managerCount;
        const admin = await adminModel.find()
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!admin){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
      
        res.status(200).json({
            success: true,
            employeeCount: totalsEmployess,
            internCount: internCount,
            employee: allUsers,
            Announcement:Announcement

        })
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    });
    router.post('/add_announcement', async (req, res) => {
        try {
            const { message } = req.body;
            const newAnnouncement = new announcementModel({
                Announcement: message,
            });
    
            await newAnnouncement.save();
            res.status(201).json({ success: true, message: "Announcement posted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    router.delete('/delete_announcement/:id', async (req, res) => {
        try {
            await AnnouncementModel.findByIdAndDelete(req.params.id);
            res.json({ success: true, message: "Announcement deleted!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post("/save_notaxinvoice", upload.single("invoicePDF"), async (req, res) => {
        try {
          const { invoiceNumber } = req.body;
          
          // Validate file
          if (!req.file) {
            return res.status(400).json({ message: "No PDF uploaded" });
          }
      
          // Create new invoice entry
          const newInvoice = new noTaxinvoiceModel({
            invoiceNumber,
            invoicePDF: req.file.buffer, // Store as Buffer
          });
      
          await newInvoice.save();
          res.json({ message: "Invoice saved successfully" });
        } catch (error) {
          console.error("Error saving invoice:", error);
          res.status(500).json({ message: "Failed to save invoice" });
        }
      });
      
      router.get("/invoice/latest", async (req, res) => {
        try {
          const lastInvoice = await noTaxinvoiceModel.findOne().sort({ _id: -1 }); // Fetch the latest inserted invoice
      
          let nextInvoiceNumber = "TKN-INV-01"; // Default for the first invoice
      
          if (lastInvoice && lastInvoice.invoiceNumber) {
            const match = lastInvoice.invoiceNumber.match(/TKN-INV-(\d+)/);
            if (match) {
              const nextNumber = String(parseInt(match[1]) + 1).padStart(2, "0");
              nextInvoiceNumber = `TKN-INV-${nextNumber}`;
            }
          }
      
          res.json({ invoiceNumber: nextInvoiceNumber });
        } catch (error) {
          res.status(500).json({ error: "Error fetching invoice number" });
        }
      });
    


   
module.exports = router