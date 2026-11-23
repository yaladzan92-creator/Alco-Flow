const assert = require("node:assert/strict");
const model = require("../data/model.js");

global.window = {};
require("../data/guides.js");

const defaultGuides = window.DEFAULT_GUIDES;

function run(name, fn) {
  try {
    fn();
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

console.log("All model tests passed.");
