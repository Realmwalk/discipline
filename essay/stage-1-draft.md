# Your AGENTS.md Will Rot in 6 Months — and Why That's the Real Problem with AI Coding Tools

The 2026 standard for AI coding tools is `AGENTS.md`. It was formalized in August 2025, has been adopted by more than 20,000 public repositories, and is backed by some combination of OpenAI, Google, Cursor, Factory, and Sourcegraph depending on which week you check. The orthodoxy is settled: a single short file at the root of your repo, terse rules, optimized for token economy at session 1. Keep it tight. Keep it under a page. The agent will read it on every session start, so every kilobyte costs you forever.

Around that orthodoxy, a category of starter kits has appeared. `awesome-claude-code-toolkit` ships 135+ agents and 35 skills. `claude-md-templates` curates dozens of stack-flavored variants. `awesome-cursorrules` has thousands of contributed rule files. `antigravity-awesome-skills` advertises 1,372+ skills. The market shape is clear: token economy at startup is the optimization target, and the competition is on volume of pre-baked content.

I think this is the wrong variable.

I want to be upfront about what kind of essay this is, because the dishonest version of it would be more compelling.

## Where I'm coming from

I have not run an AGENTS.md-driven repo for six months. The workspace these opinions came from is roughly a week old — personal projects, a sandbox where I'm trying out doc-discipline patterns and seeing which ones survive contact with my own use. I am not writing from a position of "I lived this for two years and here are my scars." I am writing from a position of "I read the AGENTS.md ecosystem carefully, I've felt the early version of these failure modes on smaller timescales, and the structural argument for where current tools end up at scale seems strong enough to bet on."

If you want a lived-experience essay, this isn't one. If you want a structural argument for why the current orthodoxy probably doesn't survive contact with month six, and a sketch of what a framework optimized for the right variable would look like, read on. If the structural argument is wrong, I'd genuinely like to hear why — that's part of what posting this is for.

## The wall I think is coming

Around session 50, I expect the orthodoxy to stop working. Not loudly — quietly, in five specific ways. None of these are predictions from nowhere; they're patterns visible in any sufficiently old documentation system, AI or otherwise, when nothing structural fights against entropy. AI coding tools are new; documentation entropy is not.

**The AGENTS.md goes stale.** You rename the API surface. You retire a cache layer. The convention for naming integration tests drifts somewhere along the way. None of these land in AGENTS.md, because AGENTS.md is a single file at the root of the repo and updating it is nobody's job in particular. The agent reads the file every session and is wrong about your codebase in three small ways before it's typed a character. This is just doc rot. Doc rot has been a known failure mode of project documentation since project documentation existed. The single-file format makes it worse: there's no clear ownership, no per-area maintainer, no mechanism that surfaces "this file is now wrong about X."

**The TODO file becomes a graveyard.** Six hundred lines of `[x] DONE` entries with truncated descriptions, sometimes from contributors who no longer work on the project. Search becomes useless. New contributors scroll past it. Worse: the agent reads the TODO file every session, ingests the dead entries, and burns startup tokens treating shipped work as live context. This pattern is already visible in many public repos with year-old TODO files. It's not speculative; it's predictable.

**The autonomous agent merges a dumb change.** Tagged `[safe]` because the rule said `[safe]` was the default for small isolated work. But "small and isolated" is a category that includes "rename the column the auth middleware reads from" if you squint hard enough. There's no second gate — no curated queue saying *this specific item is pre-approved at this specific moment* — just a tag. The PR auto-merges at 2 AM. You find out the next morning. This kind of incident hasn't been widely reported because autonomous-agent merges are still rare, but the failure mode is structural: a single boolean gate on a category-level tag will, given enough samples, eventually pass through an item that the category description didn't quite cover.

**The playbook bloats with aspirational language.** Someone adds "the agent should always consider security implications before suggesting changes" to AGENTS.md. It sounds responsible. It means nothing operationally. The agent treats it as decoration. So does every reader. Three more sentences like it accumulate over the next two months and the playbook is half good rules and half ambient mood-setting. This is improvement-theater — adding language because language is easy. Without an explicit anti-pattern rule against it, every long-running playbook drifts this way.

