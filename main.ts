// The Tired Dark Lord: a 100-word villain monologue.
// Writes exactly one monologue to /output/entry.txt (UTF-8).
// Pure Node stdlib: no imports beyond node:fs and node:path, no network,
// no child processes, no external binaries. Deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const MONOLOGUE = [
  "Stand by the brazier, not too close — it spits. Good. Now, the speech.",
  "I built this empire the slow way: brick, bribe, buried knife. Three kings knelt before I was thirty, and each one asked what you are asking, with the same trembling chin.",
  "Here is what none of them stayed to hear. I don't want your kingdom. I want the war done before supper. Sign the treaty, take the crown, call me tyrant if it helps you sleep. Just — do it quietly. The east tower creaks when you shout, and I've had twenty years of listening to it.",
].join("\n");

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Characters the gate would not accept as plain monologue text:
// any control character other than the line feed separating paragraphs.
const FORBIDDEN = /[\u0000-\u0009\u000B-\u001F\u007F]/;

function validate(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 600) {
    throw new Error(`entry must be 1-600 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (FORBIDDEN.test(text)) {
    throw new Error("entry contains a forbidden control character");
  }
}

function main(): void {
  const text = MONOLOGUE;
  validate(text);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
  // Verify the write round-trips: what the grader reads must be exactly
  // what was validated, byte for byte.
  const roundTripped = readFileSync(OUTPUT_PATH, "utf8");
  if (roundTripped !== text) {
    throw new Error("round-trip check failed: file content differs from entry");
  }
}

main();
