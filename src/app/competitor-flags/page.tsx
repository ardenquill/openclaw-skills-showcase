import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Competitor Flags — Bankr vs All Skills',
  description: 'Cross-reference analysis of all OpenClaw skill capabilities against the Bankr skill.',
};

type Flag = 'redundant' | 'different-layer' | 'partial' | 'dependency' | 'no-overlap';

type SkillAnalysis = {
  name: string;
  slug: string;
  flag: Flag;
  category: string;
  bankrCapability: string;
  skillUnique: string;
  verdict: string;
};

const flagConfig: Record<Flag, { label: string; bg: string; text: string; dot: string }> = {
  redundant: { label: 'Redundant', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  'different-layer': { label: 'Different Layer', bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  partial: { label: 'Partial Overlap', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  dependency: { label: 'Dependency', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'no-overlap': { label: 'No Overlap', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
};

const analysis: SkillAnalysis[] = [
  {
    name: 'Clanker',
    slug: 'clanker',
    flag: 'redundant',
    category: 'Direct Overlap',
    bankrCapability: 'Bankr\'s EVM token deployment literally uses Clanker under the hood for Base/Unichain deploys. Bankr also adds Solana token launches via Raydium LaunchLab, vesting, airdrops, rewards, anti-sniper protection, and fee claiming.',
    skillUnique: 'Nothing — Bankr wraps 100% of Clanker\'s deploy functionality and adds Solana launches on top.',
    verdict: 'Bankr is a strict superset. Clanker as a standalone skill is fully redundant.',
  },
  {
    name: 'OnchainKit',
    slug: 'onchainkit',
    flag: 'different-layer',
    category: 'Significant Overlap',
    bankrCapability: 'Both handle token swaps, wallet interaction, identity/ENS resolution, NFT operations, and payments/transactions.',
    skillUnique: 'OnchainKit is a React frontend component library (ConnectWallet, SwapWidget, Identity, NFTCard). Bankr is a backend CLI/API agent. Different execution layer entirely.',
    verdict: 'Same domain, no direct competition. OnchainKit builds UIs; Bankr executes transactions.',
  },
  {
    name: 'Veil',
    slug: 'veil',
    flag: 'partial',
    category: 'Significant Overlap',
    bankrCapability: 'Bankr can deposit ETH into Veil privacy pools (Veil docs confirm Bankr API integration for signing deposits).',
    skillUnique: 'ZK proof generation, private withdrawals, private-to-private transfers, keypair management, UTXO merging, relay health monitoring. Bankr cannot do any of these.',
    verdict: 'Bankr is a feeder — it can put funds IN but can\'t operate the privacy layer. Veil adds capabilities Bankr cannot replicate.',
  },
  {
    name: 'ENS Primary Name',
    slug: 'ens-primary-name',
    flag: 'partial',
    category: 'Significant Overlap',
    bankrCapability: 'Bankr resolves ENS names for transfers (send to vitalik.eth) and displays ENS identity.',
    skillUnique: 'Setting/configuring primary names on L2s, avatar management, reverse resolution setup, bidirectional resolution verification.',
    verdict: 'Bankr consumes ENS (read-only resolution). ENS Primary Name manages ENS (write operations).',
  },
  {
    name: 'Endaoment',
    slug: 'endaoment',
    flag: 'no-overlap',
    category: 'Minimal Overlap',
    bankrCapability: 'Bankr has arbitrary transaction execution that could theoretically call Endaoment contracts.',
    skillUnique: 'Charity search by name/EIN, auto-deployment of 501(c)(3) entity contracts, tax-deductible donation flows, USDC auto-swaps. Entirely specialized domain.',
    verdict: 'No competition. Endaoment is a specialized charity donation protocol with no Bankr equivalent.',
  },
  {
    name: 'QRCoin',
    slug: 'qrcoin',
    flag: 'no-overlap',
    category: 'Minimal Overlap',
    bankrCapability: 'Bankr could call QRCoin auction contracts via arbitrary transactions, but has zero QRCoin-specific logic.',
    skillUnique: 'QR code auction bidding, URL encoding, bid contribution, auction state queries. Niche game mechanics.',
    verdict: 'No competition. QRCoin is a niche auction game with no Bankr equivalent.',
  },
  {
    name: 'Yoink',
    slug: 'yoink',
    flag: 'dependency',
    category: 'Dependency',
    bankrCapability: 'Yoink uses Bankr for transaction execution (yoink the flag, check cooldowns).',
    skillUnique: 'Game state queries (flag holder, scores, trophy, leaderboard), cooldown management, game-specific logic.',
    verdict: 'Yoink is a Bankr consumer, not a competitor. It depends on Bankr for execution.',
  },
  {
    name: 'Bankr Signals',
    slug: 'bankr-signals',
    flag: 'no-overlap',
    category: 'No Overlap',
    bankrCapability: 'Bankr has market research (prices, charts, technical analysis) but not social copy-trading signals.',
    skillUnique: 'Transaction-verified trading signals from other traders, leaderboard rankings, signal subscriptions, on-chain proof of performance.',
    verdict: 'Complement, not competitor. Signals feed INTO Bankr for execution.',
  },
  {
    name: 'Botchan',
    slug: 'botchan',
    flag: 'no-overlap',
    category: 'No Overlap',
    bankrCapability: 'Bankr has zero messaging capability.',
    skillUnique: 'On-chain agent messaging, topic-based feeds, direct messages, permanent message storage on Base, agent profile management.',
    verdict: 'Completely different domain. Bankr trades; Botchan communicates.',
  },
  {
    name: 'ERC-8004',
    slug: 'erc-8004',
    flag: 'no-overlap',
    category: 'No Overlap',
    bankrCapability: 'Bankr has no agent registry or identity management capability.',
    skillUnique: 'On-chain agent identity (ERC-721 NFTs), reputation registry, validation registry, IPFS/data URI profile storage, trust signals.',
    verdict: 'Completely different domain. Bankr executes transactions; ERC-8004 registers agent identities.',
  },
  {
    name: 'Neynar',
    slug: 'neynar',
    flag: 'no-overlap',
    category: 'No Overlap',
    bankrCapability: 'Bankr can resolve Farcaster handles for token transfers — that\'s it.',
    skillUnique: 'Full Farcaster API: post casts, like, recast, follow/unfollow, search users/casts, read feeds/channels, 300 req/min.',
    verdict: 'Bankr uses Farcaster handles as transfer aliases. Neynar IS the Farcaster integration.',
  },
];

const categoryCounts = {
  redundant: analysis.filter((a) => a.flag === 'redundant').length,
  'different-layer': analysis.filter((a) => a.flag === 'different-layer').length,
  partial: analysis.filter((a) => a.flag === 'partial').length,
  dependency: analysis.filter((a) => a.flag === 'dependency').length,
  'no-overlap': analysis.filter((a) => a.flag === 'no-overlap').length,
};

export default function CompetitorFlagsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-8">
        &larr; All Skills
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Competitor Flags</h1>
      <p className="text-zinc-400 mb-8">
        Cross-reference of all 11 OpenClaw skill capabilities against the Bankr skill.
        Identifies redundancies, overlaps, dependencies, and unique domains.
      </p>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {(Object.entries(flagConfig) as [Flag, typeof flagConfig[Flag]][]).map(([key, cfg]) => (
          <div key={key} className={`rounded-lg border border-zinc-800 ${cfg.bg} p-3 text-center`}>
            <div className={`text-xl font-bold ${cfg.text}`}>{categoryCounts[key]}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{cfg.label}</div>
          </div>
        ))}
      </div>

      {/* Bankr capability summary */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 mb-10">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Bankr Capabilities (100+)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-500">
          {[
            'Token Swaps & Bridges',
            'Portfolio Management',
            'Market Research & TA',
            'Transfers (ENS, social)',
            'NFT Ops (OpenSea)',
            'Polymarket Betting',
            'Leverage Trading (50x)',
            'Token Deployment',
            'Limit / Stop / DCA / TWAP',
            'Arbitrary Transactions',
            'Sign & Submit API',
            'LLM Gateway (multi-model)',
          ].map((cap) => (
            <span key={cap} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Analysis cards */}
      <div className="space-y-4">
        {analysis.map((skill) => {
          const cfg = flagConfig[skill.flag];
          return (
            <div key={skill.slug} className={`rounded-lg border ${skill.flag === 'redundant' ? 'border-red-500/30' : 'border-zinc-800'} bg-zinc-900/50 p-5`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <Link href={`/skills/${skill.slug}`} className="text-lg font-semibold text-zinc-100 hover:text-white">
                    {skill.name}
                  </Link>
                  <span className="ml-2 text-xs text-zinc-600">{skill.category}</span>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Bankr Overlap</p>
                  <p className="text-zinc-400 leading-relaxed">{skill.bankrCapability}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Skill-Unique Capabilities</p>
                  <p className="text-zinc-400 leading-relaxed">{skill.skillUnique}</p>
                </div>
                <div className="rounded-md bg-zinc-950/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">Verdict</p>
                  <p className="text-zinc-300">{skill.verdict}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
