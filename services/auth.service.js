const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(userRepository, tokenRepository) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  async register(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with that email already exists!', {
        cause: { status: 409 },
      });
    }

    const passwordHash = await bcrypt.hash(userData.password, 8);
    const user = await this.userRepository.create({
      ...userData,
      passwordHash,
    });
    return user;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found', { cause: { status: 404 } });
    }
    console.log('Auth service - login : - user - ', user);
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Incorrect password!', { cause: { status: 400 } });
    }

    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '60d' }
    );

    await this.tokenRepository.deleteByUserId(user.id);
    await this.tokenRepository.create({
      userId: user.id,
      accessToken,
      refreshToken,
    });

    return { user, accessToken };
  }

  async verifyToken(accessToken) {
    const token = await this.tokenRepository.findByAccessToken(accessToken);
    if (!token) throw new Error('Invalid token', { cause: { status: 401 } });

    const tokenData = jwt.decode(token.refreshToken);
    const user = await this.userRepository.findById(tokenData.id);
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    const isValid = jwt.verify(
      token.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!isValid) throw new Error('Invalid token', { cause: { status: 401 } });

    return true;
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new Error('User with that email does NOT exist!', {
        cause: { status: 404 },
      });

    const otp = Math.floor(1000 + Math.random() * 9000);
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 600000; // 10 דקות
    await user.save();

    await mailSender.sendMail(
      email,
      'Password Reset OTP',
      `Your OTP for password reset is: ${otp}`
    );
    return { message: 'OTP sent successfully' };
  }

  async verifyPasswordResetOTP(email, otp) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('User not found!', { cause: { status: 404 } });

    if (
      user.resetPasswordOtp !== +otp ||
      Date.now() > user.resetPasswordOtpExpires
    ) {
      throw new Error('Invalid or expired OTP', { cause: { status: 401 } });
    }

    user.resetPasswordOtp = 1;
    user.resetPasswordOtpExpires = undefined;
    await user.save();
    return { message: 'OTP confirmed successfully' };
  }

  async resetPassword(email, newPassword) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('User not found!', { cause: { status: 404 } });

    if (user.resetPasswordOtp !== 1) {
      throw new Error('Confirm OTP before resetting password.', {
        cause: { status: 401 },
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 8);
    user.resetPasswordOtp = undefined;
    await user.save();
    return { message: 'Password reset successfully' };
  }
}

module.exports = AuthService;
