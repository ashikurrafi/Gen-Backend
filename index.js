#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const data = require("prompt-sync")();

function copyTemplate(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`✗ Template file missing: ${src}`);
    process.exit(1);
  }
  fs.writeFileSync(dest, fs.readFileSync(src));
}

if (fs.existsSync("./src")) {
  console.log("You have already created a project in this directory.");
  console.log(
    "If you want to recreate the project, please clear the directory first."
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const autoYes = args.includes("--yes");

async function runCommand(command, stepName) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      let output = stdout + stderr;
      if (error) {
        console.error(`✗ Error in ${stepName || "command"}: ${output}`);
        reject(new Error(`Process exited with code ${error.code}`));
      } else {
        console.log(`✓ ${stepName}`);
        resolve(output);
      }
    });
  });
}

if (autoYes) {
  (async () => {
    try {
      console.log("");
      // Step 1: npm init
      await runCommand("npm init --yes", "Project initialization  ... Done!");
      console.log("");
      // Step 2: Install dependencies
      console.log("\nInstalling dependencies...");
      console.log("");
      await runCommand(
        "npm install cors dotenv express mongoose cookie-parser",
        "Main dependencies ... Done!"
      );
      console.log("");
      console.log("");
      // Step 3: Install dev dependencies
      await runCommand(
        "npm install --save-dev morgan nodemon",
        "Dev dependencies  ... Done!"
      );
      console.log("");
      // Step 4: Create directory structure
      console.log("\nCreating project structure  ... Done!");
      const directories = [
        "./src",
        "./src/config",
        "./src/controllers",
        "./src/middlewares",
        "./src/models",
        "./src/routes",
        "./src/services",
        "./src/utils",
        "./src/error",
      ];
      directories.forEach((dir) => {
        fs.mkdirSync(dir, { recursive: true });
      });
      console.log("");
      // Step 5: Copy template files
      console.log("Copying template files ... Done!");
      console.log("");
      const libDir = path.join(__dirname, "lib");
      const filesToCopy = [
        { src: "api.js", dest: "./src/routes/api.js" },
        { src: "apiError.js", dest: "./src/error/apiError.js" },
        { src: "apiResponse.js", dest: "./src/error/apiResponse.js" },
        { src: "app.js", dest: "./src/app.js" },
        { src: "asyncHandler.js", dest: "./src/error/asyncHandler.js" },
        { src: "db.js", dest: "./src/config/db.js" },
        { src: "index.js", dest: "./src/routes/index.js" },
        { src: "server.js", dest: "./src/server.js" },
        { src: ".env", dest: "./.env" },
      ];
      filesToCopy.forEach((file) => {
        copyTemplate(path.join(libDir, file.src), file.dest);
      });

      // Step 6: Update package.json
      console.log("Updating package.json ... Done!");
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      packageJson.main = "server.js";
      packageJson.scripts = {
        ...packageJson.scripts,
        dev: "nodemon src/server.js",
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Step 7: Get user input for .env and update
      console.log("\nConfiguration setup:");
      const portNumber = data("Enter port number [8000]: ") || "8000";
      const dbName = data("Enter database name [My_DB]: ") || "My_DB";
      const dbURL =
        data("Enter MongoDB URL [mongodb://0.0.0.0:27017]: ") ||
        "mongodb://0.0.0.0:27017";

      // Update .env file
      const dotEnv = path.join(process.cwd(), ".env");
      fs.writeFileSync(
        dotEnv,
        `SERVER_PORT = ${portNumber}\nMONGODB_URL = ${dbURL}\nDATABASE_NAME = ${dbName}\n`
      );

      console.log("\nProject setup complete! 🎉");
      console.log("");
      console.log("You can now start your server with:");
      console.log("");
      console.log("> npm run dev");
      console.log("");
      console.log("");
    } catch (error) {
      console.error("\nSetup failed:", error.message);
      process.exit(1);
    }
  })();
} else {
  console.log(
    "Run 'gen-backend --yes' to initialize the project automatically."
  );
}
