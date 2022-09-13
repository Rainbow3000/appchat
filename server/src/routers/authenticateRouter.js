const express = require('express'); 


const router = express.Router(); 

const authenticateController = require('../controllers/authenticateController'); 
const authorization = require('../utils/authorization')

router.post('/api/login',authenticateController.login); 
router.post('/api/register',authenticateController.register); 
router.get('/api/refreshToken',authorization.refreshToken); 

module.exports = router; 