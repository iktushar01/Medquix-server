import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    "http://localhost:3000",
    process.env.APP_URL as string
  ].filter(Boolean),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const siteName = 'MedQuix';
      const primaryColor = '#0f172a'; // Deep Indigo
      const accentColor = '#06b6d4';  // Medical Cyan

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
              .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
              .main { background-color: #ffffff; max-width: 600px; margin: 30px auto; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
              .header { background-color: ${primaryColor}; padding: 30px; text-align: center; }
              .logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
              .logo span { color: ${accentColor}; }
              .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
              .content h1 { font-size: 22px; color: #0f172a; margin-bottom: 20px; text-align: center; }
              .btn-container { text-align: center; margin: 35px 0; }
              .button { background-color: ${accentColor}; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; display: inline-block; transition: background 0.3s ease; }
              .link-alt { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px; word-break: break-all; }
              .footer { text-align: center; padding: 20px; font-size: 13px; color: #64748b; }
              .badge { background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: ${accentColor}; font-weight: bold; text-transform: uppercase; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="main">
                <div class="header">
                  <h1 class="logo">MED<span>QUIX</span></h1>
                </div>
                <div class="content">
                  <div style="text-align: center; margin-bottom: 10px;">
                    <span class="badge">Security Verification</span>
                  </div>
                  <h1>Welcome to the future of healthcare</h1>
                  <p>Hello,</p>
                  <p>Thank you for choosing <strong>MedQuix</strong>. To finalize your registration and ensure the security of your medical profile, please verify your email address by clicking the button below.</p>
                  
                  <div class="btn-container">
                    <a href="${url}" class="button">Verify Account Now</a>
                  </div>
                  
                  <p>If you did not sign up for a MedQuix account, you can safely ignore this email.</p>
                  
                  <div class="link-alt">
                    Trouble clicking? Copy this link:<br>
                    <a href="${url}" style="color: ${accentColor}">${url}</a>
                  </div>
                </div>
              </div>
              <div class="footer">
                &copy; 2026 MedQuix Inc. | Precision in Healthcare
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        await transporter.sendMail({
          from: `"MedQuix Security" <${process.env.APP_USER}>`,
          to: user.email,
          subject: `Verify your MedQuix Account`,
          html: html,
        });
        console.log(`✅ Success: Verification email sent to ${user.email}`);
      } catch (error) {
        console.error("❌ Error: Failed to send verification email:", error);
      }
    }
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});