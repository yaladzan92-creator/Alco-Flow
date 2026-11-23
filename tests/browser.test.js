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
    assert.ok(swStatus.caches.includes("alco-flow-v2-packages-v4"));
    assert.equal(swStatus.caches.includes("alco-flow-v2-packages-v3"), false);
    assert.equal(swStatus.caches.includes("alco-flow-v2-packages-v2"), false);
    assert.equal(swStatus.caches.includes("alco-flow-v2-packages-v1"), false);
    pass("service worker registers with V4 assets and latest ALCO_MODEL");

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
    const deleteBtn = deleteRow.locator(".btn-delete-custom-package");
    assert.equal(await deleteBtn.getAttribute("onclick"), null);

    await deleteBtn.locator("i").click();
    await page.locator("#deletePackageModal.show").waitFor();
    assert.match(await page.locator("#deletePackageNameTarget").innerText(), /Legacy Import/);
    await page.locator("#btnCancelDeletePackage").click();
    await page.locator("#deletePackageModal").waitFor({ state: "hidden" });
    assert.equal(await page.locator('[data-custom-package-id="package-legacy-import"]').count(), 1);

    await deleteBtn.locator("i").click();
    await page.locator("#deletePackageModal.show").waitFor();
    await page.locator("#btnConfirmDeletePackage").click();
    await page.locator("#deletePackageModal").waitFor({ state: "hidden" });
    await page.locator("#packageLibrary").waitFor();
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
    pass("custom package import, Bootstrap delete modal (Batal/Hapus Paket), home redirect, Kelola removal, and reload persistence");

    const sandboxPage = await context.newPage();
    const sandboxDialogConsoleMessages = [];
    sandboxPage.on("pageerror", error => pageErrors.push(error.message));
    sandboxPage.on("console", msg => {
      const text = msg.text();
      if (/allow-modals|Ignored call to '(confirm|alert|prompt)'|sandboxed/i.test(text)) {
        sandboxDialogConsoleMessages.push(text);
      }
    });
    await sandboxPage.goto(`${BASE_URL}/api/health`);
    await sandboxPage.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0;">
          <iframe id="appFrame" sandbox="allow-scripts allow-same-origin" src="${BASE_URL}/index.html" style="width:100vw;height:100vh;border:0;"></iframe>
        </body>
      </html>
    `);
    const frame = sandboxPage.frameLocator("#appFrame");
    await frame.locator("#packageLibrary").getByText("Meta Ads + Scalev", { exact: true }).waitFor();
    await frame.locator("#packageImportFileInput").setInputFiles(path.join(FIXTURES, "legacy-panduan.json"));
    await frame.locator("#importPreviewModal.show").waitFor();
    await frame.locator("#btnConfirmPackageImport").click();
    await frame.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await frame.getByRole("heading", { name: "Legacy Import", exact: true }).waitFor();

    await frame.locator("#btnManageData").click();
    await frame.locator("#managementDrawer.show").waitFor();
    const sandboxDeleteBtn = frame.locator('[data-custom-package-id="package-legacy-import"] .btn-delete-custom-package');
    await sandboxDeleteBtn.locator("i").click();
    await frame.locator("#deletePackageModal.show").waitFor();
    assert.match(await frame.locator("#deletePackageNameTarget").innerText(), /Legacy Import/);
    await frame.locator("#btnCancelDeletePackage").click();
    await frame.locator("#deletePackageModal").waitFor({ state: "hidden" });
    assert.equal(await frame.locator('[data-custom-package-id="package-legacy-import"]').count(), 1);

    await sandboxDeleteBtn.locator("i").click();
    await frame.locator("#deletePackageModal.show").waitFor();
    await frame.locator("#btnConfirmDeletePackage").click();
    await frame.locator("#deletePackageModal").waitFor({ state: "hidden" });
    await frame.locator("#packageLibrary").waitFor();
    assert.equal(await frame.locator("#packageLibrary").getByText("Legacy Import").count(), 0);

    await sandboxPage.locator("#appFrame").evaluate(iframe => {
      iframe.src = iframe.src;
    });
    await frame.locator("#packageLibrary").getByText("Meta Ads + Scalev", { exact: true }).waitFor();
    assert.equal(await frame.locator("#packageLibrary").getByText("Legacy Import").count(), 0);
    await frame.locator("#btnManageData").click();
    await frame.locator("#managementDrawer.show").waitFor();
    assert.equal(await frame.locator('[data-custom-package-id="package-legacy-import"]').count(), 0);
    await frame.locator("#managementDrawer .btn-close").click();
    await frame.locator("#managementDrawer").waitFor({ state: "hidden" });
    assert.deepEqual(sandboxDialogConsoleMessages, []);
    pass("sandboxed iframe without allow-modals supports Bootstrap delete modal without blocked-dialog console errors");

    const oneByOnePng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64"
    );
    await context.route("https://visual.example.test/**", async route => {
      if (route.request().url().endsWith("/valid.png")) {
        await route.fulfill({ status: 200, contentType: "image/png", body: oneByOnePng });
      } else {
        await route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" });
      }
    });

    const visualFixturePath = path.join(ARTIFACTS, "visual-guide-package.json");
    fs.writeFileSync(visualFixturePath, JSON.stringify({
      type: "alco-flow-package",
      schemaVersion: 2,
      package: {
        id: "visual-guide-pkg",
        version: "1.0.0",
        title: "Visual Guide Test Package",
        description: "Pengujian gambar tutorial opsional.",
        guideRefs: ["visual-guide"]
      },
      guides: [{
        id: "visual-guide",
        version: "1.0.0",
        title: "Visual Guide Setup",
        stages: [{
          id: "visual-stage",
          title: "Tahap Visual",
          steps: [
            {
              id: "step-no-image",
              title: "Step Tanpa Gambar",
              instructions: ["Baca instruksi tanpa gambar."]
            },
            {
              id: "step-valid-image",
              title: "Step Gambar Valid",
              instructions: ["Perhatikan tombol Buat pada gambar."],
              visualGuide: {
                screenTitle: "Meta Ads Manager <safe>",
                imageUrl: "https://visual.example.test/valid.png",
                imageCaption: "Contoh caption <img src=x onerror=alert(1)>",
                highlightTargets: "Tombol Buat",
                annotationInstructions: "Klik tombol Buat",
                referenceUrl: "https://adsmanager.facebook.com/",
                imageStatus: "verified"
              }
            },
            {
              id: "step-null-image",
              title: "Step Image Null",
              instructions: ["Instruksi dengan imageUrl null."],
              visualGuide: {
                screenTitle: "Pending Screenshot",
                imageUrl: null,
                imageCaption: "Belum tersedia",
                imageStatus: "pending"
              }
            },
            {
              id: "step-unsafe-url",
              title: "Step URL Berbahaya",
              instructions: ["URL berbahaya harus ditolak."],
              visualGuide: {
                screenTitle: "Dangerous",
                imageUrl: "javascript:alert(1)",
                imageCaption: "Harus tersembunyi"
              }
            },
            {
              id: "step-broken-image",
              title: "Step Gambar Gagal Dimuat",
              instructions: ["Instruksi tetap tampil walau gambar gagal dimuat."],
              visualGuide: {
                screenTitle: "Broken Screen",
                imageUrl: "https://visual.example.test/broken.png",
                imageCaption: "Gambar rusak"
              }
            }
          ]
        }]
      }]
    }, null, 2));

    await page.setInputFiles("#packageImportFileInput", visualFixturePath);
    await page.locator("#importPreviewModal.show").waitFor();
    await page.locator("#btnConfirmPackageImport").click();
    await page.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await page.locator("#mainViewContainer").getByText("Visual Guide Setup", { exact: true }).click();
    await page.locator(".step-item-card").first().click();
    await page.locator("#stepModalBackdrop:not(.d-none)").waitFor();

    // 1. Step without visualGuide
    assert.equal(await page.locator("#stepVisualGuideSection").evaluate(el => el.classList.contains("d-none")), true);

    // 2. Step with valid HTTPS image
    await page.locator("#btnStepModalNext").click();
    await page.locator("#stepVisualGuideSection:not(.d-none)").waitFor();
    assert.equal(await page.locator("#stepVisualGuideTitle").innerText(), "Meta Ads Manager <safe>");
    assert.equal(await page.locator("#stepVisualGuideCaption").innerText(), "Contoh caption <img src=x onerror=alert(1)>");
    assert.equal(await page.locator("#stepVisualGuideImg").getAttribute("loading"), "lazy");
    assert.equal(await page.locator("#stepVisualGuideImg").getAttribute("referrerpolicy"), "no-referrer");
    await page.waitForFunction(() => {
      const img = document.getElementById("stepVisualGuideImg");
      return Boolean(img && img.complete && img.naturalWidth > 0);
    });

    // Zoom modal open + Escape close + close button
    await page.locator("#btnZoomVisualGuide").click();
    await page.locator("#visualGuideZoomModal.show").waitFor();
    assert.equal(await page.locator("#visualGuideZoomImg").getAttribute("referrerpolicy"), "no-referrer");
    await page.keyboard.press("Escape");
    await page.locator("#visualGuideZoomModal").waitFor({ state: "hidden" });
    await page.locator("#btnZoomVisualGuide").click();
    await page.locator("#visualGuideZoomModal.show").waitFor();
    await page.locator("#btnCloseVisualGuideZoom").click();
    await page.locator("#visualGuideZoomModal").waitFor({ state: "hidden" });

    // 3. Step with imageUrl: null clears old image
    await page.locator("#btnStepModalNext").click();
    assert.equal(await page.locator("#stepVisualGuideSection").evaluate(el => el.classList.contains("d-none")), true);
    assert.equal(await page.locator("#stepVisualGuideImg").getAttribute("src"), null);

    // 4. Step with dangerous URL rejected
    await page.locator("#btnStepModalNext").click();
    assert.equal(await page.locator("#stepVisualGuideSection").evaluate(el => el.classList.contains("d-none")), true);
    assert.equal(await page.locator("#stepVisualGuideImg").getAttribute("src"), null);

    // 5. Step with broken HTTPS image shows brief error and keeps instructions visible
    await page.locator("#btnStepModalNext").click();
    await page.locator("#stepVisualGuideError:not(.d-none)").waitFor();
    assert.match(await page.locator("#stepInstructions").innerText(), /Instruksi tetap tampil walau gambar gagal dimuat/);

    // Moving back to step without image clears error and old image state
    await page.locator("#btnStepModalPrev").click();
    await page.locator("#btnStepModalPrev").click();
    await page.locator("#btnStepModalPrev").click();
    await page.locator("#btnStepModalPrev").click();
    assert.equal(await page.locator("#stepVisualGuideSection").evaluate(el => el.classList.contains("d-none")), true);
    assert.equal(await page.locator("#stepVisualGuideError").evaluate(el => el.classList.contains("d-none")), true);

    // Check desktop layout with visible image has no horizontal overflow
    await page.locator("#btnStepModalNext").click();
    await page.locator("#stepVisualGuideSection:not(.d-none)").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.locator("#btnCloseStepModal").click();
    await page.locator("#stepModalBackdrop").waitFor({ state: "hidden" });

    // Sandboxed iframe without allow-modals: zoom modal works with zero blocked-dialog console warnings
    await frame.locator("#packageImportFileInput").setInputFiles(visualFixturePath);
    await frame.locator("#importPreviewModal.show").waitFor();
    await frame.locator("#btnConfirmPackageImport").click();
    await frame.locator("#importPreviewModal").waitFor({ state: "hidden" });
    await frame.locator("#mainViewContainer").getByText("Visual Guide Setup", { exact: true }).click();
    await frame.locator(".step-item-card").nth(1).click();
    await frame.locator("#stepVisualGuideSection:not(.d-none)").waitFor();
    await frame.locator("#btnZoomVisualGuide").click();
    await frame.locator("#visualGuideZoomModal.show").waitFor();
    await frame.locator("#btnCloseVisualGuideZoom").click();
    await frame.locator("#visualGuideZoomModal").waitFor({ state: "hidden" });
    assert.deepEqual(sandboxDialogConsoleMessages, []);
    await sandboxPage.close();
    pass("optional tutorial images (valid, null, unsafe, broken, zoom, step-switch cleanup, and sandboxed iframe)");

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
    await page.locator("#btnCloseStepModal").click();
    await page.locator("#stepModalBackdrop").waitFor({ state: "hidden" });
    await page.getByText("Beranda", { exact: true }).click();
    await page.locator("#packageLibrary").getByText("Visual Guide Test Package", { exact: true }).click();
    await page.locator("#mainViewContainer").getByText("Visual Guide Setup", { exact: true }).click();
    await page.locator(".step-item-card").nth(1).click();
    await page.locator("#stepVisualGuideSection:not(.d-none)").waitFor();
    const mobileImageFits = await page.locator("#stepVisualGuideImg").evaluate(img => {
      const rect = img.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= window.innerWidth && document.documentElement.scrollWidth <= window.innerWidth;
    });
    assert.equal(mobileImageFits, true);
    pass("mobile step viewer fits viewport with tutorial image and exposes back navigation");

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
