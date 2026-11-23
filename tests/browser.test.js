const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright-core");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = "http://127.0.0.1:3100";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const FIXTURES = path.join(__dirname, "fixtures");
const ARTIFACTS = path.join(__dirname, "artifacts");

function pass(name) {
  console.log(`PASS ${name}`);
}

async function waitForServer(url, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("Local test server did not start.");
}

(async () => {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const server = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: "3100" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let browser;
  const pageErrors = [];
  try {
    await waitForServer(BASE_URL);
    const launchOptions = fs.existsSync(CHROME) ? { executablePath: CHROME, headless: true } : { headless: true };
    browser = await chromium.launch(launchOptions);
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => Boolean(window.ALCO_MODEL && window.bootstrap));

    await page.locator("#packageLibrary").getByText("Meta Ads + Scalev", { exact: true }).waitFor();
    assert.match(await page.locator("#mainViewContainer").innerText(), /Continue Last Setup/i);
    pass("home renders Continue Last Setup and package grid");

    await page.locator("#packageLibrary").getByText("Meta Ads + Scalev", { exact: true }).click();
    await page.getByText("Daftar Panduan", { exact: true }).waitFor();
    assert.match(await page.locator(".breadcrumb-row").innerText(), /Beranda\s*\/\s*Meta Ads \+ Scalev/);
    pass("package detail breadcrumb and guide list");

    await page.locator("#mainViewContainer").getByText("Meta Ads Setup", { exact: true }).click();
    await page.getByText("Daftar Tahapan (Stages)", { exact: true }).waitFor();
    assert.match(await page.locator(".breadcrumb-row").innerText(), /Beranda\s*\/\s*Meta Ads \+ Scalev\s*\/\s*Meta Ads Setup/);
    pass("guide detail breadcrumb and stages");

    await page.locator(".step-item-card").first().click();
    await page.locator("#stepModalBackdrop:not(.d-none)").waitFor();
    assert.equal(await page.locator("#btnBackToGuide").isVisible(), true);
    const openedStepTitle = await page.locator("#stepTitle").innerText();
    await page.locator("#stepVerificationCheckbox").check();
    await page.locator("#btnBackToGuide").click();
    await page.getByText("Daftar Tahapan (Stages)", { exact: true }).waitFor();
    pass("step viewer back navigation and auto-saved verification");

    await page.reload({ waitUntil: "networkidle" });
    await page.getByText("Continue Last Setup", { exact: false }).waitFor();
    assert.match(await page.locator("#heroCard").innerText(), new RegExp(openedStepTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    pass("refresh resumes last opened step");

    await page.setInputFiles("#packageImportFileInput", path.join(FIXTURES, "new-package.json"));
    await page.locator("#importPreviewModal.show").waitFor();
    assert.match(await page.locator("#importPreviewContent").innerText(), /Testing Package[\s\S]*1[\s\S]*Guide/);
    await page.locator("#btnConfirmPackageImport").click();
    await page.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await page.getByRole("heading", { name: "Testing Package", exact: true }).waitFor();
    pass("new package import preview and non-destructive merge");

    await page.locator("#mainViewContainer").getByText("Testing Guide", { exact: true }).click();
    await page.locator(".step-item-card").first().click();
    await page.locator("#stepVerificationCheckbox").check();
    await page.locator("#btnBackToGuide").click();
    const backupJson = await page.evaluate(() => JSON.stringify(ALCO_MODEL.createBackup(appState.contentStore, appState.progressStore, {
      globalNotes,
      customShortcuts: appState.customShortcuts
    }), null, 2));
    const backupPath = path.join(ARTIFACTS, "runtime-backup.json");
    fs.writeFileSync(backupPath, backupJson);

    await page.setInputFiles("#packageImportFileInput", path.join(FIXTURES, "update-package.json"));
    await page.locator("#importPreviewModal.show").waitFor();
    assert.equal(await page.locator("#btnConfirmPackageImport").innerText(), "Update Paket");
    await page.locator("#btnConfirmPackageImport").click();
    await page.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await page.getByRole("heading", { name: "Testing Package Updated", exact: true }).waitFor();
    assert.match(await page.locator("#mainViewContainer").innerText(), /1\/1 Langkah \(100%\)/);
    pass("same-ID package update preserves progress");

    await page.setInputFiles("#packageImportFileInput", path.join(FIXTURES, "legacy-panduan.json"));
    await page.locator("#importPreviewModal.show").waitFor();
    assert.match(await page.locator("#importPreviewContent").innerText(), /format legacy/i);
    await page.locator("#btnConfirmPackageImport").click();
    await page.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await page.getByRole("heading", { name: "Legacy Import", exact: true }).waitFor();
    pass("legacy panduan import conversion");

    let invalidDialog = "";
    page.once("dialog", async dialog => {
      invalidDialog = dialog.message();
      await dialog.accept();
    });
    await page.setInputFiles("#packageImportFileInput", path.join(FIXTURES, "invalid.json"));
    await page.waitForTimeout(250);
    assert.match(invalidDialog, /Import paket ditolak/);
    pass("invalid import rejected without state mutation");

    const restoreDialogs = [];
    const restoreHandler = async dialog => {
      restoreDialogs.push(dialog.message());
      await dialog.accept();
    };
    page.on("dialog", restoreHandler);
    await page.setInputFiles("#restoreBackupFileInput", backupPath);
    await page.waitForFunction(() => !document.body.innerText.includes("Legacy Import"));
    page.off("dialog", restoreHandler);
    assert.ok(restoreDialogs.some(message => /Restore backup akan mengganti/.test(message)));
    assert.ok(restoreDialogs.some(message => /berhasil direstore/.test(message)));
    pass("full backup restore is separate and restores prior state");

    await page.reload({ waitUntil: "networkidle" });
    const swStatus = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return { ready: false, caches: [] };
      await navigator.serviceWorker.ready;
      const cacheKeys = await caches.keys();
      return {
        ready: true,
        caches: cacheKeys,
        hasCreatePackageTemplate: typeof window.ALCO_MODEL?.createPackageTemplate === "function"
      };
    });
    assert.equal(swStatus.ready, true);
    assert.equal(swStatus.hasCreatePackageTemplate, true);
    assert.ok(swStatus.caches.includes("alco-flow-v2-packages-v3"));
    assert.equal(swStatus.caches.includes("alco-flow-v2-packages-v2"), false);
    assert.equal(swStatus.caches.includes("alco-flow-v2-packages-v1"), false);
    pass("service worker registers with V3 assets and latest ALCO_MODEL");

    await page.setInputFiles("#packageImportFileInput", path.join(FIXTURES, "legacy-panduan.json"));
    await page.locator("#importPreviewModal.show").waitFor();
    await page.locator("#btnConfirmPackageImport").click();
    await page.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await page.getByRole("heading", { name: "Legacy Import", exact: true }).waitFor();
    await page.locator("#btnManageData").click();
    await page.locator("#managementDrawer.show").waitFor();
    assert.equal(await page.locator('[data-custom-package-id="meta-ads-scalev"]').count(), 0);
    const deleteRow = page.locator('[data-custom-package-id="package-legacy-import"]');
    await deleteRow.waitFor();
    let deleteDialogMsg = "";
    page.once("dialog", async dialog => {
      deleteDialogMsg = dialog.message();
      await dialog.accept();
    });
    await deleteRow.locator(".btn-delete-custom-package").click();
    await page.locator("#packageLibrary").waitFor();
    assert.match(deleteDialogMsg, /Legacy Import/);
    assert.equal(await page.locator("#packageLibrary").getByText("Legacy Import").count(), 0);
    assert.equal(await page.locator('[data-custom-package-id="package-legacy-import"]').count(), 0);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#packageLibrary").getByText("Legacy Import").count(), 0);
    assert.equal(await page.locator("#packageLibrary").getByText("Meta Ads + Scalev").count(), 1);
    const builtInCardText = await page.locator("#packageLibrary .guide-card", { hasText: "Meta Ads + Scalev" }).innerText();
    assert.match(builtInCardText, /1%|\d+%/);
    assert.ok(!builtInCardText.includes("0/"), "built-in package progress must remain preserved");
    await page.locator("#btnManageData").click();
    await page.locator("#managementDrawer.show").waitFor();
    assert.equal(await page.locator('[data-custom-package-id="package-legacy-import"]').count(), 0);
    await page.locator("#managementDrawer .btn-close").click();
    await page.locator("#managementDrawer").waitFor({ state: "hidden" });
    pass("custom package import, delete confirmation, home redirect, Kelola removal, and reload persistence");

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.screenshot({ path: path.join(ARTIFACTS, "desktop-home.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.screenshot({ path: path.join(ARTIFACTS, "mobile-home.png"), fullPage: true });
    pass("desktop and mobile render without horizontal overflow");

    await page.locator("#packageLibrary").getByText("Meta Ads + Scalev", { exact: true }).click();
    await page.locator("#mainViewContainer").getByText("Meta Ads Setup", { exact: true }).click();
    await page.locator(".step-item-card").first().click();
    await page.locator("#stepModalBackdrop:not(.d-none)").waitFor();
    const modalFitsMobile = await page.locator("#stepModalContainer").evaluate(element => {
      const rect = element.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= window.innerWidth && rect.width <= window.innerWidth;
    });
    assert.equal(modalFitsMobile, true);
    assert.equal(await page.locator("#btnBackToGuide").isVisible(), true);
    await page.screenshot({ path: path.join(ARTIFACTS, "mobile-step-viewer.png"), fullPage: true });
    pass("mobile step viewer fits viewport and exposes back navigation");

    assert.deepEqual(pageErrors, []);
    pass("no uncaught browser page errors");
    await context.close();
    console.log("All browser tests passed.");
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
