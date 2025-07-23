import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Create transporter (you'll need to configure this with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send acknowledgment email to applicant
    const acknowledgmentEmail = {
      from: process.env.FROM_EMAIL || 'noreply@mymvp.io',
      to: formData.email,
      subject: 'Application Received - myMVP Partnership',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0B1426 0%, #00F5FF 100%); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">myMVP</h1>
            <p style="color: #00F5FF; margin: 10px 0 0 0; font-size: 16px;">AI-Powered MVP Development</p>
          </div>
          
          <h2 style="color: #0B1426;">Thank you for your application!</h2>
          
          <p>Hi ${formData.name},</p>
          
          <p>We've received your application for our premium AI-powered MVP development partnership. Here's what happens next:</p>
          
          <ul style="line-height: 1.8;">
            <li><strong>Review Process:</strong> Our team will review your application within 24 hours</li>
            <li><strong>Technical Assessment:</strong> We'll evaluate your project's technical requirements and AI integration needs</li>
            <li><strong>Partnership Call:</strong> If there's a good fit, we'll schedule a strategic partnership call</li>
            <li><strong>Project Kickoff:</strong> Once confirmed, we can begin development within 48 hours</li>
          </ul>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B1426; margin-top: 0;">Your Application Summary:</h3>
            <p><strong>Product:</strong> ${formData.productDescription.substring(0, 100)}...</p>
            <p><strong>Budget Range:</strong> ${formData.budget}</p>
            <p><strong>Timeline:</strong> ${formData.timeline}</p>
          </div>
          
          <p>While you wait, feel free to explore our <a href="https://mymvp.io" style="color: #00F5FF;">development philosophy</a> and see why we believe building beats researching every time.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The myMVP Team</strong><br>
            <em>Transforming visions into reality, one MVP at a time</em>
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
          </div>
        </body>
        </html>
      `,
    }

    // Send notification email to admin
    const adminEmail = {
      from: process.env.FROM_EMAIL || 'noreply@mymvp.io',
      to: process.env.ADMIN_EMAIL || 'admin@mymvp.io',
      subject: `New MVP Application - ${formData.name} (${formData.budget})`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="background: #0B1426; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #00F5FF;">New MVP Application</h1>
            <p style="margin: 10px 0 0 0;">High-priority partnership opportunity</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0B1426; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Company:</strong> ${formData.company}</p>
            <p><strong>Budget:</strong> ${formData.budget}</p>
            <p><strong>Timeline:</strong> ${formData.timeline}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Technical Vision</h3>
            <p><strong>Product Description:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.productDescription}</p>
            
            <p><strong>Technical Requirements:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.technicalRequirements}</p>
            
            <p><strong>AI Features:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.aiFeatures}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Growth Readiness</h3>
            <p><strong>Current Audience:</strong> ${formData.currentAudience}</p>
            <p><strong>Marketing Strategy:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.marketingStrategy}</p>
            
            <p><strong>Customer Acquisition:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.customerAcquisition}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Partnership Fit</h3>
            <p><strong>Previous Launches:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.previousLaunches}</p>
            
            <p><strong>Team Composition:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${formData.teamComposition}</p>
          </div>
          
          <div style="background: #00F5FF; color: #0B1426; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin-top: 0;">Next Steps</h3>
            <p>Review this application and schedule a partnership call if there's a good fit.</p>
            <p><strong>Response needed within 24 hours</strong></p>
          </div>
        </body>
        </html>
      `,
    }

    // Send both emails
    await transporter.sendMail(acknowledgmentEmail)
    await transporter.sendMail(adminEmail)

    return NextResponse.json({ success: true, message: 'Application submitted successfully' })
  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json({ success: false, message: 'Failed to submit application' }, { status: 500 })
  }
}