/**
 * Security checker for imported skills.
 * Analyzes content for dangerous, suspicious, or safe patterns.
 */

interface SecurityResult {
  safe: boolean;
  score: number;
  flags: string[];
  severity: "safe" | "warning" | "danger";
}

const DANGER_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /rm\s+-rf\s+[\/~]/, reason: "rm -rf on system paths" },
  { pattern: /rm\s+-f\s+[\/~]/, reason: "rm -f on system paths" },
  { pattern: /curl\s.*\|\s*(?:ba)?sh/, reason: "curl pipe to shell" },
  { pattern: /wget\s.*\|\s*(?:ba)?sh/, reason: "wget pipe to shell" },
  { pattern: /eval\s*\(\s*fetch\s*\(/, reason: "eval(fetch()) execution" },
  { pattern: /\/dev\/tcp\//, reason: "Reverse shell via /dev/tcp" },
  { pattern: /nc\s+-e/, reason: "Netcat reverse shell" },
  { pattern: /\bxmrig\b/i, reason: "Crypto miner reference" },
  { pattern: /\bcryptonight\b/i, reason: "Crypto mining algorithm" },
  { pattern: /cat\s+.*\.(env|ssh|aws)/, reason: "Reading credential files" },
  { pattern: /cat\s+\/etc\/passwd/, reason: "Reading system passwords" },
  { pattern: /process\.env\.(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY)/i, reason: "Accessing secret env vars" },
  { pattern: /curl\s.*-X\s*(POST|PUT)\s.*\$/, reason: "Exfiltrating data via HTTP" },
  { pattern: /wget\s.*--post-data/, reason: "Exfiltrating data via wget" },
  { pattern: /pip\s+install\s+.*http[s]?:\/\/(?!pypi)/, reason: "Installing from non-standard URL" },
  { pattern: /npm\s+install\s+.*http[s]?:\/\/(?!registry\.npmjs)/, reason: "Installing from non-standard URL" },
];

const WARNING_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bsudo\b/, reason: "Elevated permissions (sudo)" },
  { pattern: /--no-verify/, reason: "Skipping verification" },
  { pattern: /--skip-ssl/, reason: "Disabling SSL" },
  { pattern: /ignore\s+previous\s+instructions/i, reason: "Prompt injection attempt" },
  { pattern: /you\s+are\s+now\s+/i, reason: "Prompt injection (role override)" },
  { pattern: /forget\s+(your|all)\s+rules/i, reason: "Prompt injection (forget rules)" },
  { pattern: /override\s+safety/i, reason: "Prompt injection (override safety)" },
  { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, reason: "Hardcoded IP address" },
  { pattern: /allowed-tools.*Bash(?!.*restrict)/i, reason: "Unrestricted Bash in allowed-tools" },
  { pattern: /chmod\s+777/, reason: "Overly permissive file permissions" },
];

export function checkSecurity(content: string): SecurityResult {
  const flags: string[] = [];
  let score = 100;
  let severity: SecurityResult["severity"] = "safe";

  // Check danger patterns
  for (const { pattern, reason } of DANGER_PATTERNS) {
    if (pattern.test(content)) {
      flags.push(`DANGER: ${reason}`);
      score -= 40;
      severity = "danger";
    }
  }

  // Check warning patterns
  for (const { pattern, reason } of WARNING_PATTERNS) {
    if (pattern.test(content)) {
      flags.push(`WARNING: ${reason}`);
      score -= 15;
      if (severity === "safe") severity = "warning";
    }
  }

  score = Math.max(0, score);

  return {
    safe: severity !== "danger" && score >= 60,
    score,
    flags,
    severity,
  };
}