**New contributors can't tell what's current.** Your repo has a CHANGELOG, a FEATURES.md, a RELEASES.md, a release notes section in the README, and a "shipped this quarter" section in ROADMAP.md. They mostly agree. They sometimes don't. Onboarding a new dev now includes a 20-minute conversation about which doc to trust on any given question. Multiple-source-of-truth drift is a documentation anti-pattern that predates AI, but the tools make it worse: every adopter adds the docs their flow needs, no upstream pattern tells them which docs are redundant, the result is a doc set that disagrees with itself.

These five aren't equally certain. Doc rot is nearly inevitable. TODO graveyards I've already seen in older personal repos. Aspirational-language bloat is a documented pattern. The 2 AM autonomous-merge is a prediction with structural backing but few public incident reports. Multiple-source-of-truth drift is well-known.

The honest summary is: three of these are well-documented failure modes that the AGENTS.md ecosystem has not yet structurally addressed; two are forward predictions with structural arguments behind them. None of them are "things I personally felt over six months and will now describe." If your AGENTS.md is six months old, you may have felt some of them already. I haven't. I think they're coming.

## The hypothesis

The orthodoxy is optimizing the wrong variable.

Token economy at session 1 is real but bounded. A 4-kilobyte AGENTS.md vs a 12-kilobyte one is a one-time cost on each session start. Across a thousand sessions over a year, the cumulative delta is real but small — a rounding error on a typical bill.

The cumulative cost of a rotted playbook is unbounded and compounds. Every stale rule produces an agent action that has to be rolled back. Every aspirational sentence that means nothing trains the agent (and the humans) to skim. Every dead TODO entry sits in context. Every "wait, is FEATURES.md or CHANGELOG.md right" interruption breaks a session. The cost is not paid in tokens. It is paid in correctness drift, repeated misunderstandings, and rework that the agent cheerfully redoes from a confidently-wrong starting position.

There is a session-count threshold N above which the cumulative cost of a rotted playbook exceeds the cumulative savings of a token-economical one. I do not know where N is. Neither does anyone in the AGENTS.md ecosystem, because nobody is measuring it. I would guess N is somewhere between session 30 and session 100 for a typical small-team repo. That is a guess, not a measurement, and I want to be honest about that.

But the guess is enough to motivate the question: what does it look like to optimize the right variable?

## What it would look like to optimize the right variable

I don't know that any of this is right. These are design choices in a framework I'm building for my own use; I'm publishing them now because the structural argument seems strong enough to share, not because I've validated each rule against a year of production data.

**Hot/cold path docs.** Some docs are read every session: README, HANDOFF, AGENTS, TODO, PROPOSALS. These are *hot* — tight, current, small, loaded into the agent's working context every time. Other docs — ARCHITECTURE, DATA_MODEL, DEPLOYMENT, DECISIONS, ROADMAP, CHANGELOG — are *cold*, read only when the agent is working in the relevant area. Cold-path docs can be longer and more detailed without paying a per-session cost. The split is not about how the human navigates; it's cache hygiene at session 30+. Once you have the split, AGENTS.md gets to be terse without amputating the durable knowledge — the durable knowledge moved to the cold path.

**Cleanup gate as a hard rule.** When a TODO entry ships, it gets *deleted*, not `[x] DONE`'d. Deleted. The CHANGELOG is the canonical record of shipped work; that is its job. The TODO file is a queue, not a log. The rule sounds harsh and is harsh: no `[x]` items survive past the session that ships them. A side effect: there is exactly one source of truth for "what shipped." No FEATURES.md. No RELEASES.md. No "shipped this quarter" section in ROADMAP. CHANGELOG is canonical or you have not solved the problem; you've just renamed it.

**Two-gate autonomy.** A `[autonomy: safe|review|needs-human-collab]` tag describes what *kind* of work this is. A separate curated queue lists the *specific* items that are pre-approved for autonomous execution. Both gates required. An item being `[safe]` is necessary but not sufficient — it must also be in the curated queue. This catches the "small isolated rename of the auth column" failure: the tag scheme alone would have let it through; the curated queue requires a human to have looked at the specific item and said yes. Gate redundancy is the point.

