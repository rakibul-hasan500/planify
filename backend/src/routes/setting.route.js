const express = require('express')
const verifyAuth = require('../middlewares/verifyLogin')
const { updateSetting, getAppData } = require('../controllers/setting.controller')
const verifyAdmin = require('../middlewares/verifyAdmin')
const uploads = require('../../config/multer')
const router = express.Router()


// Update Setting
router.put('/update', verifyAuth, verifyAdmin, uploads.fields([
    {name: 'siteLogo', maxCount: 1},
    {name: 'siteIcon', maxCount: 1}
]), updateSetting)


// Get Setting
router.get('/data', verifyAuth, getAppData)


















module.exports = router