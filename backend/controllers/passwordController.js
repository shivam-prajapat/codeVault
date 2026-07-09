const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP and expiration time (15 mins from now)
        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send email via Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'CodeVault - Password Reset OTP',
            text: `You requested a password reset. Your OTP is: ${otp}\n\nThis OTP is valid for 15 minutes. If you did not request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>CodeVault Password Reset</h2>
                    <p>You requested to reset your password. Use the following One-Time Password (OTP) to proceed:</p>
                    <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; color: #000;">${otp}</h1>
                    <p>This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully to your email." });
    } catch (err) {
        console.error("Error in forgotPassword:", err.message);
        res.status(500).json({ message: "Failed to send email. Ensure App Password is set correctly." });
    }
}

async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        if (user.resetOtpExpire < Date.now()) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear OTP fields
        user.resetOtp = undefined;
        user.resetOtpExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successfully! You can now log in." });
    } catch (err) {
        console.error("Error in resetPassword:", err.message);
        res.status(500).json({ message: "Server error during password reset." });
    }
}

module.exports = {
    forgotPassword,
    resetPassword
};
