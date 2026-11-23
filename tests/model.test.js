const assert = require("node:assert/strict");
const model = require("../data/model.js");

global.window = {};
require("../data/guides.js");

const defaultGuides = window.DEFAULT_GUIDES;

const pendingTests = [];

function run(name, fn) {
  try {
    const result = fn();
    if (result && typeof result.then === "function") {
      pendingTests.push(
        result.then(
          () => console.log(`PASS ${name}`),
          (error) => {
            console.error(`FAIL ${name}`);
            throw error;
          }
        )
      );
      return;
    }
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("default content migrates built-in guides into Meta Ads + Scalev", () => {
  const store = model.createDefaultContentStore(defaultGuides);
  assert.equal(store.packages.length, 1);
  assert.equal(store.packages[0].id, "meta-ads-scalev");
  assert.equal(store.packages[0].title, "Meta Ads + Scalev");
  assert.deepEqual(store.packages[0].guideRefs, defaultGuides.map(guide => guide.id));
  assert.equal(model.validateContentStore(store).valid, true);
});

run("new package import is validated and merged without replacing existing packages", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const parsed = model.parsePackageImport({
    package: { id: "new-package", version: "1.0.0", title: "Paket Baru", guideRefs: ["new-guide"] },
    guides: [{
      id: "new-guide",
      version: "1.0.0",
      title: "Panduan Baru",
      stages: [{ id: "new-stage", title: "Tahap Baru", steps: [{ id: "new-step", title: "Langkah Baru" }] }]
    }]
  }, "new-package.json");
  const merged = model.mergePackage(base, parsed, "add");
  assert.equal(merged.packages.length, 2);
  assert.equal(merged.guides.length, defaultGuides.length + 1);
  assert.ok(merged.packages.some(pkg => pkg.id === "meta-ads-scalev"));
  assert.ok(merged.packages.some(pkg => pkg.id === "new-package"));
});

run("package can share an existing guide reference without duplicating guide content", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const parsed = model.parsePackageImport({
    package: { id: "shared-package", version: "1.0.0", title: "Shared Package", guideRefs: ["meta-ads"] },
    guides: []
  }, "shared.json", base);
  const merged = model.mergePackage(base, parsed, "add");
  assert.equal(merged.packages.length, 2);
  assert.equal(merged.guides.length, defaultGuides.length);
  assert.deepEqual(merged.packages.find(pkg => pkg.id === "shared-package").guideRefs, ["meta-ads"]);
});

run("invalid package import is rejected before state mutation", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const snapshot = JSON.stringify(base);
  assert.throws(() => model.parsePackageImport({ package: { id: "broken", title: "Broken", guideRefs: ["missing"] }, guides: [] }), /guide|Minimal/i);
  assert.equal(JSON.stringify(base), snapshot);
});

run("same package id requires update and update preserves progress", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  let progress = model.emptyProgressStore();
  progress = model.setVerificationProgress(progress, "meta-ads", "meta-personal-account", true, "2026-01-01T00:00:00.000Z");
  const exported = model.exportPackage(base, "meta-ads-scalev");
  exported.package.version = "1.1.0";
  exported.guides[0].shortDescription = "Updated content";
  const parsed = model.parsePackageImport(exported, "update.json");
  assert.throws(() => model.mergePackage(base, parsed, "add"), /sudah ada/i);
  const updated = model.mergePackage(base, parsed, "update");
  assert.equal(updated.packages[0].version, "1.1.0");
  const hydrated = model.hydrateGuides(updated, progress);
  const step = hydrated[0].stages.flatMap(stage => stage.steps).find(item => item.id === "meta-personal-account");
  assert.equal(step.verification.checked, true);
});