**Anti-improvement-theater rule on playbook proposals.** Improvements to AGENTS.md don't land directly. They land in `PLAYBOOK_FEEDBACK.md` first, and the proposal must show concrete workflow impact: a specific friction point this session, or a specific friction point foreseeable in upcoming work. "AGENTS.md could be clearer about X" without an anchor to a real moment doesn't get accepted. Stale aspirational guidance is worse than absent guidance. The rule is operationally annoying — sometimes you want to add a sentence and you don't have a specific friction point — and the annoyance is the feature. It is the only thing I can think of that would keep the playbook tight at month 12.

**Frontier-tier subagents, not Frontier-tier hosts.** Run the host model at workhorse tier (Sonnet 4.6, GPT-5 mini, Gemini 2.5 Flash). When the work hits a hard subtask — ambiguous architecture, security review, non-obvious debugging — spawn a named Frontier-tier subagent for that subtask only. The subagent's structured output flows back to the workhorse host, which resumes implementation. This bounds Opus / GPT-5 / Gemini-3-Pro burn to the hard subtask instead of letting it apply to the whole session. Cost difference is roughly 5x per token at the frontier. Across a year, this is the single largest dollar lever.

**Auto-escalation triggers for heavy work.** Default to supervised-direct (host edits files itself, no subagent overhead) for the small interactive work that most sessions are. Auto-spawn subagents when the work is genuinely multi-repo, multi-track, or workspace-wide — the cases where coordinator-heavy earns its keep. Don't make the user micromanage when to spawn what. The host should know.

These rules compose. They are not six independent micro-optimizations. They are one bet: that maintenance discipline, applied consistently across a repo's lifetime, produces better outcomes than per-session token tuning. The bet is unproven. I'm placing it anyway because the alternative — let the orthodoxy run for another year, see what happens — is also a bet, and a less interesting one.

## The opinions are unfashionable

These rules will alienate some adopters. Specifically:

The token-economy-first crowd will think the hot/cold path split is over-engineering. They want one file. *I will pay the per-session cost rather than maintain the split.* This is a coherent position and they're not wrong about session 1.

The completionists who love a 1,372-skill starter kit will find Discipline's Core 8 templates austere. *Where are the rest?* Empty templates feel like TODO items. We don't ship them by default. Add the optional ones via `npx discipline-md add API_REFERENCE` once the project actually has an API surface worth documenting.

The autonomy maximalists will find the two-gate rule annoying. *Why do I have to maintain a curated queue when I already have autonomy tags?* Because tags are a property of the item, queues are a property of the moment, and "is this thing safe right now in this state of the repo" is a moment-property. The annoyance is the cost of the gate. The cost of the gate is the dumb 2 AM merge that doesn't happen.

The anti-improvement-theater rule will alienate people who like adding aspirational sentences. *I want my playbook to reflect our values.* The playbook is operational and gets pruned with workflow-impact discipline or it rots. The values doc, if you need one, lives elsewhere.

These opinions only survive contact with reality if the failure modes they prevent are real and compounding. I'm betting they are. If I'm wrong, the rules will feel like over-engineering to everyone, including me, and Discipline will be a curiosity. That is a possible outcome and I'm fine with it.

## Try it (or don't)

Discipline is the framework that bakes these opinions in. The OSS repo is at github.com/realmwalk/discipline. `npx discipline-md init` ships the Core 8 templates plus the agent role contracts described above — hot/cold path docs, the cleanup gate, two-gate autonomy, the anti-improvement-theater rule, and the workhorse-host / frontier-subagent split.

I built this for my own use because I think the structural argument holds. I'm publishing it now rather than after twelve months because the argument either survives a careful read or it doesn't, and waiting twelve months to find out costs more than asking now. If the structural argument convinces you, try it on a real repo and tell me where it breaks. If it doesn't convince you, I'd genuinely like to know why — what's the part of the orthodoxy I'm wrong about?

Either way: don't adopt this because of the opinions. Adopt it because the maintenance arithmetic in your specific situation lines up. If your AGENTS.md is fine, you don't need this — yet.
