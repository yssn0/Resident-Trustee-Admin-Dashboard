
# Resident-Trustee Admin Dashboard

A Next.js web application for monitoring and managing the Resident-Trustee Complaint Management App, designed for efficient resident-syndic complaint handling.

## Live Demo
Access the live demo at: [Verve Admin Website](https://verve-admin-website.vercel.app/)

**Access Credentials:**
- **Email:** verve@admin.com
- **Password:** @@Verve1

---

## Overview

The **Resident-Trustee Admin Website** is a comprehensive platform for administrators to manage resident claims and syndics’ responses, ensuring efficient communication and resolution. With a modern and user-friendly interface, the website integrates essential admin functionalities to streamline processes between residents and syndics.

## Features

- **User Management**
  - Create and manage user accounts
  - Handle access requests
  - Manage sponsorships
- **Complaint Management**
  - Track user complaints
  - Assign to syndics
  - Monitor resolution status
- **Notification System**
  - Send targeted notifications
  - Track notification history
- **Analytics Dashboard**
  - User statistics
  - Complaint analytics

---

### Core Technologies

- **Frontend & Backend**: Next.js with TypeScript — serves both the client interface and backend API routes for streamlined integration.
- **State Management**: Redux with React Hooks for efficient and centralized state handling across the admin dashboard.
- **Authentication**: Auth0 for secure user authentication and authorization.
- **Database & Sync**: MongoDB Realm for data storage and real-time synchronization, seamlessly integrated with the Verve App.
- **Styling**: Tailwind CSS for a responsive, consistent design across all devices.

--- 

## Getting Started

Follow these steps to set up the Verve Admin Website on your local machine.

### Prerequisites
- **Node.js**: v14.x or later
- **MongoDB Atlas & Realm Setup**: Ensure MongoDB Realm and Atlas are configured for data sync.
- **Auth0 Account**: Set up an Auth0 account to manage authentication.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yssn0/Resident-Trustee-Admin-Dashboard.git
   cd Resident-Trustee-Admin-Dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment variables:
   Create `.env.local` and add required variables
   ```bash
    REALM_API_KEY=your_realm_api_key
    NEXT_PUBLIC_REALM_APP_ID=your_realm_app_id
    AUTH0_SECRET=your_auth0_secret
    AUTH0_BASE_URL=your_auth0_base_url
    AUTH0_ISSUER_BASE_URL=your_auth0_issuer_url
    AUTH0_CLIENT_ID=your_auth0_client_id
    AUTH0_CLIENT_SECRET=your_auth0_client_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

---

## Setup Instructions

### MongoDB Realm Configuration
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.
2. Create a cluster and a Realm application.
3. Configure Realm sync to connect the Verve App database.

### Auth0 Configuration
1. Go to [Auth0](https://auth0.com/) and sign in.
2. Create a new Auth0 application for the admin website.
3. Copy the **Client ID** and **Domain** values to your `.env.local` file.

---

## Usage

Once the server is running:
1. Access the login page with demo credentials to explore the admin dashboard.
2. Use the dashboard to manage claims, users, and monitor real-time updates from the Verve App.

---