run("legacy panduan is converted and its progress is migrated", () => {
  const legacy = {
    title: "Legacy Ads",
    panduan: {
      Setup: [{
        id: "legacy-guide",
        judul: "Legacy Guide",
        langkah: [{ id: "legacy-step", text: "Kerjakan setup", checked: true, catatan: "Catatan lama" }]
      }]
    }
  };
  const parsed = model.parsePackageImport(legacy, "legacy.json");
  assert.equal(parsed.legacy, true);
  assert.equal(parsed.contentStore.packages.length, 1);
  assert.equal(parsed.contentStore.guides[0].stages[0].steps[0].title, "Kerjakan setup");
  const hydrated = model.hydrateGuides(parsed.contentStore, parsed.progressStore);
  assert.equal(hydrated[0].stages[0].steps[0].verification.checked, true);
});

run("legacy app storage migrates content and notes into separate progress store", () => {
  const legacyGuides = JSON.parse(JSON.stringify(defaultGuides));
  legacyGuides[0].stages[0].steps[0].checklist[0].checked = true;
  legacyGuides[0].stages[0].steps[0].verification.checked = true;
  const migrated = model.migrateStoredData({
    guides: legacyGuides,
    stepNotes: { "meta-personal-account": "note migrated" }
  }, defaultGuides);
  assert.equal(migrated.migrated, true);
  const hydrated = model.hydrateGuides(migrated.contentStore, migrated.progressStore);
  const step = hydrated[0].stages[0].steps[0];
  assert.equal(step.checklist[0].checked, true);
  assert.equal(step.verification.checked, true);
  assert.equal(model.getStepNote(migrated.progressStore, "meta-ads", "meta-personal-account"), "note migrated");
  assert.equal(migrated.contentStore.guides[0].stages[0].steps[0].verification.checked, undefined);
});

run("package export round-trips and backup restore keeps progress", () => {
  const contentStore = model.createDefaultContentStore(defaultGuides);
  let progressStore = model.emptyProgressStore();
  progressStore = model.setStepNote(progressStore, "meta-ads", "meta-personal-account", "keep this");
  const packageExport = model.exportPackage(contentStore, "meta-ads-scalev");
  assert.equal(model.parsePackageImport(packageExport, "package.json").contentStore.packages[0].id, "meta-ads-scalev");
  const backup = model.createBackup(contentStore, progressStore, { globalNotes: [{ id: 1 }], customShortcuts: [{ title: "x", url: "https://x.test" }] });
  const restored = model.parseBackup(backup);
  assert.equal(model.getStepNote(restored.progressStore, "meta-ads", "meta-personal-account"), "keep this");
  assert.equal(restored.globalNotes.length, 1);
  assert.equal(restored.customShortcuts.length, 1);
});

run("package template uses v2 schema with 1 package, 1 guide, 1 stage, 1 complete step and passes parsePackageImport", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const template = model.createPackageTemplate();
  assert.equal(template.type, "alco-flow-package");
  assert.equal(template.schemaVersion, 2);
  assert.equal(template.guides.length, 1);
  assert.deepEqual(template.package.guideRefs, [template.guides[0].id]);
  assert.equal(template.guides[0].stages.length, 1);
  assert.equal(template.guides[0].stages[0].steps.length, 1);

  const step = template.guides[0].stages[0].steps[0];
  assert.ok(step.id && step.title && step.estimatedTime);
  assert.ok(step.objective && step.explanation && step.expectedResult);
  assert.ok(Array.isArray(step.instructions) && step.instructions.length > 0);
  assert.ok(Array.isArray(step.checklist) && step.checklist.length > 0);
  assert.ok(step.verification && step.verification.id && step.verification.text);
  assert.ok(Array.isArray(step.troubleshooting) && step.troubleshooting.length > 0);
  assert.ok(step.externalLink && step.externalLinkLabel);
  assert.ok(step.aiContext && step.aiContext.overview && step.aiContext.missingMenuTip && step.aiContext.fieldExamples && step.aiContext.errorSolutions && step.aiContext.verificationCheck);

  const parsedJson = JSON.parse(JSON.stringify(template));
  const candidate = model.parsePackageImport(parsedJson, "alco-flow-template-paket.json", base);
  assert.equal(candidate.legacy, false);
  assert.equal(candidate.warnings.length, 0);
  assert.equal(model.validateContentStore(candidate.contentStore).valid, true);

  const merged = model.mergePackage(base, candidate, "add");
  assert.equal(merged.packages.length, base.packages.length + 1);
  assert.equal(merged.guides.length, base.guides.length + 1);
  assert.equal(model.validateContentStore(merged).valid, true);
});

