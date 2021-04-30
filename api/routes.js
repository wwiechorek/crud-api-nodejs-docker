var express = require('express')
var router = express.Router()
var billController = require("./controllers/bill.controller")

router.post('/bill', billController.create)
router.get('/bill/:id', billController.read)
router.put('/bill/:id', billController.update)
router.delete('/bill/:id', billController.delete)
router.get('/bill', billController.find)

module.exports = router