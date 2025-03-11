const mailSender = require('../../helpers/email_sender');

class EmailService {
  async sendPasswordResetOTP(email, otp) {
    return await mailSender.sendMail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);
  }
}

module.exports =  EmailService;