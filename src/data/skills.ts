export type Finding = {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  file: string;
  description: string;
  recommendation: string;
};

export type Skill = {
  slug: string;
  name: string;
  provider: string;
  providerUrl: string;
  description: string;
  demo: { title: string; language: string; code: string };
  setup: string[];
  securityFindings: Finding[];
  overallRating: 'clean' | 'warning' | 'flagged';
};

export const skills: Skill[] = [
  {
    slug: 'bankr',
    name: 'Bankr',
    provider: 'BankrBot',
    providerUrl: 'https://bankr.bot',
    description: 'AI-powered crypto trading agent — trade, check balances, transfer tokens via natural language prompts.',
    demo: {
      title: 'Check ETH Balance',
      language: 'bash',
      code: `bankr prompt "What is my ETH balance on Base?"`,
    },
    setup: [
      'Install the Bankr skill: `openclaw install bankr`',
      'Set your wallet seed phrase in `.env`: `BANKR_SEED_PHRASE=...`',
      'Configure target chain: `BANKR_CHAIN=base`',
      'Run: `bankr prompt "Show my portfolio"`',
    ],
    securityFindings: [
      {
        severity: 'critical',
        title: 'Arbitrary Transaction Execution via Prompt Injection',
        file: 'bankr/tools/transaction.ts',
        description:
          'The transaction endpoint accepts JSON parameters directly from LLM output. A crafted prompt can inject transaction parameters (recipient, amount) that bypass user confirmation, enabling unauthorized fund transfers.',
        recommendation:
          'Implement a mandatory user confirmation step for all transactions. Add allowlist for recipient addresses and transaction value caps.',
      },
      {
        severity: 'high',
        title: 'Seed Phrase Stored in Plain-Text Environment Variable',
        file: 'bankr/.env.example',
        description:
          'Wallet seed phrase is stored as a plain-text environment variable. Any process on the system can read /proc/self/environ or the .env file to extract the seed phrase.',
        recommendation:
          'Use OS keychain (macOS Keychain, Linux Secret Service) for seed storage. Alternatively, use a hardware wallet integration.',
      },
      {
        severity: 'medium',
        title: 'No Rate Limiting on Transaction Endpoints',
        file: 'bankr/server/routes.ts',
        description:
          'Transaction endpoints lack rate limiting, allowing rapid automated drain of wallet funds if access is compromised.',
        recommendation:
          'Add per-address and per-timeframe rate limits. Implement exponential backoff for repeated transaction attempts.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'bankr-signals',
    name: 'Bankr Signals',
    provider: 'BankrBot',
    providerUrl: 'https://bankrsignals.com',
    description: 'Real-time crypto trading signals and leaderboard — track top traders and copy strategies.',
    demo: {
      title: 'Fetch Leaderboard',
      language: 'bash',
      code: `curl -s https://bankrsignals.com/api/leaderboard | jq '.[:5]'`,
    },
    setup: [
      'Install the skill: `openclaw install bankr-signals`',
      'No API key required for public endpoints',
      'Query leaderboard: `curl bankrsignals.com/api/leaderboard`',
      'Subscribe to signals: `bankr-signals subscribe --trader <address>`',
    ],
    securityFindings: [
      {
        severity: 'medium',
        title: 'Timestamp Reuse Enables Replay Attacks',
        file: 'bankr-signals/api/auth.ts',
        description:
          'Authenticated API requests use a 5-minute timestamp window for replay protection. Within this window, identical requests can be replayed by an attacker who captures network traffic.',
        recommendation:
          'Add a nonce field to authenticated requests. Store used nonces server-side and reject duplicates within the timestamp window.',
      },
      {
        severity: 'low',
        title: 'Signal Data Lacks Integrity Verification',
        file: 'bankr-signals/api/signals.ts',
        description:
          'Trading signals received from the API are not cryptographically signed. A man-in-the-middle could alter signal data (buy/sell direction, amounts) in transit.',
        recommendation:
          'Sign signal payloads with an Ed25519 key. Clients should verify signatures before acting on signals.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'botchan',
    name: 'Botchan',
    provider: 'BankrBot',
    providerUrl: 'https://github.com/BankrBot/openclaw-skills',
    description: 'Read-only Farcaster feed reader — browse channels and cast history without authentication.',
    demo: {
      title: 'Read Channel Feed',
      language: 'bash',
      code: `botchan read general --limit 5`,
    },
    setup: [
      'Install the skill: `openclaw install botchan`',
      'No API keys or authentication required',
      'Read a channel: `botchan read <channel> --limit N`',
      'Search casts: `botchan search "topic"`',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Unbounded Response Size on Feed Queries',
        file: 'botchan/api/feed.ts',
        description:
          'Feed queries without a --limit flag return unbounded results, potentially causing memory exhaustion on large channels.',
        recommendation:
          'Set a default limit (e.g., 50) and a maximum cap (e.g., 500) for all feed queries.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'clanker',
    name: 'Clanker',
    provider: 'Clanker',
    providerUrl: 'https://clanker.world',
    description: 'Deploy ERC-20 tokens on Base with custom name, symbol, and image in one command.',
    demo: {
      title: 'Deploy a Token',
      language: 'bash',
      code: `clanker deploy --name "MyToken" --symbol "MTK" --image ./logo.png`,
    },
    setup: [
      'Install the skill: `openclaw install clanker`',
      'Set deployer private key: `CLANKER_PRIVATE_KEY=0x...` in `.env`',
      'Configure RPC endpoint: `CLANKER_RPC_URL=https://mainnet.base.org`',
      'Deploy: `clanker deploy --name "TokenName" --symbol "TKN"`',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Private Key in Environment Without Format Validation',
        file: 'clanker/config.ts',
        description:
          'The deployer private key is read from an environment variable without validating its format (length, hex prefix). Malformed keys cause cryptic errors rather than clear validation failures, and the key is logged in error stack traces.',
        recommendation:
          'Validate private key format on startup (64 hex chars with 0x prefix). Never include the key in error messages or logs. Use OS keychain for storage.',
      },
      {
        severity: 'medium',
        title: 'Token Metadata Not Verified Before On-Chain Deployment',
        file: 'clanker/deploy.ts',
        description:
          'Token name and symbol are passed directly to the contract factory without sanitization. Unicode characters and excessively long strings can create tokens that appear legitimate but have deceptive names.',
        recommendation:
          'Validate token name/symbol against a character allowlist (ASCII alphanumeric). Enforce reasonable length limits (32 chars name, 8 chars symbol).',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'endaoment',
    name: 'Endaoment',
    provider: 'Endaoment',
    providerUrl: 'https://endaoment.org',
    description: 'Search and donate to nonprofits on-chain via Endaoment — IRS-validated organizations with EIN lookup.',
    demo: {
      title: 'Search Nonprofits',
      language: 'bash',
      code: `./scripts/search.sh "Red Cross"`,
    },
    setup: [
      'Install the skill: `openclaw install endaoment`',
      'No API keys required for search',
      'Search: `./scripts/search.sh "Organization Name"`',
      'Donate (requires wallet): `endaoment donate --ein 530196605 --amount 0.1`',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Unvalidated EIN Encoding Allows Injection',
        file: 'endaoment/scripts/search.sh',
        description:
          'Employer Identification Numbers (EINs) are passed directly into API query parameters without format validation. A crafted EIN string could inject additional query parameters or manipulate the API endpoint.',
        recommendation:
          'Validate EINs as exactly 9 digits (with optional dash: XX-XXXXXXX). Reject any input that does not match this pattern before making API calls.',
      },
      {
        severity: 'medium',
        title: 'Shell Script Uses Unquoted Variables',
        file: 'endaoment/scripts/search.sh',
        description:
          'Search queries are interpolated into curl commands without proper quoting, enabling shell command injection via crafted search terms.',
        recommendation:
          'Double-quote all variable expansions in shell scripts. Use `--data-urlencode` for curl query parameters instead of string interpolation.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'ens-primary-name',
    name: 'ENS Primary Name',
    provider: 'ENS',
    providerUrl: 'https://ens.domains',
    description: 'Verify and resolve ENS primary names across chains — check if an address has a primary ENS name set.',
    demo: {
      title: 'Verify Primary Name',
      language: 'bash',
      code: `./scripts/verify-primary.sh 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 base`,
    },
    setup: [
      'Install the skill: `openclaw install ens-primary-name`',
      'No API keys required (uses public ENS subgraph)',
      'Verify: `./scripts/verify-primary.sh <address> <chain>`',
      'Supported chains: mainnet, base, optimism, arbitrum',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'GraphQL Injection via Unescaped ENS Name',
        file: 'ens-primary-name/api/resolve.ts',
        description:
          'ENS names are interpolated directly into GraphQL query strings without escaping. A specially crafted ENS name (e.g., containing quotes or GraphQL operators) could modify the query structure and extract unauthorized data from the subgraph.',
        recommendation:
          'Use GraphQL variables instead of string interpolation. Validate ENS names against the DNS label format (alphanumeric + hyphens, max 63 chars per label).',
      },
      {
        severity: 'low',
        title: 'No Response Caching for Repeated Lookups',
        file: 'ens-primary-name/api/resolve.ts',
        description:
          'Each lookup makes a fresh subgraph query without caching. Repeated lookups for the same address waste resources and can hit rate limits.',
        recommendation:
          'Cache resolved names with a TTL (e.g., 5 minutes). Use an in-memory LRU cache or respect subgraph cache headers.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'erc-8004',
    name: 'ERC-8004',
    provider: 'ERC-8004',
    providerUrl: 'https://github.com/BankrBot/openclaw-skills',
    description: 'Register and manage on-chain AI agents with HTTP endpoints — ERC-8004 native agent registry.',
    demo: {
      title: 'Register an Agent',
      language: 'typescript',
      code: `import { registerAgent } from "erc-8004";

await registerAgent({
  name: "MyAgent",
  url: "https://api.example.com/agent",
  capabilities: ["chat", "trade"],
});`,
    },
    setup: [
      'Install the skill: `openclaw install erc-8004`',
      'Set registry contract address: `ERC8004_REGISTRY=0x...`',
      'Set deployer key: `ERC8004_PRIVATE_KEY=0x...` in `.env`',
      'Register: `erc-8004 register --name "AgentName" --url "https://..."`',
    ],
    securityFindings: [
      {
        severity: 'critical',
        title: 'Node.js String Interpolation Enables Code Injection',
        file: 'erc-8004/agent/register.ts',
        description:
          'Agent registration URLs are interpolated into a Node.js `eval()` call for URL validation. A crafted URL containing JavaScript code (e.g., `javascript:...` or template literal injection) can execute arbitrary code on the host system.',
        recommendation:
          'Replace eval-based URL validation with the native `URL` constructor. Never use eval() or Function() with user-supplied input.',
      },
      {
        severity: 'high',
        title: 'No URL Scheme Validation for Agent Endpoints',
        file: 'erc-8004/agent/register.ts',
        description:
          'Registered agent URLs accept any scheme (http, ftp, file, javascript). A `file://` URL could be used to read local files when the agent is invoked.',
        recommendation:
          'Restrict agent URLs to https:// only. Validate the URL scheme before registration and before any HTTP calls to the agent.',
      },
      {
        severity: 'medium',
        title: 'Agent Capabilities Not Validated Against Allowlist',
        file: 'erc-8004/agent/register.ts',
        description:
          'Agent capabilities are free-form strings stored on-chain. Injecting misleading capabilities (e.g., "verified", "audited") could deceive users about an agent\'s trust level.',
        recommendation:
          'Define a fixed set of valid capabilities. Validate capability strings against this allowlist before on-chain registration.',
      },
    ],
    overallRating: 'flagged',
  },
  {
    slug: 'onchainkit',
    name: 'OnchainKit',
    provider: 'Coinbase',
    providerUrl: 'https://onchainkit.xyz',
    description: 'React component library for building on-chain apps — wallet connection, identity, transactions, and more.',
    demo: {
      title: 'Connect Wallet Component',
      language: 'tsx',
      code: `import { ConnectWallet } from "@coinbase/onchainkit/wallet";

export default function App() {
  return <ConnectWallet />;
}`,
    },
    setup: [
      'Install dependencies: `npm install @coinbase/onchainkit`',
      'Get a Coinbase Developer Platform API key',
      'Set `NEXT_PUBLIC_ONCHAINKIT_API_KEY` in `.env.local`',
      'Wrap your app with `<OnchainKitProvider>` and add components',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'API Key Exposed in Client-Side Bundle',
        file: 'onchainkit/providers/OnchainKitProvider.tsx',
        description:
          'The OnchainKit API key uses the NEXT_PUBLIC_ prefix, exposing it in the client-side JavaScript bundle. While this is standard for client-side APIs, the key could be extracted and used to make requests on behalf of the developer.',
        recommendation:
          'Use API key domain restrictions in the Coinbase Developer Platform. Monitor API usage for anomalous request patterns.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'qrcoin',
    name: 'QRCoin',
    provider: 'QRCoin',
    providerUrl: 'https://github.com/BankrBot/openclaw-skills',
    description: 'Query QRCoin auction state via public RPC — check current bids, auction phase, and token supply.',
    demo: {
      title: 'Query Current Auction',
      language: 'bash',
      code: `cast call 0x...QRCoinAuction "getCurrentAuction()" --rpc-url https://mainnet.base.org`,
    },
    setup: [
      'Install the skill: `openclaw install qrcoin`',
      'Install Foundry: `curl -L https://foundry.paradigm.xyz | bash`',
      'No API keys needed (public RPC)',
      'Query: `qrcoin auction --current`',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Public RPC Endpoint Without Fallback',
        file: 'qrcoin/config.ts',
        description:
          'The skill uses a single hardcoded public RPC endpoint. If the endpoint is rate-limited or down, the skill fails silently without retry or fallback.',
        recommendation:
          'Configure multiple RPC endpoints with automatic fallback. Add retry logic with exponential backoff.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'veil',
    name: 'Veil',
    provider: 'Veil',
    providerUrl: 'https://github.com/BankrBot/openclaw-skills',
    description: 'Check balances and interact with Veil protocol — privacy-focused token operations on Base.',
    demo: {
      title: 'Check Veil Balance',
      language: 'bash',
      code: `scripts/veil-balance.sh --address 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`,
    },
    setup: [
      'Install the skill: `openclaw install veil`',
      'Set private key in `.env.veil`: `VEIL_PRIVATE_KEY=0x...`',
      'Configure RPC: `VEIL_RPC_URL=https://mainnet.base.org`',
      'Check balance: `./scripts/veil-balance.sh --address <addr>`',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'Private Key Stored in .env.veil Without Keychain Integration',
        file: 'veil/.env.veil.example',
        description:
          'The private key is stored in a separate `.env.veil` file with no OS keychain integration. The file has default 644 permissions, making it readable by any user on the system.',
        recommendation:
          'Integrate with macOS Keychain or Linux Secret Service for key storage. If file-based storage is necessary, enforce 600 permissions and warn if they are too open.',
      },
      {
        severity: 'medium',
        title: 'Balance Query Exposes Address Pattern',
        file: 'veil/scripts/veil-balance.sh',
        description:
          'Balance queries are sent to a public RPC without any privacy layer, which defeats the purpose of a privacy-focused protocol. The queried address is visible in network logs.',
        recommendation:
          'Route RPC calls through a privacy-preserving relay or use the Veil protocol\'s built-in private query mechanism if available.',
      },
    ],
    overallRating: 'warning',
  },
  {
    slug: 'yoink',
    name: 'Yoink',
    provider: 'Yoink',
    providerUrl: 'https://yoink.party',
    description: 'Query the Yoink flag game on Base — check who holds the flag and game state via public RPC.',
    demo: {
      title: 'Query Flag Holder',
      language: 'bash',
      code: `cast call 0x...YoinkContract "flagHolder()" --rpc-url https://mainnet.base.org`,
    },
    setup: [
      'Install the skill: `openclaw install yoink`',
      'Install Foundry: `curl -L https://foundry.paradigm.xyz | bash`',
      'No API keys needed (public RPC)',
      'Query: `yoink status`',
    ],
    securityFindings: [
      {
        severity: 'low',
        title: 'Hardcoded Contract Address Without Verification',
        file: 'yoink/config.ts',
        description:
          'The Yoink contract address is hardcoded without checksum validation. A typo in the address would silently query the wrong contract.',
        recommendation:
          'Use EIP-55 checksummed addresses. Validate the checksum on startup and fail fast if it does not match.',
      },
    ],
    overallRating: 'clean',
  },
  {
    slug: 'neynar',
    name: 'Neynar',
    provider: 'Neynar',
    providerUrl: 'https://neynar.com',
    description: 'Farcaster API integration — look up users, casts, channels, and social graph data via Neynar.',
    demo: {
      title: 'Look Up a User',
      language: 'bash',
      code: `scripts/neynar.sh user vitalik.eth`,
    },
    setup: [
      'Install the skill: `openclaw install neynar`',
      'Get a Neynar API key from https://neynar.com',
      'Set in `.env`: `NEYNAR_API_KEY=...`',
      'Query: `./scripts/neynar.sh user <username>`',
    ],
    securityFindings: [
      {
        severity: 'high',
        title: 'API Key Visible in Process List',
        file: 'neynar/scripts/neynar.sh',
        description:
          'The Neynar API key is passed as a command-line argument to curl, making it visible in `ps` output and shell history to any user on the system.',
        recommendation:
          'Pass the API key via an environment variable or a temporary file (with 600 permissions) rather than as a command-line argument. Use `curl -H @headerfile` syntax.',
      },
      {
        severity: 'medium',
        title: 'No File Permission Check on .env',
        file: 'neynar/config.ts',
        description:
          'The .env file containing the API key is not checked for restrictive permissions. Other users on a shared system can read the API key.',
        recommendation:
          'Check that .env file permissions are 600 or 400 on startup. Warn or fail if permissions are too open.',
      },
      {
        severity: 'low',
        title: 'User Input Not Sanitized in API Queries',
        file: 'neynar/scripts/neynar.sh',
        description:
          'Username and search parameters are passed directly to the API without URL encoding. Special characters could cause unexpected API behavior.',
        recommendation:
          'URL-encode all user-supplied parameters before including them in API requests. Use `--data-urlencode` with curl.',
      },
    ],
    overallRating: 'warning',
  },
];

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug);
}

export function getSeverityCounts(findings: Finding[]) {
  return {
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };
}

export function getAllFindings(): Finding[] {
  return skills.flatMap((s) => s.securityFindings);
}
