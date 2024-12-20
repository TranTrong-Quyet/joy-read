import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const platform = os.platform();
let appDataPath;

// Set the app data path based on the platform
if (platform === "win32") {
  appDataPath = path.join(os.homedir(), "AppData", "Local", "JoyRead");
} else if (platform === "darwin") {
  // macOS uses ~/Library/Application Support for app data
  appDataPath = path.join(
    os.homedir(),
    "Library",
    "Application Support",
    "JoyRead"
  );
} else {
  // Default fallback,  for Linux or other platforms
  appDataPath = path.join(os.homedir(), "MyApp");
}

// Ensure the folder exists
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

// Define the database file path
const dbFilePath = `file:${path
  .join(appDataPath, "joyread-sqlite.db")
  .replace(/\\/g, "/")}`;

// Define the path to the .env file
const envFilePath = path.join(__dirname, "../.env");

// Check if the .env file exists
if (fs.existsSync(envFilePath)) {
  const envContent = fs.readFileSync(envFilePath, "utf8");

  // Check if DATABASE_URL is already set
  if (!envContent.includes("DATABASE_URL=")) {
    const notice = `\n# This variable is auto-generated by setup-database.js. Do not change anything in this file\nDATABASE_URL="${dbFilePath}"\n`;
    fs.appendFileSync(envFilePath, notice, "utf8");
    console.log(`DATABASE_URL added to .env file: ${dbFilePath}`);
  } else {
    console.log("DATABASE_URL is set up. No change made to .env file");
  }
} else {
  // Create the .env file and add DATABASE_URL with a notice
  const notice = `# This file is auto-generated by setup-database.js\nDATABASE_URL="${dbFilePath}"\n`;
  fs.writeFileSync(envFilePath, notice, "utf8");
  console.log(`.env file created with DATABASE_URL: ${dbFilePath}`);
}
