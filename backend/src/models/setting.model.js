const mongoose = require('mongoose')


const settingSchema = new mongoose.Schema({

    siteLogo: {type: String, default: ''},

    logoAltTag: {type: String, default: ''},

    siteName: {type: String, required: true, default: 'Site Name'},

    siteTitle: {type: String, default: ''},

    siteIcon: {type: String, default: ''},

    iconAltTag: {type: String, default: ''},

}, {timestamps: true})

const Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting