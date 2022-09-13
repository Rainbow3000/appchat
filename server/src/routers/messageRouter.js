const express = require('express'); 
const router = express.Router(); 
const messageController = require('../controllers/messageController')

router.post('/api/message',messageController.createMessage); 
router.get('/api/message',messageController.getMessage); 

module.exports = router; 