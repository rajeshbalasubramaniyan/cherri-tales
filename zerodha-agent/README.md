# Zerodha Agentic Day-Trading System — Research

Research and design work for an agent-assisted intraday trading system on a
Zerodha account: pre-market research and candidate selection by an LLM agent,
order execution by deterministic code, under hard risk guardrails.

**Status: research / design only. No live trading code yet. Nothing here places orders.**

This lives on branch `claude/zerodha-trading-agent-nqxmsw` and is intentionally
self-contained in `zerodha-agent/` — it has nothing to do with the Cherri Tales
app in the rest of this repo. See "Repo placement" below.

## Read in this order

| Doc | What it answers |
|---|---|
| [01 — Landscape](docs/01-landscape.md) | What can actually talk to a Zerodha account? Kite MCP vs Kite Connect, what each can and can't do, costs. |
| [02 — Regulatory](docs/02-regulatory.md) | The SEBI/NSE retail algo framework that is live *now* (static IP, 10 OPS, tagging). Read before writing any code. |
| [03 — Architecture](docs/03-architecture.md) | The proposed system: research agent, watchlist contract, deterministic executor, risk kernel. |
| [04 — Strategy playbook](docs/04-strategy-playbook.md) | Open-session and close-session tactics, universe filters, entry/exit/level definitions. |
| [05 — Guardrails](docs/05-guardrails.md) | The risk kernel spec: hard limits, circuit breakers, kill switch, reconciliation. |
| [06 — Rollout](docs/06-rollout.md) | Backtest → paper → ₹25k → scale-up ladder, with promotion and demotion criteria. |
| [07 — Open questions](docs/07-open-questions.md) | Decisions needed from you before implementation starts. |

## The one-paragraph version

Zerodha's *hosted* Kite MCP server (`https://mcp.kite.trade/mcp`) deliberately
strips out order placement — it is a read-only portfolio/market-data assistant.
Real order flow goes through Kite Connect (`pykiteconnect`) from a machine with a
broker-whitelisted **static IP**, which SEBI has made mandatory for *all*
API order placement since 1 April 2026. So the shape of the system is: **agent
researches, code trades.** An LLM ranks candidates and writes a levels-annotated
watchlist before the open; a deterministic, backtestable executor is the only
thing allowed to send an order, and a risk kernel with hard rupee limits sits
between it and the broker.

## Repo placement

This is research pinned to the branch you asked for. Before any implementation,
`zerodha-agent/` should be extracted into **its own private repository** —
different runtime (Python vs Node), different secrets posture (a broker API key
and access token are materially more sensitive than a Firebase config), different
deploy target (a fixed-IP VPS, not Firebase Hosting), and different blast radius.
Keeping it beside a children's bedtime-story app invites an accident.

## Base rates, stated up front

SEBI's own studies are the honest prior for this project: **over 70% of individual
intraday equity traders lost money in FY23**, and **91% of individual equity
derivatives traders lost money in FY25**, with aggregate retail F&O losses of
₹1.05 lakh crore. An LLM in the loop does not change that distribution by itself —
there is no published evidence that LLM stock-picking has intraday edge. What the
design below actually buys you is *discipline*: consistent pre-market prep, forced
position sizing, and stops that cannot be talked out of. Every profit assumption in
these docs is therefore gated behind a backtest and a paper-trading period that
must pass before a single rupee is risked. See [06 — Rollout](docs/06-rollout.md).