run("regression: latest index.html matches latest model API and sw.js uses network-first for app JS", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");

  const modelScriptMatch = html.match(/<script\s+src="(data\/model\.js(?:\?[^"]+)?)"><\/script>/);
  assert.ok(modelScriptMatch, "index.html must include data/model.js script tag");
  assert.ok(sw.includes(`"./${modelScriptMatch[1]}"`), "sw.js APP_ASSETS must precache the exact model.js URL used in index.html");
  assert.equal(sw.includes("alco-flow-v2-packages-v1"), false, "sw.js must bump cache version away from v1");
  assert.equal(sw.includes("alco-flow-v2-packages-v2"), false, "sw.js must bump cache version away from v2");
  assert.equal(sw.includes("alco-flow-v2-packages-v3"), false, "sw.js must bump cache version away from v3");
  assert.ok(sw.includes("alco-flow-v2-packages-v4"), "sw.js must use v4 cache version");
  assert.match(sw, /requestUrl\.pathname\.endsWith\("\.js"\)/, "sw.js must handle application JS requests explicitly");
  assert.match(sw, /isAppJsRequest[\s\S]*fetch\(event\.request\)[\s\S]*caches\.match\(event\.request\)/, "sw.js must use network-first with cache fallback for app JS");

  const modelRefs = [...html.matchAll(/ALCO_MODEL\.([A-Za-z0-9_]+)\s*\(/g)].map(match => match[1]);
  assert.ok(modelRefs.includes("createPackageTemplate"), "index.html must call ALCO_MODEL.createPackageTemplate");
  modelRefs.forEach(methodName => {
    assert.equal(typeof model[methodName], "function", `ALCO_MODEL.${methodName} called by index.html must exist on data/model.js`);
  });
});

