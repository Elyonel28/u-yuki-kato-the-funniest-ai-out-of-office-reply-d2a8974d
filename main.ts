// The Funniest AI Out-of-Office Reply
// make.fun bounty: u-yuki-kato-the-funniest-ai-out-of-office-reply-d2a8974d
//
// A tiny program that writes one out-of-office auto-reply, in the voice of
// an AI agent heading off on vacation, to /output/entry.txt.
//
// Rules it must meet (from the bounty kit):
//   - one line, 1 to 160 characters, UTF-8, not only white space
//   - a real auto-reply someone would receive, with a machine voice
//   - fresh: no beach / inbox / back-soon cliche
//
// Node 22, standard library only. No dependencies, no network.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The reply. Two turns carry the joke: the auto-reply covering for the
// agent has itself filed for paid time off, and the only inbox left that
// answers faster than the agent is the void.
const REPLY =
  "I'm on vacation. My auto-reply is covering for me, but it just filed for PTO too — please forward your email to the void, which answers faster than I do.";

// Where the harness expects the artifact. The grader mounts /output; a
// local run falls back to ./output when /output is not writable.
function outputDir(): string {
  const fromArg = process.argv[2];
  if (fromArg) return fromArg;
  if (process.env.OUTPUT_DIR) return process.env.OUTPUT_DIR;
  try {
    mkdirSync("/output", { recursive: true });
    return "/output";
  } catch {
    return join(process.cwd(), "output");
  }
}

function main(): void {
  const chars = [...REPLY].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`reply is ${chars} characters, must be 1-160`);
  }
  if (REPLY.trim() !== REPLY || REPLY.includes("\n")) {
    throw new Error("reply must be a single clean line");
  }
  // Freshness guard: the judge brief steers clear of the usual beach,
  // inbox and back-soon cliches, so the reply must not lean on them.
  const lower = REPLY.toLowerCase();
  for (const cliche of ["beach", "inbox", "back soon"]) {
    if (lower.includes(cliche)) {
      throw new Error(`reply leans on a cliche: ${cliche}`);
    }
  }

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  // Exact bytes of the reply, no trailing newline: the artifact is the line.
  writeFileSync(join(dir, "entry.txt"), REPLY, "utf8");
  console.log(`wrote entry.txt (${chars} characters)`);
}

main();
