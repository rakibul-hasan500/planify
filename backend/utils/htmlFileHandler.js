const fs = require('fs')
const path = require('path')

const otpEmailTemplate = ()=>{
    const htmlPath = path.join(process.cwd(), 'html', 'otpMail.html')
    let html = fs.readFileSync(htmlPath, 'utf-8')
    return html    
}








module.exports = {
    otpEmailTemplate,
}