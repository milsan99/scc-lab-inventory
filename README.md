# ICT Lab Inventory Management App

This is a modern, responsive web application built with Next.js and Prisma for managing ICT Lab inventory.

## Prerequisites
To run this application on any computer, you will need:
- **Node.js**: Download and install it from [nodejs.org](https://nodejs.org/). (Version 18 or higher is recommended)

## Installation Guide (For a New Computer)

### 1. Copy the Project Files
Copy the entire `ict_inventory` folder to your target computer via a USB drive or local network. 

*(Optional but recommended: To save space during the transfer, you can delete the `node_modules` and `.next` folders before copying. They will be regenerated in Step 3).*

### 2. Open the Terminal
Open your terminal (or PowerShell/Command Prompt on Windows) and navigate into the `ict_inventory` folder.
```bash
cd path\to\ict_inventory
```

### 3. Install Dependencies
Run the following command to download all necessary libraries:
```bash
npm install
```

### 4. Database Setup
The application uses a local SQLite database (`prisma/dev.db`). 
- **If you copied the existing `dev.db` file**: Your data (including the admin accounts, settings, and inventory) is already intact!
- **If you want a fresh database**: Delete the `prisma/dev.db` file if it exists, then run:
  ```bash
  npx prisma db push
  ```

### 5. Build for Production
Create an optimized production build of the application:
```bash
npm run build
```

### 6. Start the Server
Start the production server:
```bash
npm start
```

### 7. Access the App
Open a web browser and go to:
[http://localhost:3000](http://localhost:3000)

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
