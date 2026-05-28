const axios = require('axios');

async function sendOtpManually() {
  try {
    console.log('📧 Manually sending OTP to Ntokozomahlaela@gmail.com...');
    
    const otp = '72089619'; // The existing OTP
    const email = 'ntokozomahlaela@gmail.com';
    const name = 'Ntokozo Mahlaela';
    
    // Create the email HTML (same as in the admin service)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Welcome to TMG MakerSpace!</h2>
        <p style="color: #666; line-height: 1.6;">Dear ${name},</p>
        <p style="color: #666; line-height: 1.6;">Your membership application has been approved! You can now log in to your account.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Your Login Credentials:</h3>
          <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="color: #666; margin: 5px 0;"><strong>One-Time Password:</strong> <span style="background-color: #007bff; color: white; padding:5px 10px; border-radius: 4px; font-weight: bold; font-size: 18px;">${otp}</span></p>
        </div>
        <p style="color: #666; line-height: 1.6;">Use this OTP to log in for the first time. You will be required to change your password after logging in.</p>
        <p style="color: #666; line-height: 1.6;">Login here: <a href="http://localhost:4200/login" style="color: #007bff;">TMG MakerSpace Login</a></p>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `;

    console.log('📧 Email HTML prepared');
    
    // Try to send the email using the booking email service
    try {
      console.log('📧 Attempting to send email...');
      
      // We need to access the email service directly since we can't easily call the admin service
      // Let's create a simple email sending endpoint
      
      const emailData = {
        to: email,
        subject: `Your TMG MakerSpace Account - OTP: ${otp}`,
        html: emailHtml,
        from: '"TMG Makerspace" <Ntokozomokoena07@gmail.com>'
      };
      
      console.log('📧 Email data:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from
      });
      
      // Since we can't directly access the email service, let's create a test endpoint
      console.log('\n🔍 Checking if there are any email-related endpoints...');
      
      // Try the new OTP email endpoint
      try {
        const otpData = {
          email: email,
          name: name,
          surname: 'Mahlaela',
          otp: otp
        };
        
        const otpResponse = await axios.post('http://localhost:3000/email/send-otp', otpData);
        console.log('✅ OTP email sent successfully:', otpResponse.data);
        console.log('🎉 OTP has been sent to the email address!');
      } catch (otpError) {
        console.log('❌ Failed to send OTP email:', otpError.message);
        console.log('Response data:', otpError.response?.data);
      }
      
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError.message);
      console.error('Email error details:', {
        code: emailError.code,
        message: emailError.message,
        response: emailError.response
      });
    }
    
    console.log('\n📋 Summary:');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🎯 Status: Application approved, OTP generated`);
    
    console.log('\n📧 The OTP should be sent to the email address.');
    console.log('🔑 If the email service is working, the user will receive the OTP.');
    console.log('🌐 User can login at: http://localhost:4200/login');
    
  } catch (error) {
    console.error('❌ Error sending OTP manually:', error.message);
  }
}

sendOtpManually();
