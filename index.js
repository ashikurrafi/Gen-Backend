#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

function hasYesFlag(argv) {
  return argv.includes("--yes") || argv.includes("-y");
}

function copyTemplate(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`✗ Template file missing: ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function runCommand(command, stepName) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: "inherit", shell: true });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`✗ Error in ${stepName || "command"} (exit code ${code})`));
      } else {
        console.log(`✓ ${stepName}`);
        resolve();
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const autoYes = hasYesFlag(args);

  if (!autoYes) {
    console.log("Run 'gen-backend --yes' to initialize the project automatically.");
    return;
  }

  // Guard: avoid overwriting an existing project
  if (fs.existsSync(path.join(cwd, "src"))) {
    console.log("You have already created a project in this directory.");
    console.log("If you want to recreate the project, please clear the directory first.");
    process.exit(1);
  }

  try {
    console.log("");

    // Step 1: npm init
    await runCommand("npm init -y", "Project initialization  ... Done!");

    // Immediately set "type": "module" in the generated package.json
    const pkgPath = path.join(cwd, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.type = "module";
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log("✓ Set package.json type=module");
    console.log("");

    // Step 2: Install dependencies
    console.log("\nInstalling dependencies...");
    console.log("");
    await runCommand(
      "npm install cors dotenv express mongoose cookie-parser morgan",
      "Main dependencies ... Done!"
    );
    console.log("");
    console.log("");

    // Step 3: Install dev dependencies
    await runCommand("npm install -D nodemon", "Dev dependencies  ... Done!");
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
      fs.mkdirSync(path.join(cwd, dir), { recursive: true });
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
    filesToCopy.forEach(({ src, dest }) => {
      copyTemplate(path.join(libDir, src), path.join(cwd, dest));
    });

    // Step 6: Update package.json of the generated project
    console.log("Updating package.json ... Done!");
    const packageJsonPath = path.join(cwd, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // type already set earlier right after npm init
    packageJson.main = "src/server.js"; // actual entry in generated project
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: "nodemon src/server.js",
      start: "node src/server.js",
    };
    packageJson.engines = packageJson.engines || { node: ">=18" };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Step 7: Prompt user for config (like your original)
    console.log("\nConfiguration setup:");
    const rl = readline.createInterface({ input, output });
    const portNumber =
      (await rl.question("Enter port number [8000]: ")) || "8000";
    const dbName =
      (await rl.question("Enter database name [My_DB]: ")) || "My_DB";
    const dbURL =
      (await rl.question("Enter MongoDB URL [mongodb://0.0.0.0:27017]: ")) ||
      "mongodb://0.0.0.0:27017";
    rl.close();

    // Write .env
    const dotEnvPath = path.join(cwd, ".env");
    fs.writeFileSync(
      dotEnvPath,
      `SERVER_PORT=${portNumber}
MONGODB_URL=${dbURL}
DATABASE_NAME=${dbName}
`
    );

    console.log("\nProject setup complete! 🎉\n");
    console.log("You can now start your server with:\n");
    console.log("> npm run dev\n");
  } catch (error) {
    console.error("\nSetup failed:", error.message);
    process.exit(1);
  }
}

main();