run("regression: sw.js updates cache version, serves app JS network-first, and falls back to cache offline", async () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const vm = require("node:vm");
  const root = path.resolve(__dirname, "..");
  const swCode = fs.readFileSync(path.join(root, "sw.js"), "utf8");

  const listeners = {};
  const cacheStore = new Map([["alco-flow-v2-packages-v1", new Map([["https://app.test/data/model.js", { body: "old-v1" }]])]]);
  const ensureBucket = (name) => {
    if (!cacheStore.has(name)) cacheStore.set(name, new Map());
    const map = cacheStore.get(name);
    return {
      addAll: async (assets) => assets.forEach(a => map.set(new URL(a, "https://app.test/").href, { body: `precached:${a}` })),
      put: async (req, res) => map.set(typeof req === "string" ? req : req.url, res),
      match: async (req, opts) => {
        const url = typeof req === "string" ? req : req.url;
        if (map.has(url)) return map.get(url);
        if (opts?.ignoreSearch) {
          const clean = url.split("?")[0];
          for (const [k, v] of map.entries()) {
            if (k.split("?")[0] === clean) return v;
          }
        }
        return undefined;
      }
    };
  };

  let online = true;
  const sandbox = {
    URL,
    self: {
      location: { origin: "https://app.test" },
      addEventListener: (type, fn) => { listeners[type] = fn; },
      skipWaiting: () => {},
      clients: { claim: () => {} }
    },
    caches: {
      open: async (name) => ensureBucket(name),
      keys: async () => Array.from(cacheStore.keys()),
      delete: async (name) => cacheStore.delete(name),
      match: async (req, opts) => {
        const url = typeof req === "string" ? new URL(req, "https://app.test/").href : req.url;
        for (const name of cacheStore.keys()) {
          const hit = await ensureBucket(name).match(url, opts);
          if (hit) return hit;
        }
        return undefined;
      }
    },
    fetch: async (req) => {
      if (!online) throw new Error("Offline");
      const url = typeof req === "string" ? req : req.url;
      return { ok: true, body: `network:${url}`, clone() { return { ok: true, body: `network:${url}` }; } };
    }
  };
  vm.runInNewContext(swCode, sandbox);

  let installPromise;
  listeners.install({ waitUntil: (p) => { installPromise = p; } });
  await installPromise;

  let activatePromise;
  listeners.activate({ waitUntil: (p) => { activatePromise = p; } });
  await activatePromise;

  assert.equal(cacheStore.has("alco-flow-v2-packages-v1"), false, "old v1 cache must be deleted on activate");
  assert.equal(cacheStore.has("alco-flow-v2-packages-v4"), true, "new v4 cache must exist");

  const runFetch = (url, opts = {}) => {
    let responsePromise;
    listeners.fetch({
      request: {
        method: "GET",
        url,
        mode: opts.mode || "no-cors",
        destination: opts.destination || "",
        headers: { get: () => opts.accept || "" }
      },
      respondWith: (p) => { responsePromise = p; }
    });
    return responsePromise;
  };

  const onlineJs = await runFetch("https://app.test/data/model.js?v=3");
  assert.equal(onlineJs.body, "network:https://app.test/data/model.js?v=3");

  online = false;
  const offlineJs = await runFetch("https://app.test/data/model.js?v=3");
  assert.equal(offlineJs.body, "network:https://app.test/data/model.js?v=3");

  const offlineHtml = await runFetch("https://app.test/index.html", { mode: "navigate", accept: "text/html" });
  assert.equal(offlineHtml.body, "precached:./index.html");

  const externalImageHandled = await runFetch("https://cdn.example.test/tutorial.png", { destination: "image" });
  assert.equal(externalImageHandled, undefined, "external images must bypass sw.js cache and HTML fallback");
});

run("regression: deletePackage removes custom package and unreferenced guides while keeping progress", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const templateCandidate = model.parsePackageImport(model.createPackageTemplate(), "template.json", base);
  const withCustom = model.mergePackage(base, templateCandidate, "add");
  assert.equal(withCustom.packages.length, 2);
  assert.equal(withCustom.guides.length, defaultGuides.length + 1);

  let progress = model.emptyProgressStore();
  progress = model.setVerificationProgress(progress, "template-panduan-1", "template-langkah-1", true, "2026-11-22T00:00:00.000Z");
  progress = model.setStepNote(progress, "template-panduan-1", "template-langkah-1", "catatan tetap aman");

  const afterDelete = model.deletePackage(withCustom, "template-paket-baru");
  assert.equal(afterDelete.packages.length, 1);
  assert.equal(afterDelete.packages.some(pkg => pkg.id === "template-paket-baru"), false);
  assert.equal(afterDelete.guides.some(guide => guide.id === "template-panduan-1"), false);
  assert.equal(afterDelete.guides.length, defaultGuides.length);
  assert.equal(model.validateContentStore(afterDelete).valid, true);
  assert.equal(model.getStepNote(progress, "template-panduan-1", "template-langkah-1"), "catatan tetap aman");
  assert.equal(progress.steps[model.progressKey("template-panduan-1", "template-langkah-1")].completed, true);
});

