(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ALCO_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const CONTENT_SCHEMA_VERSION = 2;
  const PROGRESS_SCHEMA_VERSION = 1;
  const DEFAULT_PACKAGE_ID = "meta-ads-scalev";

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function slugify(value, fallback = "item") {
    const slug = String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || fallback;
  }

  function stableId(prefix, value, index) {
    return `${prefix}-${slugify(value, String(index + 1))}`;
  }

  function normalizeChecklistItem(item, index) {
    if (typeof item === "string") {
      return { id: stableId("check", item, index), text: item };
    }
    return {
      id: String(item?.id || stableId("check", item?.text, index)),
      text: String(item?.text || `Checklist ${index + 1}`)
    };
  }

  function normalizeVerification(verification) {
    if (typeof verification === "string") {
      return { id: "verification", text: verification };
    }
    return {
      id: String(verification?.id || "verification"),
      text: String(verification?.text || "Konfigurasi langkah ini sudah dipastikan benar dan siap.")
    };
  }

  function normalizeStep(step, index, contextId) {
    const source = step || {};
    const id = String(source.id || stableId(`${contextId}-step`, source.title || source.text, index));
    const normalized = clone(source) || {};
    normalized.id = id;
    normalized.title = String(source.title || source.text || `Langkah ${index + 1}`);
    normalized.instructions = Array.isArray(source.instructions)
      ? source.instructions.map(String)
      : source.text ? [String(source.text)] : [];
    normalized.checklist = Array.isArray(source.checklist)
      ? source.checklist.map(normalizeChecklistItem)
      : [];
    normalized.verification = normalizeVerification(source.verification);
    delete normalized.checked;
    delete normalized.checkedAt;
    normalized.checklist.forEach(item => {
      delete item.checked;
      delete item.checkedAt;
    });
    delete normalized.verification.checked;
    delete normalized.verification.checkedAt;
    return normalized;
  }

  function normalizeStage(stage, index, guideId) {
    const source = stage || {};
    const id = String(source.id || stableId(`${guideId}-stage`, source.title, index));
    return {
      ...clone(source),
      id,
      title: String(source.title || `Tahap ${index + 1}`),
      description: String(source.description || ""),
      steps: Array.isArray(source.steps)
        ? source.steps.map((step, stepIndex) => normalizeStep(step, stepIndex, id))
        : []
    };
  }

  function normalizeGuide(guide, index) {
    const source = guide || {};
    const id = String(source.id || stableId("guide", source.title, index));
    return {
      ...clone(source),
      id,
      version: String(source.version || "1.0.0"),
      title: String(source.title || `Panduan ${index + 1}`),
      stages: Array.isArray(source.stages)
        ? source.stages.map((stage, stageIndex) => normalizeStage(stage, stageIndex, id))
        : []
    };
  }

  function normalizePackage(pkg, index) {
    const source = pkg || {};
    return {
      ...clone(source),
      id: String(source.id || stableId("package", source.title, index)),
      version: String(source.version || "1.0.0"),
      title: String(source.title || `Paket ${index + 1}`),
      description: String(source.description || ""),
      guideRefs: Array.isArray(source.guideRefs) ? source.guideRefs.map(String) : [],
      updatedAt: String(source.updatedAt || new Date(0).toISOString())
    };
  }

  function createContentStore(packages, guides) {
    return {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      packages: (packages || []).map(normalizePackage),
      guides: (guides || []).map(normalizeGuide)
    };
  }

  function createDefaultContentStore(defaultGuides) {
    const guides = (defaultGuides || []).map(normalizeGuide);
    return createContentStore([
      {
        id: DEFAULT_PACKAGE_ID,
        version: "1.0.0",
        title: "Meta Ads + Scalev",
        description: "Fondasi Meta Ads, setup Scalev, integrasi, tracking, dan tools pendukung.",
        badge: "Paket Bawaan",
        icon: "fa-brands fa-meta",
        guideRefs: guides.map(guide => guide.id),
        updatedAt: "2026-11-21T00:00:00.000Z"
      }
    ], guides);
  }

  function progressKey(guideId, stepId) {
    return `${guideId}::${stepId}`;
  }

  function emptyProgressStore() {
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      steps: {},
      lastOpened: null
    };
  }

  function extractProgressFromGuides(guides, legacyStepNotes) {
    const progress = emptyProgressStore();
    (guides || []).forEach(guide => {
      (guide.stages || []).forEach(stage => {
        (stage.steps || []).forEach(step => {
          const checklist = {};
          (step.checklist || []).forEach(item => {
            if (item.checked || item.checkedAt) {
              checklist[String(item.id)] = {
                checked: Boolean(item.checked),
                checkedAt: item.checkedAt || null
              };
            }
          });
          const verificationChecked = Boolean(step.verification?.checked);
          const note = legacyStepNotes?.[step.id] || "";
          if (Object.keys(checklist).length || verificationChecked || step.verification?.checkedAt || note) {
            progress.steps[progressKey(guide.id, step.id)] = {
              checklist,
              verification: {
                checked: verificationChecked,
                checkedAt: step.verification?.checkedAt || null
              },
              completed: verificationChecked,
              lastOpened: null,
              stepNotes: String(note)
            };
          }
        });
      });
    });
    return progress;
  }

  function normalizeProgressStore(progressStore) {
    const source = progressStore && typeof progressStore === "object" ? progressStore : {};
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      steps: source.steps && typeof source.steps === "object" ? clone(source.steps) : {},
      lastOpened: source.lastOpened && typeof source.lastOpened === "object" ? clone(source.lastOpened) : null
    };
  }

  function hydrateGuide(guide, progressStore) {
    const hydrated = normalizeGuide(guide, 0);
    const progress = normalizeProgressStore(progressStore);
    hydrated.stages.forEach(stage => {
      stage.steps.forEach(step => {
        const stepProgress = progress.steps[progressKey(hydrated.id, step.id)] || {};
        step.checklist = (step.checklist || []).map(item => ({
          ...item,
          checked: Boolean(stepProgress.checklist?.[item.id]?.checked),
          checkedAt: stepProgress.checklist?.[item.id]?.checkedAt || null
        }));
        step.verification = {
          ...normalizeVerification(step.verification),
          checked: Boolean(stepProgress.verification?.checked || stepProgress.completed),
          checkedAt: stepProgress.verification?.checkedAt || null
        };
      });
    });
    return hydrated;
  }

  function hydrateGuides(contentStore, progressStore) {
    return (contentStore?.guides || []).map(guide => hydrateGuide(guide, progressStore));
  }

  function ensureStepProgress(progressStore, guideId, stepId) {
    const key = progressKey(guideId, stepId);
    if (!progressStore.steps[key]) {
      progressStore.steps[key] = {
        checklist: {},
        verification: { checked: false, checkedAt: null },
        completed: false,
        lastOpened: null,
        stepNotes: ""
      };
    }
    return progressStore.steps[key];
  }

  function setChecklistProgress(progressStore, guideId, stepId, checklistId, checked, checkedAt) {
    const next = normalizeProgressStore(progressStore);
    const step = ensureStepProgress(next, guideId, stepId);
    step.checklist[String(checklistId)] = {
      checked: Boolean(checked),
      checkedAt: checked ? (checkedAt || new Date().toISOString()) : null
    };
    return next;
  }

  function setVerificationProgress(progressStore, guideId, stepId, checked, checkedAt) {
    const next = normalizeProgressStore(progressStore);
    const step = ensureStepProgress(next, guideId, stepId);
    step.verification = {
      checked: Boolean(checked),
      checkedAt: checked ? (checkedAt || new Date().toISOString()) : null
    };
    step.completed = Boolean(checked);
    return next;
  }

  function setStepNote(progressStore, guideId, stepId, note) {
    const next = normalizeProgressStore(progressStore);
    const step = ensureStepProgress(next, guideId, stepId);
    step.stepNotes = String(note || "");
    return next;
  }

  function markStepOpened(progressStore, packageId, guideId, stepId, openedAt) {
    const next = normalizeProgressStore(progressStore);
    const timestamp = openedAt || new Date().toISOString();
    const step = ensureStepProgress(next, guideId, stepId);
    step.lastOpened = timestamp;
    next.lastOpened = { packageId, guideId, stepId, openedAt: timestamp };
    return next;
  }

  function getStepNote(progressStore, guideId, stepId) {
    return String(progressStore?.steps?.[progressKey(guideId, stepId)]?.stepNotes || "");
  }

  function validateContentStore(contentStore, options = {}) {
    const errors = [];
    const warnings = [];
    const safeIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
    if (!contentStore || typeof contentStore !== "object") errors.push("Content store harus berupa object.");
    const packages = contentStore?.packages;
    const guides = contentStore?.guides;
    if (!Array.isArray(packages) || packages.length === 0) errors.push("Minimal satu package diperlukan.");
    if (!Array.isArray(guides) || (!options.allowEmptyGuides && guides.length === 0)) errors.push("Minimal satu guide diperlukan.");
    const packageIds = new Set();
    const guideIds = new Set();
    (packages || []).forEach((pkg, index) => {
      if (!pkg.id || !pkg.title) errors.push(`Package ke-${index + 1} tidak memiliki id/title.`);
      if (pkg.id && !safeIdPattern.test(pkg.id)) errors.push(`Package ID tidak aman: ${pkg.id}.`);
      if (packageIds.has(pkg.id)) errors.push(`Package ID duplikat: ${pkg.id}.`);
      packageIds.add(pkg.id);
      if (!Array.isArray(pkg.guideRefs) || pkg.guideRefs.length === 0) errors.push(`Package ${pkg.id || index + 1} tidak memiliki guideRefs.`);
    });
    (guides || []).forEach((guide, index) => {
      if (!guide.id || !guide.title) errors.push(`Guide ke-${index + 1} tidak memiliki id/title.`);
      if (guide.id && !safeIdPattern.test(guide.id)) errors.push(`Guide ID tidak aman: ${guide.id}.`);
      if (guideIds.has(guide.id)) errors.push(`Guide ID duplikat: ${guide.id}.`);
      guideIds.add(guide.id);
      if (!Array.isArray(guide.stages) || guide.stages.length === 0) errors.push(`Guide ${guide.id || index + 1} tidak memiliki stage.`);
      const stepIds = new Set();
      (guide.stages || []).forEach((stage, stageIndex) => {
        if (!stage.id || !stage.title) errors.push(`Stage ke-${stageIndex + 1} pada ${guide.id} tidak valid.`);
        if (stage.id && !safeIdPattern.test(stage.id)) errors.push(`Stage ID tidak aman: ${stage.id}.`);
        if (!Array.isArray(stage.steps) || stage.steps.length === 0) warnings.push(`Stage ${stage.id} tidak memiliki step.`);
        (stage.steps || []).forEach((step, stepIndex) => {
          if (!step.id || !step.title) errors.push(`Step ke-${stepIndex + 1} pada ${stage.id} tidak valid.`);
          if (step.id && !safeIdPattern.test(step.id)) errors.push(`Step ID tidak aman: ${step.id}.`);
          if (stepIds.has(step.id)) errors.push(`Step ID duplikat dalam guide ${guide.id}: ${step.id}.`);
          stepIds.add(step.id);
        });
      });
    });
    (packages || []).forEach(pkg => {
      (pkg.guideRefs || []).forEach(ref => {
        if (!guideIds.has(ref) && !options.allowedGuideRefs?.has(ref)) errors.push(`Package ${pkg.id} mereferensikan guide yang tidak tersedia: ${ref}.`);
      });
    });
    return { valid: errors.length === 0, errors, warnings };
  }

  function convertLegacyPanduan(imported, sourceName) {
    const panduan = imported?.panduan;
    if (!panduan || typeof panduan !== "object" || Array.isArray(panduan)) {
      throw new Error("Struktur legacy panduan tidak valid.");
    }
    const packageTitle = String(imported.title || imported.name || sourceName || "Paket Panduan Legacy").replace(/\.json$/i, "");
    const packageId = String(imported.id || stableId("package", packageTitle, 0));
    const guides = [];
    Object.entries(panduan).forEach(([folder, items], folderIndex) => {
      (Array.isArray(items) ? items : []).forEach((item, itemIndex) => {
        const guideTitle = item?.judul || item?.title || `${folder} ${itemIndex + 1}`;
        const guideId = String(item?.id || stableId("guide", `${folder}-${guideTitle}`, guides.length));
        const steps = (item?.langkah || item?.steps || []).map((legacyStep, stepIndex) => {
          const stepText = typeof legacyStep === "string" ? legacyStep : legacyStep?.text;
          const checked = Boolean(typeof legacyStep === "object" && legacyStep?.checked);
          return {
            id: String(legacyStep?.id || stableId(`${guideId}-step`, stepText, stepIndex)),
            title: String(stepText || `Langkah ${stepIndex + 1}`),
            instructions: stepText ? [String(stepText)] : [],
            explanation: String(legacyStep?.catatan || ""),
            externalLink: String(legacyStep?.link || ""),
            checklist: [{ id: "done", text: "Langkah ini sudah dilaksanakan", checked }],
            verification: { id: "verification", text: "Hasil langkah ini sudah diverifikasi", checked }
          };
        });
        guides.push({
          id: guideId,
          version: "1.0.0",
          title: String(guideTitle),
          shortDescription: `Hasil migrasi dari folder ${folder}.`,
          stages: [{
            id: stableId(`${guideId}-stage`, folder, folderIndex),
            title: String(folder),
            description: "Dikonversi dari format panduan legacy.",
            steps
          }]
        });
      });
    });
    if (!guides.length) throw new Error("File legacy tidak memiliki panduan yang dapat dikonversi.");
    const contentStore = createContentStore([{
      id: packageId,
      version: String(imported.version || "1.0.0"),
      title: packageTitle,
      description: "Paket hasil konversi format panduan legacy.",
      guideRefs: guides.map(guide => guide.id),
      updatedAt: new Date().toISOString()
    }], guides);
    return {
      contentStore,
      progressStore: extractProgressFromGuides(guides, {}),
      legacy: true
    };
  }

  function parsePackageImport(imported, sourceName, existingContentStore) {
    if (!imported || typeof imported !== "object" || Array.isArray(imported)) {
      throw new Error("File JSON harus berisi object paket.");
    }
    if (imported.panduan) return convertLegacyPanduan(imported, sourceName);

    let packages;
    let guides;
    if (imported.package && Array.isArray(imported.guides)) {
      packages = [imported.package];
      guides = imported.guides;
    } else if (Array.isArray(imported.packages) && Array.isArray(imported.guides)) {
      packages = imported.packages;
      guides = imported.guides;
    } else {
      throw new Error("Format paket tidak dikenali. Gunakan package + guides atau format legacy panduan.");
    }
    if (packages.length !== 1) throw new Error("Import Paket hanya menerima satu paket per file.");
    const contentStore = createContentStore(packages, guides);
    const allowedGuideRefs = new Set((existingContentStore?.guides || []).map(guide => guide.id));
    const validation = validateContentStore(contentStore, { allowEmptyGuides: true, allowedGuideRefs });
    if (!validation.valid) throw new Error(validation.errors.join(" "));
    return {
      contentStore,
      progressStore: normalizeProgressStore(imported.progressStore),
      legacy: false,
      warnings: validation.warnings
    };
  }

  function packageSummary(candidate, existingContentStore) {
    const pkg = candidate.contentStore.packages[0];
    const guideMap = new Map((existingContentStore?.guides || []).map(guide => [guide.id, guide]));
    candidate.contentStore.guides.forEach(guide => guideMap.set(guide.id, guide));
    const guides = pkg.guideRefs.map(ref => guideMap.get(ref)).filter(Boolean);
    const stages = guides.reduce((sum, guide) => sum + guide.stages.length, 0);
    const steps = guides.reduce((sum, guide) => sum + guide.stages.reduce((stageSum, stage) => stageSum + stage.steps.length, 0), 0);
    return {
      id: pkg.id,
      title: pkg.title,
      version: pkg.version,
      guideCount: guides.length,
      stageCount: stages,
      stepCount: steps,
      legacy: Boolean(candidate.legacy)
    };
  }

  function mergePackage(contentStore, candidate, mode) {
    const current = createContentStore(contentStore?.packages || [], contentStore?.guides || []);
    const incomingPackage = candidate.contentStore.packages[0];
    const conflictIndex = current.packages.findIndex(pkg => pkg.id === incomingPackage.id);
    if (conflictIndex >= 0 && mode !== "update") throw new Error(`Package ${incomingPackage.id} sudah ada.`);
    if (conflictIndex < 0 && mode === "update") throw new Error(`Package ${incomingPackage.id} belum ada untuk diperbarui.`);

    const incomingGuideIds = new Set(incomingPackage.guideRefs);
    const incomingGuides = candidate.contentStore.guides.filter(guide => incomingGuideIds.has(guide.id));
    const guideMap = new Map(current.guides.map(guide => [guide.id, guide]));
    incomingGuides.forEach(guide => guideMap.set(guide.id, normalizeGuide(guide, 0)));

    if (conflictIndex >= 0) current.packages[conflictIndex] = normalizePackage(incomingPackage, conflictIndex);
    else current.packages.push(normalizePackage(incomingPackage, current.packages.length));
    current.guides = Array.from(guideMap.values());
    const validation = validateContentStore(current);
    if (!validation.valid) throw new Error(validation.errors.join(" "));
    return current;
  }

  function mergeProgress(existing, incoming) {
    const next = normalizeProgressStore(existing);
    const source = normalizeProgressStore(incoming);
    Object.entries(source.steps).forEach(([key, value]) => {
      if (!next.steps[key]) next.steps[key] = clone(value);
    });
    return next;
  }

  function exportPackage(contentStore, packageId) {
    const pkg = contentStore?.packages?.find(item => item.id === packageId);
    if (!pkg) throw new Error("Package tidak ditemukan.");
    const refs = new Set(pkg.guideRefs || []);
    return {
      type: "alco-flow-package",
      schemaVersion: CONTENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      package: clone(pkg),
      guides: (contentStore.guides || []).filter(guide => refs.has(guide.id)).map(guide => normalizeGuide(guide, 0))
    };
  }

  function createBackup(contentStore, progressStore, extras) {
    return {
      type: "alco-flow-backup",
      schemaVersion: CONTENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      contentStore: createContentStore(contentStore?.packages || [], contentStore?.guides || []),
      progressStore: normalizeProgressStore(progressStore),
      globalNotes: Array.isArray(extras?.globalNotes) ? clone(extras.globalNotes) : [],
      customShortcuts: Array.isArray(extras?.customShortcuts) ? clone(extras.customShortcuts) : []
    };
  }

  function parseBackup(imported) {
    if (!imported || typeof imported !== "object") throw new Error("Backup harus berupa object JSON.");
    if (imported.contentStore) {
      const contentStore = createContentStore(imported.contentStore.packages, imported.contentStore.guides);
      const validation = validateContentStore(contentStore);
      if (!validation.valid) throw new Error(validation.errors.join(" "));
      return {
        contentStore,
        progressStore: normalizeProgressStore(imported.progressStore),
        globalNotes: Array.isArray(imported.globalNotes) ? clone(imported.globalNotes) : [],
        customShortcuts: Array.isArray(imported.customShortcuts) ? clone(imported.customShortcuts) : []
      };
    }
    if (Array.isArray(imported.guides)) {
      const contentStore = createDefaultContentStore(imported.guides);
      return {
        contentStore,
        progressStore: extractProgressFromGuides(imported.guides, imported.stepNotes || {}),
        globalNotes: Array.isArray(imported.globalNotes) ? clone(imported.globalNotes) : [],
        customShortcuts: Array.isArray(imported.customShortcuts) ? clone(imported.customShortcuts) : []
      };
    }
    throw new Error("Format backup tidak dikenali.");
  }

  function migrateStoredData(stored, defaultGuides) {
    if (stored?.contentStore) {
      const contentStore = createContentStore(stored.contentStore.packages, stored.contentStore.guides);
      const validation = validateContentStore(contentStore);
      if (!validation.valid) throw new Error(validation.errors.join(" "));
      return { contentStore, progressStore: normalizeProgressStore(stored.progressStore), migrated: false };
    }
    if (Array.isArray(stored?.guides) && stored.guides.length) {
      return {
        contentStore: createDefaultContentStore(stored.guides),
        progressStore: extractProgressFromGuides(stored.guides, stored.stepNotes || {}),
        migrated: true
      };
    }
    return {
      contentStore: createDefaultContentStore(defaultGuides || []),
      progressStore: emptyProgressStore(),
      migrated: false
    };
  }

  return {
    CONTENT_SCHEMA_VERSION,
    PROGRESS_SCHEMA_VERSION,
    DEFAULT_PACKAGE_ID,
    clone,
    slugify,
    progressKey,
    createContentStore,
    createDefaultContentStore,
    emptyProgressStore,
    extractProgressFromGuides,
    normalizeProgressStore,
    hydrateGuide,
    hydrateGuides,
    setChecklistProgress,
    setVerificationProgress,
    setStepNote,
    markStepOpened,
    getStepNote,
    validateContentStore,
    convertLegacyPanduan,
    parsePackageImport,
    packageSummary,
    mergePackage,
    mergeProgress,
    exportPackage,
    createBackup,
    parseBackup,
    migrateStoredData
  };
});
