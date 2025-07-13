# 📝 TODOAPP - Authenticated Task Manager API

A Node.js backend project with full **user authentication**, **OTP verification**, and **JWT-based protected routes**. Users can register, verify email via OTP, log in, and securely manage their to-dos.

---

## 🚀 Features

- ✅ User Signup & Email Verification (OTP)
- 🔐 JWT-based Authentication
- ♻️ OTP Resend & Password Reset via Email
- 🛡️ Protected Routes Middleware
- 📝 Full Todo CRUD (Coming Soon)
- 📧 Nodemailer-based OTP Delivery
- 📦 Scalable Modular Folder Structure

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Nodemailer**
- **JWT**
- **dotenv**
- **cookie-parser**

---

## 🔐 AUTH FLOW - FULL REFERENCE

### 📁 Routes - `auth.route.js`
| Method | Endpoint           | Controller         |
|--------|--------------------|--------------------|
| POST   | `/signup`          | `auth.controller`  |
| POST   | `/verify-otp`      | `auth.controller`  |
| POST   | `/resend-otp`      | `auth.controller`  |
| POST   | `/login`           | `auth.controller`  |
| GET    | `/logout`          | `auth.controller`  |
| POST   | `/send-reset-otp`  | `auth.controller`  |
| POST   | `/reset-password`  | `auth.controller`  |

---

### 📂 Controllers - `auth.controller.js`

#### 🔸 `signup()`
- ✅ Validate input
- 🔐 Hash password
- 🔢 Generate 4-digit `verifyOTP`
- ⏰ Set `verifyOTPExpireAt`
- ✉️ Send OTP via `sendOTP(email, verifyOTP, "verify")`
- 💾 Save user to DB
- 🍪 Return JWT in cookie

#### 🔸 `verifyOTP()`
- 🔍 Find user
- ✅ Match OTP and check expiry
- ☑️ Set `user.verified = true`
- 🧹 Clear OTP fields
- 💾 Save

#### 🔸 `resendOTP()`
- 🔍 Find user
- 🔁 Generate and update OTP
- ✉️ Resend via `sendOTP(email, OTP, "verify")`

#### 🔸 `sendResetOTP()`
- 🔍 Check user
- 🔢 Generate reset OTP
- ⏰ Set expiry
- ✉️ Send reset OTP

#### 🔸 `resetPassword()`
- ✅ Validate OTP & expiry
- 🔐 Hash new password
- 🧹 Clear reset OTP fields
- 💾 Save

#### 🔸 `login()`
- ✅ Check email & password
- ☑️ Ensure user is verified
- 🍪 Return JWT token

#### 🔸 `logout()`
- 🚪 Clear JWT cookie

---

### 🔐 Middleware - `authMiddleware.js`
- 🛡️ `protect()`: Verifies JWT from cookie
- 👤 Attaches user to `req.user`
- ❌ Errors on missing/invalid token

---

### 🧰 Utils - `sendOTP.js`
- ✉️ `sendOTP(email, otp, type)`
- 📬 Uses nodemailer
- 🔧 `type` → `"verify"` or `"reset"`

---

### 🔐 Utils - `tokenHandler.js`
- 🔐 `generateToken(userId)`
- 🍪 `sendToken(user, res)` → sets JWT cookie

---

### 🧍 Models - `userModel.js`
Includes fields:
- `name`, `email`, `password`
- `verified`, `verifyOTP`, `verifyOTPExpireAt`
- `resetOTP`, `resetOTPExpireAt`

---

## 📦 Folder Structure (src)

Backend/
├── config/
│ └── db.js
├── controller/
│ ├── auth.controller.js
│ └── todo.controller.js
├── docs/
│ └── swagger.js
├── middleware/
│ ├── authMiddleware.js
│ ├── errorHandling.js
│ └── rateLimiter.js
├── models/
│ ├── userModel.js
│ └── todoModel.js
├── router/
│ ├── auth.route.js
│ └── todo.route.js
├── utils/
│ └── sendOTP.js
├── .env
├── server.js

