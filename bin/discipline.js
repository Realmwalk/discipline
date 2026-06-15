#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates');

// ── Templates split: 11 core, 16 optional ───────────────────────────────
// The Spec & Design phase (SPEC_WORKFLOW + SPEC + BUILD_PLAN) is CORE, not
// optional: a good spec is the load-bearing input to every build, and the
// framework's whole point is to get you there. See docs/DECISIONS.md 2026-06-14.
const CORE = [
  'README.md',
  'HANDOFF.md',
  'AGENTS.md',
  'PROJECT_CONTEXT.md',
  'TODO.md',
  'DECISIONS.md',
  'ROADMAP.md',
  'CHANGELOG.md',
  'SPEC_WORKFLOW.md',
  'SPEC.md',
  'BUILD_PLAN.md',
];

const OPTIONAL = [
  'API_REFERENCE.md',
  'ARCHITECTURE.md',
  'ASSETS.md',
  'AUTONOMOUS_QUEUE.md',
  'AGENT_TRACKER.md',
  'CREDITS.md',
  'DATA_MODEL.md',
  'DEPLOYMENT.md',
  'INVESTIGATION.md',
  'OPEN_DECISIONS.md',
  'PLAYBOOK_FEEDBACK.md',
  'IMPROVEMENT_LOOP.md',
  'VERIFICATION_GATE.md',
  'SECURITY_AUDIT.md',
  'USAGE.md',
  'CLAUDE.md',
];

// ── Agent role split: 6 core, 6 optional ─────────────────────────────────
// Core role contracts get installed by `discipline-md init`. Optional roles
// (the retired-from-default-set roles per docs/DECISIONS.md 2026-05-09)
// stay in templates/agents/optional/ and are only installed on demand
// via `discipline-md add-role <NAME>` for projects that need them.
const CORE_ROLES = [
  'RECON.md',
  'PLANNER.md',
  'DEBUGGER.md',
  'SECURITY_REVIEWER.md',
  'CROSS_REPO_SYNC.md',
  'SPEC_ARCHITECT.md',
];

const OPTIONAL_ROLES = [
  'ARCHITECT.md',
  'DOC_AUDIT.md',
  'TEST_STRATEGIST.md',
  'BACKEND_IMPACT.md',
  'FRONTEND_IMPACT.md',
  'QUEUE_CURATOR.md',
];

// Meta files inside templates/agents/ that always travel with the core
// install (they're not roles themselves — they're scaffolding for adding
// project-local roles).
const AGENT_META_FILES = ['_TEMPLATE.md', 'README.md', 'STAKEHOLDER.md'];

const REPO_ROOT_FILES = ['LICENSE', 'NOTICE'];

// ── helpers ─────────────────────────────────────────────────────────────
function args() {
  const argv = process.argv.slice(2);
  const command = argv[0] ?? 'help';
  const flags = {};
  const positional = [];
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      flags[a.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    } else {
      positional.push(a);
    }
  }
  return { command, flags, positional };
}

