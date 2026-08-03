export const dynamic = "force-dynamic";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user?.password) {
          throw new Error("Tài khoản không tồn tại");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Mật khẩu không chính xác");
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    }
  },
  events: {
    async createUser(message) {
      // Khi một user mới đăng ký (dù là Google hay Email), sự kiện này sẽ kích hoạt.
      console.log("SENDING VERIFICATION EMAIL TO:", message.user.email);
      
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password) của Gmail
          },
        });

        // Tạo link xác nhận
        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?email=${message.user.email}`;

        await transporter.sendMail({
          from: `"CoerVora AI" <${process.env.EMAIL_USER}>`,
          to: message.user.email!,
          subject: "Xác thực tài khoản CoerVora AI của bạn",
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Chào mừng đến với CoerVora!</h2>
              <p>Chào ${message.user.name || "bạn"},</p>
              <p>Chỉ còn một bước nữa để hoàn tất đăng ký tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để xác thực email:</p>
              <a href="${verifyUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">
                Xác nhận Email ngay
              </a>
              <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
                Nếu nút trên không hoạt động, vui lòng copy đường dẫn này: <br/>
                <a href="${verifyUrl}">${verifyUrl}</a>
              </p>
            </div>
          `,
        });
        console.log("Đã gửi email xác thực thành công!");
      } catch (error) {
        console.error("Lỗi khi gửi email:", error);
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