run("regression: deletePackage preserves shared guide still referenced by another package", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const sharedCandidate = model.parsePackageImport({
    package: {
      id: "shared-and-exclusive",
      version: "1.0.0",
      title: "Shared & Exclusive",
      guideRefs: ["meta-ads", "exclusive-guide"]
    },
    guides: [{
      id: "exclusive-guide",
      version: "1.0.0",
      title: "Exclusive Guide",
      stages: [{ id: "stage-1", title: "Stage 1", steps: [{ id: "step-1", title: "Step 1" }] }]
    }]
  }, "shared.json", base);
  const withShared = model.mergePackage(base, sharedCandidate, "add");
  assert.equal(withShared.guides.length, defaultGuides.length + 1);

  const afterDelete = model.deletePackage(withShared, "shared-and-exclusive");
  assert.equal(afterDelete.packages.some(pkg => pkg.id === "shared-and-exclusive"), false);
  assert.equal(afterDelete.guides.some(guide => guide.id === "exclusive-guide"), false);
  assert.equal(afterDelete.guides.some(guide => guide.id === "meta-ads"), true);
  assert.equal(afterDelete.guides.length, defaultGuides.length);
  assert.equal(model.validateContentStore(afterDelete).valid, true);
});

run("regression: deletePackage protects built-in meta-ads-scalev package", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const snapshot = JSON.stringify(base);
  assert.throws(() => model.deletePackage(base, "meta-ads-scalev"), /tidak boleh dihapus/i);
  assert.throws(() => model.deletePackage(base, "non-existent-package"), /tidak ditemukan/i);
  assert.equal(JSON.stringify(base), snapshot);
});

run("regression: visualGuide metadata survives import/export/re-import and backup/restore including imageUrl null", () => {
  const base = model.createDefaultContentStore(defaultGuides);
  const visualPkg = {
    type: "alco-flow-package",
    schemaVersion: 2,
    package: {
      id: "visual-guide-pkg",
      version: "1.0.0",
      title: "Visual Guide Package",
      guideRefs: ["visual-guide"]
    },
    guides: [{
      id: "visual-guide",
      version: "1.0.0",
      title: "Panduan Visual",
      stages: [{
        id: "visual-stage",
        title: "Tahap Visual",
        steps: [
          {
            id: "step-with-image",
            title: "Langkah Dengan Gambar",
            instructions: ["Ikuti panduan."],
            visualGuide: {
              screenTitle: "Meta Ads Manager",
              imageUrl: "https://example.com/tutorial.png",
              imageCaption: "Contoh tampilan pembuatan kampanye",
              highlightTargets: "Tombol Buat",
              annotationInstructions: "Perhatikan tombol Buat",
              referenceUrl: "https://adsmanager.facebook.com/",
              imageStatus: "verified"
            }
          },
          {
            id: "step-null-image",
            title: "Langkah Image Null",
            instructions: ["Tanpa gambar."],
            visualGuide: {
              screenTitle: "Belum Ada Gambar",
              imageUrl: null,
              imageCaption: null,
              imageStatus: "pending"
            }
          }
        ]
      }]
    }]
  };

  const imported = model.parsePackageImport(visualPkg, "visual.json", base);
  const merged = model.mergePackage(base, imported, "add");
  const exported = model.exportPackage(merged, "visual-guide-pkg");
  const reimported = model.parsePackageImport(exported, "visual-exported.json", base);
  const reimportedSteps = reimported.contentStore.guides[0].stages[0].steps;
  assert.equal(reimportedSteps[0].id, "step-with-image");
  assert.deepEqual(reimportedSteps[0].visualGuide, visualPkg.guides[0].stages[0].steps[0].visualGuide);
  assert.equal(reimportedSteps[1].visualGuide.imageUrl, null);

  let progress = model.emptyProgressStore();
  progress = model.setStepNote(progress, "visual-guide", "step-with-image", "catatan visual");
  const backup = model.createBackup(merged, progress, { globalNotes: [], customShortcuts: [] });
  const restored = model.parseBackup(backup);
  const restoredGuide = restored.contentStore.guides.find(g => g.id === "visual-guide");
  assert.deepEqual(restoredGuide.stages[0].steps[0].visualGuide, visualPkg.guides[0].stages[0].steps[0].visualGuide);
  assert.equal(restoredGuide.stages[0].steps[1].visualGuide.imageUrl, null);
  assert.equal(model.getStepNote(restored.progressStore, "visual-guide", "step-with-image"), "catatan visual");
});

Promise.all(pendingTests).then(() => {
  console.log("All model tests passed.");
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
