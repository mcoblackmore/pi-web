#!/usr/bin/env node
"use strict";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parseArgs } = require("util");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const readline = require("readline");

const pkgDir = path.join(__dirname, "..");
const nextDir = path.join(pkgDir, ".next");
const usersFile = path.join(pkgDir, "data", "users.json");

// Check subcommand
const subCmd = process.argv[2];

if (subCmd === "add-user") {
  runAddUser();
  process.exit(0);
}

if (subCmd === "list-users") {
  runListUsers();
  process.exit(0);
}

if (subCmd === "remove-user") {
  runRemoveUser();
  process.exit(0);
}

// ---------- Default: start server ----------

// Resolve next's CLI entry directly to avoid relying on .bin symlinks (which
// may not exist when installed via npx).
let nextBin;
try {
  nextBin = require.resolve("next/dist/bin/next", { paths: [pkgDir] });
} catch {
  // Fallback: locate next package root and derive the bin path manually.
  try {
    const nextPkg = require.resolve("next/package.json", { paths: [pkgDir] });
    nextBin = path.join(path.dirname(nextPkg), "dist", "bin", "next");
  } catch {
    nextBin = path.join(pkgDir, "node_modules", "next", "dist", "bin", "next");
  }
}

const { values: cliArgs } = parseArgs({
  options: {
    port:     { type: "string", short: "p" },
    hostname: { type: "string", short: "H" },
  },
  strict: false,
});

const port     = cliArgs.port     ?? process.env.PORT     ?? "30141";
const hostname = cliArgs.hostname ?? process.env.HOSTNAME ?? null;

if (!fs.existsSync(nextDir)) {
  console.error("Build artifacts not found. Please report this issue.");
  process.exit(1);
}

const nextArgs = ["start", "-p", port];
if (hostname) nextArgs.push("-H", hostname);

// Always run next's JS entry with node directly — avoids .bin symlink issues
// and path-with-spaces problems on Windows when shell: true is used.
const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  cwd: pkgDir,
  stdio: ["inherit", "pipe", "inherit"],
  env: { ...process.env },
});

let browserOpened = false;
const url = `http://${hostname ?? "localhost"}:${port}`;

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  if (!browserOpened && text.includes("Ready")) {
    browserOpened = true;
    const isWindows = process.platform === "win32";
    const isMac = process.platform === "darwin";
    const openCmd = isWindows ? "start" : isMac ? "open" : "xdg-open";
    spawn(openCmd, [url], { shell: isWindows, stdio: "ignore", detached: true }).unref();
  }
});

child.on("exit", (code) => process.exit(code ?? 0));

// ---------- Subcommand: add-user ----------

function runAddUser() {
  const username = process.argv[3];
  const password = process.argv[4];

  if (!username || !password) {
    console.error("Usage: pi-web add-user <username> <password>");
    process.exit(1);
  }

  let bcrypt;
  try {
    bcrypt = require("bcryptjs");
  } catch {
    console.error("Cannot find bcryptjs. Please run: npm install bcryptjs");
    process.exit(1);
  }

  const hash = bcrypt.hashSync(password, 10);

  let users = {};
  if (fs.existsSync(usersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    } catch {
      console.error("Warning: users.json is corrupted, starting fresh.");
      users = {};
    }
  }

  if (users[username]) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`User "${username}" already exists. Overwrite? (y/N) `, (answer) => {
      rl.close();
      if (answer.toLowerCase() === "y") {
        doAdd();
      } else {
        console.log("Cancelled.");
        process.exit(0);
      }
    });
  } else {
    doAdd();
  }

  function doAdd() {
    users[username] = hash;
    fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2) + "\n", "utf8");
    console.log(`User "${username}" added successfully.`);
    process.exit(0);
  }
}

// ---------- Subcommand: list-users ----------

function runListUsers() {
  if (!fs.existsSync(usersFile)) {
    console.log("No users configured.");
    process.exit(0);
  }

  let users;
  try {
    users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch {
    console.error("Error reading users.json");
    process.exit(1);
  }

  const names = Object.keys(users).sort();
  if (names.length === 0) {
    console.log("No users configured.");
  } else {
    console.log(`Users (${names.length} total):`);
    names.forEach((name) => console.log(`  - ${name}`));
  }
  process.exit(0);
}

// ---------- Subcommand: remove-user ----------

function runRemoveUser() {
  const username = process.argv[3];

  if (!username) {
    console.error("Usage: pi-web remove-user <username>");
    process.exit(1);
  }

  if (!fs.existsSync(usersFile)) {
    console.error("No users configured.");
    process.exit(1);
  }

  let users;
  try {
    users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch {
    console.error("Error reading users.json");
    process.exit(1);
  }

  if (!users[username]) {
    console.error(`User "${username}" not found.`);
    process.exit(1);
  }

  delete users[username];
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2) + "\n", "utf8");
  console.log(`User "${username}" removed.`);
  process.exit(0);
}