function copyOne(src, dest) {
  if (existsSync(dest)) {
    console.log(`  skip (exists): ${dest}`);
    return false;
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(`  wrote: ${dest}`);
  return true;
}

// Copy only the immediate children of a directory (files only, no subdirs).
// Used to copy templates/agents/ without dragging the optional/ subfolder along.
function copyTopLevelFiles(srcDir, destDir) {
  if (!existsSync(srcDir)) return;
  for (const entry of readdirSync(srcDir)) {
    const src = join(srcDir, entry);
    if (statSync(src).isDirectory()) continue;
    copyOne(src, join(destDir, entry));
  }
}

// ── commands ────────────────────────────────────────────────────────────
function cmdInit(flags) {
  const target = flags.target ? resolve(flags.target) : process.cwd();
  console.log(`\nDiscipline init -> ${target}\n`);

  console.log('Core 11 templates -> docs/');
  for (const f of CORE) {
    const src = join(TEMPLATES_DIR, f);
    const dest = join(target, 'docs', f);
    if (existsSync(src)) copyOne(src, dest);
  }

  // Core role contracts — top level of templates/agents/ (excluding optional/)
  const agentsSrc = join(TEMPLATES_DIR, 'agents');
  if (existsSync(agentsSrc)) {
    console.log('\nCore 6 role contracts + meta files -> docs/agents/');
    copyTopLevelFiles(agentsSrc, join(target, 'docs', 'agents'));
  }

  console.log('\nRepo-root files (LICENSE, NOTICE) -> repo root');
  for (const f of REPO_ROOT_FILES) {
    const src = join(TEMPLATES_DIR, f);
    const dest = join(target, f);
    if (existsSync(src)) copyOne(src, dest);
  }

  console.log('\nDone. Next:');
  console.log('  1. Fill in placeholders in docs/ (search for "[" or "<" markers).');
  console.log('  2. Pick a license in LICENSE (default ships as All Rights Reserved).');
  console.log('  3. Point your AI agent at docs/AGENTS.md.');
  console.log('  4. Add optional templates with: npx discipline-md add <name>');
  console.log(`     (available: ${OPTIONAL.join(', ')})`);
  console.log('  5. Add optional agent roles with: npx discipline-md add-role <NAME>');
  console.log(`     (available: ${OPTIONAL_ROLES.map((r) => r.replace('.md', '')).join(', ')})`);
  console.log();
}

function cmdAdd(positional) {
  const target = process.cwd();
  if (!positional.length) {
    console.log('Usage: npx discipline-md add <template> [<template>...]');
    console.log('Available optional templates:');
    for (const f of OPTIONAL) console.log(`  ${f}`);
    return;
  }
  console.log(`\nDiscipline add -> ${target}/docs/\n`);
  for (const arg of positional) {
    const name = arg.endsWith('.md') ? arg : `${arg}.md`;
    if (!OPTIONAL.includes(name) && !CORE.includes(name)) {
      console.log(`  skip (unknown template): ${name}`);
      continue;
    }
    const src = join(TEMPLATES_DIR, name);
    const dest = join(target, 'docs', name);
    if (existsSync(src)) copyOne(src, dest);
  }
  console.log();
}

function cmdAddRole(positional) {
  const target = process.cwd();
  if (!positional.length) {
    console.log('Usage: npx discipline-md add-role <ROLE> [<ROLE>...]');
    console.log('Available optional agent roles:');
    for (const f of OPTIONAL_ROLES) console.log(`  ${f.replace('.md', '')}`);
    console.log('\nThese roles were retired from the lean default set on 2026-05-09');
    console.log('(see docs/DECISIONS.md). Add them only if your project needs them.');
    return;
  }
  console.log(`\nDiscipline add-role -> ${target}/docs/agents/\n`);
  for (const arg of positional) {
    const upper = arg.toUpperCase();
    const name = upper.endsWith('.MD') ? upper : `${upper}.md`;
    const properName = name.endsWith('.md') ? name : `${name}.md`;
    if (!OPTIONAL_ROLES.includes(properName) && !CORE_ROLES.includes(properName)) {
      console.log(`  skip (unknown role): ${arg}`);
      continue;
    }
    // Optional roles live in templates/agents/optional/; core roles at templates/agents/.
    const subdir = OPTIONAL_ROLES.includes(properName) ? 'optional' : '';
    const src = subdir
      ? join(TEMPLATES_DIR, 'agents', subdir, properName)
      : join(TEMPLATES_DIR, 'agents', properName);
    const dest = join(target, 'docs', 'agents', properName);
    if (existsSync(src)) copyOne(src, dest);
  }
  console.log();
}

// ── lint ────────────────────────────────────────────────────────────────
// Mechanically checkable slices of the framework's gates: a gate a weak
// model can forget is not a gate. Lints the TARGET's docs/ only — never
// this package's own templates/ (templates legitimately contain
// placeholders and example residue).

// Allowed tag values per the legends in templates/AGENTS.md, templates/TODO.md
// and templates/AUTONOMOUS_QUEUE.md (union of the Claude-specific and
// model-agnostic spellings those legends document).
const TAG_VOCAB = {
  autonomy: ['safe', 'review', 'needs-human-collab'],
  size: ['XS', 'S', 'M', 'L', 'XL'],
  risk: ['low', 'med', 'high'],
  scope: ['isolated', 'cross-repo', 'cross-cutting', 'infra'],
  tier: ['haiku', 'sonnet', 'opus', 'frontier', 'workhorse', 'recon'],
};

// Hot-path size budgets (bytes). Over budget = cold content leaking in.
const SIZE_BUDGETS = [
  ['docs/AGENTS.md', 36 * 1024],
  ['docs/HANDOFF.md', 24 * 1024],
  ['docs/TODO.md', 16 * 1024],
  ['CLAUDE.md', 12 * 1024],
  ['docs/CLAUDE.md', 12 * 1024],
];

// Placeholder patterns confirmed present in the shipped templates.
const PLACEHOLDER_PATTERNS = [
  /\[TBD\]/,
  /<repo-path>/,
  /(?<!_)<YYYY-MM-DD>/, // `SECURITY_AUDIT_<YYYY-MM-DD>.md` is a filename convention, not residue
  /<e\.g\.[^>]*>/,
  /<docs\/[^>]*>/,
];

function lintRead(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8').split(/\r?\n/);
}

// Per-line mask: true where the line is inside a fenced code block or an
// HTML comment — examples and commented-out scaffolding are not findings.
function maskedLines(lines) {
  const mask = [];
  let fence = false;
  let comment = false;
  for (const line of lines) {
    const wasMasked = fence || comment;
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (!fence) {
      if (line.includes('<!--')) comment = true;
      mask.push(wasMasked || fence || comment || line.includes('<!--'));
      if (line.includes('-->')) comment = false;
    } else {
      mask.push(true);
    }
  }
  return mask;
}

// Loose containment normalizer for cross-file title matching.
function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// First plain title fragment of a queue/TODO bullet: text up to the first
// em-dash separator or tag block, stripped of markdown decoration.
function bulletTitle(text) {
  let t = text.split(/\s+—\s+/)[0];
  t = t.split('`[')[0];
  return t.replace(/[*_`]/g, '').trim();
}

function cmdLint(flags) {
  const target = flags.target ? resolve(flags.target) : process.cwd();
  const docsDir = join(target, 'docs');
  const findings = [];
  const add = (file, line, level, rule, msg) => findings.push({ file, line, level, rule, msg });

  if (!existsSync(docsDir)) {
    console.log(`\nDiscipline lint: no docs/ directory at ${target} — nothing to lint.\n`);
    return;
  }

  const todoPath = join(docsDir, 'TODO.md');
  const queuePath = join(docsDir, 'AUTONOMOUS_QUEUE.md');
  const todo = lintRead(todoPath);
  const queue = lintRead(queuePath);
  const roadmap = lintRead(join(docsDir, 'ROADMAP.md'));

  // todo-done-residue (ERROR): the cleanup gate deletes shipped entries.
  if (todo) {
    const mask = maskedLines(todo);
    todo.forEach((line, i) => {
      if (!mask[i] && /^\s*[-*]\s*\[[xX]\]/.test(line)) {
        add(todoPath, i + 1, 'ERROR', 'todo-done-residue',
          'checked-off entry — shipped TODO entries are DELETED once captured in CHANGELOG, never marked [x]');
      }
    });
  }

  // tag-validity (ERROR): unknown value in a [key: value] tag.
  for (const [path, lines] of [[todoPath, todo], [join(docsDir, 'ROADMAP.md'), roadmap], [queuePath, queue]]) {
    if (!lines) continue;
    const mask = maskedLines(lines);
    lines.forEach((line, i) => {
      if (mask[i]) return;
      for (const m of line.matchAll(/\[(autonomy|size|risk|scope|tier):\s*([^\]]+)\]/g)) {
        const [, key, raw] = m;
        const value = raw.trim();
        // Legend lines spell the alternatives ("safe|review|…") — skip those.
        if (value.includes('|') || value.includes('…') || value.includes('<')) continue;
        const allowed = TAG_VOCAB[key];
        const ok = key === 'size'
          ? allowed.includes(value.toUpperCase())
          : allowed.includes(value.toLowerCase());
        if (!ok) {
          add(path, i + 1, 'ERROR', 'tag-validity',
            `[${key}: ${value}] is not a documented value (allowed: ${allowed.join('|')})`);
        }
      }
    });
  }

  // queue-orphan (WARN): Active Queue entry with no trace in TODO/ROADMAP.
  if (queue && (todo || roadmap)) {
    const haystack = normalize([...(todo ?? []), ...(roadmap ?? [])].join('\n'));
    const mask = maskedLines(queue);
    let inActive = false;
    queue.forEach((line, i) => {
      if (/^##\s/.test(line)) inActive = /^##\s+Active Queue/i.test(line);
      if (!inActive || mask[i]) return;
      const m = line.match(/^\s*-\s*\[ \]\s*(.+)/);
      if (!m || m[1].startsWith('(')) return;
      const title = normalize(bulletTitle(m[1]));
      if (title.length < 8) return; // too short to match meaningfully
      if (!haystack.includes(title)) {
        add(queuePath, i + 1, 'WARN', 'queue-orphan',
          `queue entry "${bulletTitle(m[1])}" not found in docs/TODO.md or docs/ROADMAP.md — the queue is pointers, not a second backlog`);
      }
    });
  }

  // decisions-structure (WARN): entry missing the pinned fields from
  // templates/DECISIONS.md (Status / Decision / Context / Consequences;
  // bold-label and H3 spellings both accepted).
  const decisionsPath = join(docsDir, 'DECISIONS.md');
  const decisions = lintRead(decisionsPath);
  if (decisions) {
    const headings = [];
    decisions.forEach((line, i) => {
      if (/^##\s+\d{4}-\d{2}-\d{2}\b/.test(line)) headings.push(i);
    });
    headings.forEach((start, idx) => {
      const end = idx + 1 < headings.length ? headings[idx + 1] : decisions.length;
      const body = decisions.slice(start + 1, end).join('\n');
      const missing = ['Status', 'Decision', 'Context', 'Consequences'].filter((f) =>
        !new RegExp(`(^|\\n)\\s*(\\*\\*)?${f}(\\*\\*)?\\s*:|(^|\\n)###\\s+${f}`).test(body));
      if (missing.length) {
        add(decisionsPath, start + 1, 'WARN', 'decisions-structure',
          `entry missing pinned field(s): ${missing.join(', ')}`);
      }
    });
  }

  // hot-doc-size (WARN)
  for (const [rel, budget] of SIZE_BUDGETS) {
    const path = join(target, rel);
    if (!existsSync(path)) continue;
    const size = statSync(path).size;
    if (size > budget) {
      add(path, null, 'WARN', 'hot-doc-size',
        `${(size / 1024).toFixed(1)}KB exceeds the ${budget / 1024}KB hot-path budget — cold content may be leaking into the hot path`);
    }
  }

  // placeholder-residue (WARN): unfilled scaffold placeholders in docs/.
  const walk = (dir) => readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? walk(p) : (p.endsWith('.md') ? [p] : []);
  });
  for (const path of walk(docsDir)) {
    const lines = lintRead(path);
    const mask = maskedLines(lines);
    lines.forEach((line, i) => {
      if (mask[i]) return;
      const hit = PLACEHOLDER_PATTERNS.find((re) => re.test(line));
      if (hit) {
        add(path, i + 1, 'WARN', 'placeholder-residue',
          `unfilled scaffold placeholder (${line.match(hit)[0]})`);
      }
    });
  }

  // handoff-stale (WARN)
  const handoffPath = join(docsDir, 'HANDOFF.md');
  const handoff = lintRead(handoffPath);
  if (handoff) {
    handoff.forEach((line, i) => {
      const m = line.match(/last updated\s*[:—–-]?\s*\**\s*(\d{4}-\d{2}-\d{2})/i);
      if (!m) return;
      const age = (Date.now() - new Date(m[1]).getTime()) / 86400000;
      if (Number.isFinite(age) && age > 60) {
        add(handoffPath, i + 1, 'WARN', 'handoff-stale',
          `Last updated ${m[1]} is ${Math.floor(age)} days old — treat as a smell, verify before trusting`);
      }
    });
  }

  // todo-two-gate (WARN): [autonomy: safe] is necessary but NOT sufficient —
  // the item must also be in the curated queue. Skipped when the project
  // has no AUTONOMOUS_QUEUE.md at all.
  if (todo && queue) {
    const queueText = normalize(queue.join('\n'));
    const mask = maskedLines(todo);
    todo.forEach((line, i) => {
      if (mask[i] || !line.includes('[autonomy: safe]')) return;
      const m = line.match(/^\s*[-*]\s*(?:\[.\]\s*)?(.+)/);
      if (!m) return;
      const title = normalize(bulletTitle(m[1]));
      if (title.length < 8) return;
      if (!queueText.includes(title)) {
        add(todoPath, i + 1, 'WARN', 'todo-two-gate',
          'tagged [autonomy: safe] but not listed in docs/AUTONOMOUS_QUEUE.md — the tag alone is not sufficient for unattended execution');
      }
    });
  }

  // ── Spec & Design phase rules (SPEC.md / BUILD_PLAN.md) ──
  // These only fire when a project has opted into the spec phase (the files
  // exist); they skip gracefully otherwise.

  // spec-req-untagged (WARN): every requirement in SPEC.md ## Requirements must
  // carry [AUTO] or [HUMAN] — an untagged requirement has no verification
  // posture, and the verifier suite can't know whether to check it.
  // spec-auto-coverage (WARN): each [AUTO] requirement needs an entry in
  // ## Acceptance Tests — that section is the seed of the verifier suite.
  const specPath = join(docsDir, 'SPEC.md');
  const spec = lintRead(specPath);
  if (spec) {
    const mask = maskedLines(spec);
    const autoReqs = new Set();
    let section = '';
    spec.forEach((line, i) => {
      const h = line.match(/^##\s+(.+?)\s*$/);
      if (h) section = normalize(h[1]);
      if (mask[i]) return;
      const m = line.match(/^\s*[-*]\s*\*\*(R\d+)\*\*\s*(.*)$/);
      if (!m || section !== 'requirements') return;
      const [, id, rest] = m;
      const hasAuto = /\[AUTO\]/.test(rest);
      const hasHuman = /\[HUMAN\]/.test(rest);
      if (!hasAuto && !hasHuman) {
        add(specPath, i + 1, 'WARN', 'spec-req-untagged',
          `requirement ${id} is not tagged [AUTO] or [HUMAN] — every requirement needs a verification posture`);
      }
      if (hasAuto) autoReqs.add(id);
    });
    const covered = new Set();
    let inAccept = false;
    spec.forEach((line) => {
      const h = line.match(/^##\s+(.+?)\s*$/);
      if (h) inAccept = normalize(h[1]) === 'acceptance tests';
      if (!inAccept) return;
      for (const m of line.matchAll(/\bR\d+\b/g)) covered.add(m[0]);
    });
    for (const id of autoReqs) {
      if (!covered.has(id)) {
        add(specPath, null, 'WARN', 'spec-auto-coverage',
          `[AUTO] requirement ${id} has no entry in ## Acceptance Tests — it cannot become a verifier check`);
      }
    }
  }

  // story-dep-tag (WARN): every BUILD_PLAN.md story carries a [dep: …] marker
  // (the dependency graph IS the build schedule — [dep: none] = parallel-safe).
  // story-traceability (WARN): every story traces back to a SPEC.md requirement
  // via "satisfies: R#".
  const planPath = join(docsDir, 'BUILD_PLAN.md');
  const plan = lintRead(planPath);
  if (plan) {
    const mask = maskedLines(plan);
    const heads = [];
    plan.forEach((line, i) => {
      if (!mask[i] && /^###\s+S-\d+\b/.test(line)) heads.push(i);
    });
    heads.forEach((start, idx) => {
      const end = idx + 1 < heads.length ? heads[idx + 1] : plan.length;
      const title = plan[start].replace(/^###\s+/, '').trim();
      const body = plan.slice(start + 1, end).join('\n');
      if (!/\[dep:\s*[^\]]+\]/.test(body)) {
        add(planPath, start + 1, 'WARN', 'story-dep-tag',
          `story "${title}" has no [dep: …] marker — mark [dep: none] (parallel-safe) or [dep: S-xx] (serial)`);
      }
      if (!/satisfies\**\s*:\s*\**\s*R\d+/i.test(body)) {
        add(planPath, start + 1, 'WARN', 'story-traceability',
          `story "${title}" has no "satisfies: R#" — every story must trace to a SPEC.md requirement`);
      }
    });
  }

  // ── report ──
  const errors = findings.filter((f) => f.level === 'ERROR').length;
  const warnings = findings.length - errors;
  console.log(`\nDiscipline lint -> ${docsDir}\n`);
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const [file, list] of byFile) {
    console.log(file);
    for (const f of list) {
      console.log(`  ${f.line ? `line ${f.line}` : '(file)'} [${f.level}] ${f.rule}: ${f.msg}`);
    }
    console.log();
  }
  console.log(`${errors} errors, ${warnings} warnings`);
  if (errors > 0 || (flags.strict && warnings > 0)) process.exitCode = 1;
}

function cmdList() {
  console.log('\nCore 11 templates (always installed by `discipline-md init`):');
  for (const f of CORE) console.log(`  ${f}`);
  console.log('\nOptional templates (opt-in via `discipline-md add <name>`):');
  for (const f of OPTIONAL) console.log(`  ${f}`);
  console.log('\nCore 6 agent role contracts (always installed by `discipline-md init`):');
  for (const f of CORE_ROLES) console.log(`  ${f.replace('.md', '')}`);
  console.log('\nOptional agent roles (opt-in via `discipline-md add-role <NAME>`):');
  for (const f of OPTIONAL_ROLES) console.log(`  ${f.replace('.md', '')}`);
  console.log('\nRepo-root files (installed by `discipline-md init`):');
  for (const f of REPO_ROOT_FILES) console.log(`  ${f}`);
  console.log('\nHygiene: `discipline-md lint [--target <path>] [--strict]` checks docs/ against');
  console.log('the cleanup gate, tag legend, and two-gate autonomy rule.');
  console.log();
}

function cmdHelp() {
  console.log(`
Discipline — opinionated agentic-workflow framework

Usage:
  npx discipline-md init [--target <path>]    Scaffold Core 11 + Core 6 roles into <path>
  npx discipline-md add <template>            Add an optional template to ./docs/
  npx discipline-md add-role <ROLE>           Add an optional agent role to ./docs/agents/
  npx discipline-md lint [--target <path>]    Lint <path>/docs/ for gate violations
                      [--strict]           (--strict: warnings also fail the run)
  npx discipline-md list                      Show all templates and roles
  npx discipline-md help                      This message

Lint checks the mechanical half of the framework's gates: [x] residue in
TODO.md (cleanup gate), unknown tag values, queue entries orphaned from
TODO/ROADMAP, [autonomy: safe] items missing from AUTONOMOUS_QUEUE.md
(two-gate rule), oversized hot-path docs, unfilled placeholders, stale
handoffs. It also checks the Spec & Design phase: SPEC.md requirements are
[AUTO]/[HUMAN]-tagged and acceptance-covered, and BUILD_PLAN.md stories carry
[dep: …] markers and trace to a requirement. Exit 1 on any error (or any
warning with --strict).

Lean defaults: Core 11 templates + Core 6 roles ship by default — including the
Spec & Design phase (SPEC_WORKFLOW + SPEC + BUILD_PLAN + the SPEC_ARCHITECT
role), which is core because a good spec is the load-bearing input to every
build. The remaining 16 templates and 6 retired roles are opt-in for projects
that need them — see docs/DECISIONS.md for the rationale.

Docs: https://github.com/realmwalk/discipline
`);
}

function main() {
  const { command, flags, positional } = args();
  switch (command) {
    case 'init': return cmdInit(flags);
    case 'add': return cmdAdd(positional);
    case 'add-role': return cmdAddRole(positional);
    case 'lint': return cmdLint(flags);
    case 'list': return cmdList();
    case 'help':
    default: return cmdHelp();
  }
}

main();
