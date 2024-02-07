const express = require('express')
const router = express.Router()

const authenticateUser = require('../Middleware/authenticate')
const groupController = require('../Controllers/group-controller')

router.post('/group/add-group', authenticateUser.authenticate, groupController.addGroup)
router.get('/group/get-groups', authenticateUser.authenticate, groupController.getGroups)

module.exports = router