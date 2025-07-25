import nodemailer from 'nodemailer'

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'heracles.mxrouting.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'roger@mymvp.io',
    pass: process.env.SMTP_PASSWORD // You'll add this to .env.local
  }
})

export interface ApplicationData {
  name: string
  email: string
  productName: string
  prdOutput: string
  projectType: string
  budget: string
  readiness: string
  technicalPrefs?: string
  customRequirements?: string
  first10Users?: string
  first100Users?: string
  marketingChannels?: string
  marketingBudget?: string
  marketingExperience?: string
  qualification?: string
}

export async function sendApplicationNotification(data: ApplicationData) {
  try {
    const mailOptions = {
      from: 'roger@mymvp.io',
      to: 'roger@mymvp.io',
      subject: `New MyMVP Application: ${data.name} - ${data.productName}`,
      html: `
        <h2>New Application Submission</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Product Name:</strong> ${data.productName}</p>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        
        <h3>Budget & Timeline</h3>
        <p><strong>Budget:</strong> ${data.budget}</p>
        
        <h3>Project Readiness</h3>
        <p><strong>Readiness:</strong> ${data.readiness}</p>
        
        <h3>PRD Content</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p><strong>Length:</strong> ${data.prdOutput.length} characters</p>
          <div style="max-height: 200px; overflow-y: auto; white-space: pre-wrap; font-family: monospace; font-size: 12px;">
${data.prdOutput}
          </div>
        </div>
        
        ${data.technicalPrefs ? `
        <h3>Technical Preferences</h3>
        <p>${data.technicalPrefs}</p>
        ` : ''}
        
        ${data.customRequirements ? `
        <h3>Custom Requirements</h3>
        <p>${data.customRequirements}</p>
        ` : ''}
        
        <h3>Marketing Strategy</h3>
        ${data.first10Users ? `<p><strong>First 10 Users:</strong> ${data.first10Users}</p>` : ''}
        ${data.first100Users ? `<p><strong>First 100 Users:</strong> ${data.first100Users}</p>` : ''}
        ${data.marketingChannels ? `<p><strong>Marketing Channels:</strong> ${data.marketingChannels}</p>` : ''}
        ${data.marketingBudget ? `<p><strong>Marketing Budget:</strong> ${data.marketingBudget}</p>` : ''}
        ${data.marketingExperience ? `<p><strong>Marketing Experience:</strong> ${data.marketingExperience}</p>` : ''}
        
        ${data.qualification ? `
        <h3>Qualification Result</h3>
        <p style="background: ${data.qualification === 'highly_qualified' ? '#d4edda' : data.qualification === 'qualified' ? '#fff3cd' : '#f8d7da'}; padding: 10px; border-radius: 5px;">
          <strong>${data.qualification.toUpperCase().replace('_', ' ')}</strong>
        </p>
        ` : ''}
        
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
    
  } catch (error) {
    console.error('❌ Email send failed:', error)
    return { success: false, error: error }
  }
}