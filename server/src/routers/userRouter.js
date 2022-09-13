const express = require('express'); 
const router = express.Router(); 

const {verifyToken}  = require('../utils/authorization')


const userController = require('../controllers/userController'); 

router.get('/api/user',verifyToken, userController.getAllUser)
router.put('/api/user/:id', verifyToken, userController.updateUser)


module.exports = router; 