import nodemailer from "nodemailer"

// Simple Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Simple email sending function
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Bug Exchange" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error:any) {
    console.error("Email error:", error)
    return { success: false, error: error.message }
  }
}

// Bug submission notification
export async function sendBugSubmissionNotification(
  bugAuthorEmail: string,
  bugTitle: string,
  submitterName: string,
  bugId: string,
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">🐛 New Bug Submission!</h2>
      <p>Hello!</p>
      <p><strong>${submitterName}</strong> has submitted a solution for your bug:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0;">${bugTitle}</h3>
      </div>
      <p>
        <a href="${process.env.NEXTAUTH_URL}/bugs/${bugId}" 
           style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Review Submission
        </a>
      </p>
      <p>Best regards,<br>Bug Exchange Team</p>
    </div>
  `

  return sendEmail(bugAuthorEmail, `New submission for: ${bugTitle}`, html)
}

// Submission approved notification
export async function sendSubmissionApprovedNotification(
  submitterEmail: string,
  bugTitle: string,
  bountyAmount: number,
  submitterName: string,
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10B981;">🎉 Congratulations!</h2>
      <p>Hello ${submitterName}!</p>
      <p>Your solution for "<strong>${bugTitle}</strong>" has been approved!</p>
      <div style="background: #D1FAE5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #10B981; margin: 0;">You earned ₹${bountyAmount.toLocaleString()}!</h3>
        <p style="margin: 10px 0;">+ ${Math.floor(bountyAmount / 100)} reputation points</p>
      </div>
      <p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" 
           style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Dashboard
        </a>
      </p>
      <p>Keep up the great work!<br>Bug Exchange Team</p>
    </div>
  `

  return sendEmail(submitterEmail, "🎉 Your submission has been approved!", html)
}

// Submission rejected notification
export async function sendSubmissionRejectedNotification(
  submitterEmail: string,
  bugTitle: string,
  submitterName: string,
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #EF4444;">📝 Submission Update</h2>
      <p>Hello ${submitterName}!</p>
      <p>Thank you for your submission for "<strong>${bugTitle}</strong>". Unfortunately, your solution was not approved this time.</p>
      <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #F59E0B; margin: 0;">💡 Don't Give Up!</h3>
        <p style="margin: 10px 0;">Consider reviewing the requirements and submitting an improved solution.</p>
      </div>
      <p>
        <a href="${process.env.NEXTAUTH_URL}/bugs" 
           style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Browse More Bugs
        </a>
      </p>
      <p>Keep coding!<br>Bug Exchange Team</p>
    </div>
  `

  return sendEmail(submitterEmail, `Submission update for: ${bugTitle}`, html)
}

// Test email function
export async function sendTestEmail(to: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">✅ Email Test Successful!</h2>
      <p>If you're reading this, your email configuration is working perfectly!</p>
      <p>Your Bug Exchange Marketplace is ready to send notifications.</p>
      <p>Best regards,<br>Bug Exchange Team</p>
    </div>
  `

  return sendEmail(to, "Bug Exchange - Email Test", html)
}
