# 01 — Landscape: what can actually talk to a Zerodha account

Researched September 2026. Prices and limits change; re-verify before building.

## The three access paths

### 1. Hosted Kite MCP — `https://mcp.kite.trade/mcp`

Zerodha ships an official MCP server ([github.com/zerodha/kite-mcp-server](https://github.com/zerodha/kite-mcp-server)),
Go, with a free hosted endpoint. You authenticate by calling its `login` tool,
which hands back a Kite authorization link. No API key, no install, no cost.

**Critical finding: the hosted endpoint excludes the destructive trading tools.**
The upstream server implements `place_order`, `modify_order`, `cancel_order` and
the GTT tools, but the hosted deployment at `mcp.kite.trade` runs with them
excluded for security. What you get hosted is read-only: quotes, LTP, OHLC,
historical candles, instrument search, profile, margins, holdings, positions,
MF holdings, order history, trade history.

**Verdict: use it, but only for research and monitoring.** It is genuinely good
for "what's my exposure", "pull me 30 days of 5-min candles on RELIANCE",
"how much margin is free". It is not an execution path.

### 2. Self-hosted Kite MCP

Same repo, run yourself with your own Kite Connect API key and secret. Transports:
stdio, HTTP (recommended), SSE, or hybrid. An `EXCLUDED_TOOLS` env var lets you
pin down which tools are exposed — that is the mechanism for building a
read-only instance, or an instance with `place_order` but not `cancel_order`, etc.

**Verdict: this is the right way to give Claude *supervised* order tools** — a
human-approved, one-off "close this position now" during the manual phases.
It is *not* the right way to run an automated strategy loop (see below).

### 3. Kite Connect REST/WebSocket direct — `pykiteconnect`

The actual broker API. REST for orders/portfolio/historical, `KiteTicker`
WebSocket for streaming ticks. This is what the executor uses.

**Verdict: the only execution path for automated trading.** Deterministic,
testable, backtestable, rate-limit aware, and the only one where you control
retry/idempotency semantics.

## Why the LLM must not be in the order hot path

This is the load-bearing architectural decision, so it is worth being explicit.

| Property | Deterministic executor | LLM via MCP |
|---|---|---|
| Same input → same order | Yes | No |
| Backtestable against history | Yes | No — you cannot replay a model's judgement |
| Latency to decision | milliseconds | seconds, variable |
| Fails closed on ambiguity | Yes, by construction | No — it will pick something |
| Auditable to a rule you wrote | Yes | Only to a prompt |
| Cost per decision | ~0 | tokens, per tick |

A breakout trigger is a comparison against a number. An LLM adds latency,
non-determinism and cost to a comparison, and removes your ability to prove
the strategy ever worked. Use the model where judgement is genuinely the
scarce input — synthesising overnight news, sector rotation, catalyst
relevance, "is this gap explainable" — and that work happens **before the
market opens**, when a five-second response time is free.

## Costs (verify at signup)

- **Kite Connect Personal — free (since March 2025).** Order placement, positions,
  holdings, funds for your own account. *Excludes market data.*
- **Kite Connect (paid) — ₹500/month per API key.** Adds live market data and
  historical data. Historical data stopped being a separate ₹2,000/month add-on
  on 8 February 2025, and the base fee dropped from ₹2,000 to ₹500.
- **Static IP hosting — ~₹400–1,500/month** for a small VPS with a fixed IP, or
  AWS `ap-south-1` with an Elastic IP. Mandatory, see [02](02-regulatory.md).
- **LLM tokens** — pre-market research run, once daily. Small.

You need the ₹500 tier: the strategy depends on historical candles for backtests
and live quotes for triggers.

## Rate limits (Kite Connect, per API key, aggregated across endpoints)

| Endpoint | Limit |
|---|---|
| Quote | 1 req/sec |
| Historical candles | 3 req/sec |
| Order placement | 10 req/sec, 200/minute, 3,000/day |
| Everything else | 10 req/sec |

Exceeding returns HTTP 429. Limits are enforced **per API key**, not per user —
so a single key shared across a backtest job and the live executor will starve
the executor. Use separate keys, or a single in-process token-bucket that every
call goes through.

The 1 req/sec quote limit is the real design constraint: **you cannot poll quotes
for a watchlist.** Stream via `KiteTicker` WebSocket and compute triggers from
the tick stream; use REST quotes only for reconciliation and cold start.

## Ecosystem worth borrowing from

- **OpenAlgo** ([marketcalls/openalgo](https://github.com/marketcalls/openalgo)) —
  open-source, self-hosted Python/Flask algo platform with ~36 broker plugins
  including Zerodha. Useful as a reference implementation for broker abstraction
  and order-state handling even if you don't adopt it. Adopting it wholesale
  trades control for speed — reasonable for phase 0, less so once the risk kernel
  matters.
- **OpenEngine** ([marketcalls/openengine](https://github.com/marketcalls/openengine)) —
  event-driven backtesting library aimed at Indian markets, with live hooks into
  OpenAlgo's PlaceOrder API. Candidate for the backtest harness.
- Third-party community Kite MCP servers exist on GitHub and PulseMCP. **Do not
  use them.** They take your API key and access token, and an access token is
  full order-placement authority on your account. Only the official Zerodha
  repo or your own code.

## Sources

- [zerodha/kite-mcp-server](https://github.com/zerodha/kite-mcp-server)
- [Zerodha support — connect your account to AI assistants with Kite MCP](https://support.zerodha.com/category/trading-and-markets/general-kite/others-kite/articles/connect-zerodha-ai-assistant)
- [Kite Connect rate limits (developer forum)](https://kite.trade/forum/discussion/13397/rate-limits)
- [Revising Kite Connect fees from ₹2000 to ₹500 per month](https://kite.trade/forum/discussion/15015/revising-kite-connect-fees-from-2000-to-500-per-month)
- [Historical data is now free with base Kite Connect subscription](https://kite.trade/forum/discussion/14806/historical-data-is-now-free-with-base-kite-connect-subscription)
- [Zerodha makes trading API free for personal use (Marketcalls)](https://www.marketcalls.in/fintech/zerodha-makes-trading-api-free-for-personal-use-bundles-historical-data-with-connect-api.html)
- [What are the charges for Kite APIs](https://support.zerodha.com/category/trading-and-markets/general-kite/kite-api/articles/what-are-the-charges-for-kite-apis)
- [OpenAlgo](https://github.com/marketcalls/openalgo) · [OpenEngine](https://github.com/marketcalls/openengine)
