import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ApplicationData {
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
  qualification: 'highly_qualified' | 'qualified' | 'unqualified'
  submittedAt: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Starting application submission...')
    const formData: ApplicationData = await request.json()
    console.log('📝 Form data received:', { name: formData.name, email: formData.email, productName: formData.productName })
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      throw new Error(`Invalid email address: ${formData.email}`)
    }

    // Create transporter (you'll need to configure this with your email service)
    console.log('🔧 Creating SMTP transporter...')
    console.log('🔑 SMTP_PASSWORD exists:', !!process.env.SMTP_PASSWORD)
    
    const transporter = nodemailer.createTransport({
      host: 'heracles.mxrouting.net',
      port: 587,
      secure: false,
      auth: {
        user: 'roger@mymvp.io',
        pass: process.env.SMTP_PASSWORD,
      },
    })
    
    console.log('✅ Transporter created successfully')

    // Determine email content based on qualification
    const getQualificationMessage = (qualification: string) => {
      switch (qualification) {
        case 'highly_qualified':
          return {
            subject: 'Congratulations! Next Steps for Your MVP',
            message: 'You\'re exactly the type of founder we love working with. Please book your discovery call using the link provided.',
            priority: '🔥 HIGH PRIORITY'
          }
        case 'qualified':
          return {
            subject: 'Application Received - Under Review',
            message: 'We\'ll review your PRD and respond within 24 hours with next steps.',
            priority: '⭐ QUALIFIED'
          }
        default:
          return {
            subject: 'Thank You for Your Interest',
            message: 'Based on your responses, we may not be the right fit at this time. We\'ll notify you if we expand our services to match your needs.',
            priority: '📋 UNQUALIFIED'
          }
      }
    }

    const qualificationInfo = getQualificationMessage(formData.qualification)

    // Send acknowledgment email to applicant
    console.log('📬 Email addresses:')
    console.log('  - From:', 'hello@mymvp.io')
    console.log('  - To (user):', formData.email)
    console.log('  - To (admin):', 'roger@mymvp.io')
    
    const acknowledgmentEmail = {
      from: 'hello@mymvp.io',
      to: formData.email,
      subject: qualificationInfo.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; border: 2px solid #e5e7eb;">
            <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <img src="https://mymvp.io/logo.png" alt="myMVP Logo" style="width: 32px; height: 32px; margin-right: 12px;" />
              <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: bold;">
                my<span style="color: #2563eb;">MVP</span>
              </h1>
            </div>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">AI-Powered MVP Development</p>
          </div>
          
          <h2 style="color: #0B1426;">${qualificationInfo.subject}</h2>
          
          <p>Hi ${formData.name},</p>
          
          <p>Thank you for completing our AI-powered PRD generation process and submitting your application for ${formData.productName}.</p>
          
          <p>${qualificationInfo.message}</p>
          
          ${formData.qualification === 'highly_qualified' ? `
          <div style="background: #dcfce7; border: 2px solid #16a34a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">🎉 You're Pre-Qualified!</h3>
            <p style="color: #166534;">Your application shows exactly what we're looking for:</p>
            <ul style="color: #166534;">
              <li>Appropriate budget and timeline</li>
              <li>Understanding of the collaborative process</li>
              <li>Comprehensive PRD with clear requirements</li>
            </ul>
            <p style="color: #166534;"><strong>Next step:</strong> Book your discovery call using the calendar link in your dashboard.</p>
          </div>
          ` : ''}
          
          ${formData.qualification === 'qualified' ? `
          <div style="background: #dbeafe; border: 2px solid #2563eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">📋 Application Under Review</h3>
            <p style="color: #1e40af;">We'll evaluate your PRD and requirements, then respond within 24 hours with next steps.</p>
          </div>
          ` : ''}
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B1426; margin-top: 0;">Your Application Summary:</h3>
            <p><strong>Product:</strong> ${formData.productName}</p>
            <p><strong>Budget & Timeline:</strong> ${formData.budget}</p>
            <p><strong>Readiness Level:</strong> ${formData.readiness === 'ready' ? 'Ready for collaboration ✅' : 'Needs further discussion'}</p>
            <p><strong>PRD Length:</strong> ${formData.prdOutput.length} characters</p>
          </div>
          
          <p>While you wait, feel free to explore our <a href="https://mymvp.io" style="color: #2563eb;">development philosophy</a> and see why we believe building beats researching every time.</p>
          
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
      from: 'hello@mymvp.io',
      to: 'roger@mymvp.io',
      subject: `${qualificationInfo.priority} New Application - ${formData.name} (${formData.productName})`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #e5e7eb;">
            <div style="display: inline-flex; align-items: center; margin-bottom: 15px;">
              <img src="https://mymvp.io/logo.png" alt="myMVP Logo" style="width: 32px; height: 32px; margin-right: 12px;" />
              <h1 style="color: #000000; margin: 0; font-size: 24px; font-weight: bold;">
                my<span style="color: #2563eb;">MVP</span>
              </h1>
            </div>
            <h2 style="margin: 0; color: #dc2626; font-size: 20px;">New MVP Application - ${qualificationInfo.priority}</h2>
            <p style="margin: 10px 0 0 0; color: #374151;">Qualification Level: <strong>${formData.qualification.toUpperCase()}</strong></p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #0B1426; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Product/Company:</strong> ${formData.productName}</p>
            <p><strong>Project Type:</strong> ${formData.projectType}</p>
            <p><strong>Budget & Timeline:</strong> ${formData.budget}</p>
            <p><strong>Submitted:</strong> ${new Date(formData.submittedAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Qualification Assessment</h3>
            <div style="background: ${formData.qualification === 'highly_qualified' ? '#dcfce7' : formData.qualification === 'qualified' ? '#dbeafe' : '#fed7d7'}; padding: 15px; border-radius: 8px;">
              <p><strong>Status:</strong> ${formData.qualification.toUpperCase()}</p>
              <p><strong>Readiness:</strong> ${formData.readiness === 'ready' ? '✅ Ready for collaboration' : '❌ ' + formData.readiness}</p>
              <p><strong>Budget Qualification:</strong> ${formData.budget.includes('$5-10K') || formData.budget.includes('$10K+') ? '✅ Highly qualified budget' : formData.budget.includes('$2-5K') ? '⚠️ Qualified budget' : '❌ Below minimum'}</p>
              <p><strong>PRD Quality:</strong> ${formData.prdOutput.length >= 500 ? `✅ Comprehensive (${formData.prdOutput.length} characters)` : `❌ Too brief (${formData.prdOutput.length} characters)`}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Product Requirements Document</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">
              <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${formData.prdOutput}</pre>
            </div>
          </div>
          
          ${formData.technicalPrefs ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Technical Requirements</h3>
            <p><strong>Preferences:</strong> ${formData.technicalPrefs}</p>
            ${formData.customRequirements ? `<p><strong>Custom Requirements:</strong> ${formData.customRequirements}</p>` : ''}
          </div>
          ` : ''}
          
          ${(formData.first10Users || formData.first100Users || formData.marketingChannels) ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0B1426;">Marketing Strategy</h3>
            ${formData.first10Users ? `<p><strong>First 10 Users:</strong> ${formData.first10Users}</p>` : ''}
            ${formData.first100Users ? `<p><strong>First 100 Users:</strong> ${formData.first100Users}</p>` : ''}
            ${formData.marketingChannels ? `<p><strong>Marketing Channels:</strong> ${formData.marketingChannels}</p>` : ''}
            ${formData.marketingBudget ? `<p><strong>Marketing Budget:</strong> ${formData.marketingBudget}</p>` : ''}
            ${formData.marketingExperience ? `<p><strong>Marketing Experience:</strong> ${formData.marketingExperience}</p>` : ''}
          </div>
          ` : ''}
          
          <div style="background: ${formData.qualification === 'highly_qualified' ? '#16a34a' : formData.qualification === 'qualified' ? '#2563eb' : '#dc2626'}; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin-top: 0;">Recommended Action</h3>
            ${formData.qualification === 'highly_qualified' ? `
              <p><strong>IMMEDIATE FOLLOW-UP REQUIRED</strong></p>
              <p>This is a pre-qualified lead. The applicant should be directed to book a discovery call immediately.</p>
            ` : formData.qualification === 'qualified' ? `
              <p><strong>MANUAL REVIEW REQUIRED</strong></p>
              <p>Review the PRD and respond within 24 hours with next steps.</p>
            ` : `
              <p><strong>POLITE REJECTION SENT</strong></p>
              <p>This applicant doesn't meet current qualification criteria. Add to nurture list for future opportunities.</p>
            `}
          </div>
        </body>
        </html>
      `,
    }

    // Send both emails
    console.log('📤 Sending acknowledgment email...')
    await transporter.sendMail(acknowledgmentEmail)
    console.log('✅ Acknowledgment email sent')
    
    console.log('📤 Sending admin notification email...')
    await transporter.sendMail(adminEmail)
    console.log('✅ Admin email sent')

    // Log application for analytics (you might want to store this in a database)
    console.log('New application submitted:', {
      name: formData.name,
      email: formData.email,
      product: formData.productName,
      qualification: formData.qualification,
      timestamp: formData.submittedAt
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      qualification: formData.qualification
    })
  } catch (error) {
    console.error('❌ Error processing application:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    })
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 })
  }
}