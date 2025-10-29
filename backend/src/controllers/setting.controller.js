const sanitize = require("mongo-sanitize")
const fs = require('fs')
const { errorResponse, successResponse } = require("../../utils/responseHandler")
const { settingSchema } = require("../../config/zod")
const Setting = require("../models/setting.model")
const path = require("path")


// Update Setting
const updateSetting = async (req, res)=>{
    try{
        // Get Data From Body
        const siteLogo = req.files?.siteLogo?.[0] || null;
        const siteIcon = req.files?.siteIcon?.[0] || null;
        const {siteName='', siteTitle, logoAltTag, iconAltTag} = req.body

        // Make Object
        const data = {
            siteLogo,
            logoAltTag,
            siteName,
            siteTitle,
            siteIcon,
            iconAltTag
        }

        // Sanitize Data
        const sanitizeData = sanitize(data)

        // Zod Validation
        const validation = settingSchema.safeParse(sanitizeData)

        // Zod Validation Error
        if(!validation.success){
            // Delete Files
            siteLogo ? fs.unlink(siteLogo.path) : null
            siteIcon ? fs.unlink(siteIcon.path) : null

            // Zod Error
            const zodError = validation.error

            // Get All Errors
            let allErrors = []
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: 'setting_zod_validation_error',
                error: allErrors
            })
        }

        // Get Data From Validation
        const {siteLogo: logo, logoAltTag: logoAlt, siteName: name, siteTitle: title, siteIcon: icon, iconAltTag: iconAlt} = validation.data

        // Get Setting Data From DB
        const settingData = await Setting.findOne()

        // Base Url
        const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`

        // Create Or Save
        if(!settingData){
            // Create Setting
            const createSetting = await Setting.create({
                siteLogo: logo ? `${baseUrl}${logo.filename}` : '', 
                logoAltTag: logoAlt || '', 
                siteName: name || '', 
                siteTitle: title || '', 
                siteIcon: icon ? `${baseUrl}${icon.filename}` : '',
                iconAltTag: iconAlt || ''
            })

            // If Create Failed
            if(!createSetting){
                // Delete Files
                siteLogo ? fs.unlink(siteLogo.path) : null
                siteIcon ? fs.unlink(siteIcon.path) : null

                return errorResponse(res, 400, 'Failed to create settings.')
            }

            return successResponse(res, 201, 'Settings created successfully.')
        }

        // Delete Old Files
        if(logo && settingData.siteLogo){
            const siteLogoUrl = settingData.siteLogo
            const baseName = path.basename(siteLogoUrl)
            // const fileName = siteLogoUrl.split('/uploads/')[1]
            const filePath = path.join('uploads', baseName)
            if(fs.existsSync(filePath)) fs.unlinkSync(filePath)
        }
        if(icon && settingData.siteIcon){
            const siteIconUrl = settingData.siteIcon
            const baseName = path.basename(siteIconUrl)
            // const fileName = siteIconUrl.split('/uploads/')[1]
            const filePath = path.join('uploads', baseName)
            if(fs.existsSync(filePath)) fs.unlinkSync(filePath)
        }

        // Save New Data
        logo ? settingData.siteLogo = `${baseUrl}${logo.filename}` : null
        settingData.logoAltTag = logoAlt
        settingData.siteName = name
        settingData.siteTitle = title
        icon ? settingData.siteIcon = `${baseUrl}${icon.filename}` : null
        settingData.iconAltTag = iconAlt
        await settingData.save()

        return successResponse(res, 200, 'Application settings updated.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}



// Get Setting
const getAppData = async (req, res)=>{
    try{
        // Get App Data
        const appData = await Setting.findOne().select('-createdAt -updatedAt -__v -_id')

        // If App Data Not Exist
        if(!appData){
            return errorResponse(res, 404, 'Application settings not found.')
        } 

        return successResponse(res, 200, 'Application data retrieved successfully.', appData)
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}











module.exports = {
    updateSetting,
    getAppData,
}