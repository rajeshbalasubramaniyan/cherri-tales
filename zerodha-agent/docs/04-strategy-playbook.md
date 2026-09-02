# 04 — Strategy playbook

Candidate strategies for the two windows you asked for: the open and the close.
**None of these are validated.** They are well-documented intraday patterns
written down precisely enough to be backtested. [06](06-rollout.md) is the gate
that decides which, if any, survive contact with your data.

Everything here is NSE equity intraday (MIS product), cash segment. F&O is
deliberately out of scope for the first year — see the end of this doc.

## Universe filters (applied pre-market, before ranking)

A name is eligible only if **all** hold:

| Filter | Threshold | Why |
|---|---|---|
| Average daily turnover (20d) | ≥ ₹200 crore | Slippage on exit is the silent killer at small size; illiquid names gap through stops |
| Price | ₹100 – ₹5,000 | Below ₹100, tick size dominates the edge; above ₹5,000, position granularity gets coarse at small capital |
| Prior-day ATR(14) as % of price | 1.2% – 6% | Below, there is no range to capture after costs; above, stops get too wide to size sanely |
| F&O ban period | Must **not** be in ban | Distorted pricing, poor exits |
| Corporate action ex-date today | Excluded | Price discontinuities break level logic |
| Results announced today | Excluded by default | Binary event; stops are meaningless through a results gap |
| Circuit band | Not 2%/5% banded | Cannot exit a locked circuit |
| Listed | > 6 months | No reliable prior-day statistics |

Cap the approved watchlist at **5 names**. More candidates does not mean more
opportunity; it means more ways to hit the daily loss limit.

## Session A — the open (09:30–10:30)

The 09:15–09:30 window is **observation only**. The opening auction and the first
minutes are the noisiest, widest-spread part of the day, and entering into it is
how the first stop-out of the day happens before the thesis exists.

### A1. Opening Range Breakout (ORB), 15-minute range

The primary strategy.

- **Range:** high and low of 09:15–09:30 on the 1-minute series.
- **Long trigger:** last traded price breaks above range high, **and**
  - cumulative volume in the breakout minute ≥ 1.5× the average of the range's
    per-minute volume (rejects driftless breaks), **and**
  - price is above the session VWAP (rejects breaks that are still net-sold), **and**
  - the name's return since open exceeds Nifty's return since open by ≥ 0.3pp
    (relative strength — only trade the names actually leading the move), **and**
  - the range width is between 0.4% and 2.5% of price (too tight = noise breakout;
    too wide = the stop is unaffordable).
- **Short trigger:** mirror image. Only on names with `side_bias` short and no
  borrow/short restrictions; MIS shorts are intraday-only by construction.
- **Stop:** opposite side of the opening range, or `1.0 × ATR(14) / 3`, whichever
  is *tighter*, floored at 0.35% to avoid getting shaken out by spread.
- **Targets:** scale out **50% at 1R**, move stop to breakeven, trail the
  remainder by the 5-minute swing low (long) until stopped or the 15:15 flatten.
- **One entry per symbol per day.** A stopped-out ORB is not re-entered. This
  single rule removes the most expensive failure mode in intraday systems.
- **Invalidation:** if the name gaps more than `invalidate_if_gap_pct_above`
  (default 3%) from prior close, drop it — the agent's overnight thesis was
  priced in before you could act.

### A2. Gap continuation vs gap fade

A classifier on top of A1, not a separate entry:

- Gap **with** a same-direction catalyst identified by the research agent
  (results beat, sector news, peer move) and holding above the 09:15–09:30 VWAP
  → treat as continuation, take the ORB break normally.
- Gap **without** an identified catalyst → treat as noise, and require the
  additional confirmation of a VWAP reclaim after an initial failed push before
  arming. If no catalyst and no reclaim, skip the name.

This is exactly the kind of judgement that belongs in the pre-market agent
(`catalyst` field in the watchlist) and not in the executor.

## Session B — the close (14:45–15:10)

Late-day flow is more directional and better-behaved than midday. Entries here are
smaller and stricter, because the runway to the 15:15 flatten is short.

### B1. Trend-day close continuation

- **Precondition:** the name has spent ≥ 70% of the session on one side of VWAP
  and is within 0.5% of the session high (long) or low (short) at 14:45.
- **Trigger:** break of the 14:00–14:45 range in the trend direction.
- **Stop:** VWAP, or 0.5 × ATR, whichever is tighter.
- **Target:** no fixed target. Trail to the 15:15 flatten. The edge here is the
  close-auction drift, and it pays at the bell.
- **Size:** 0.5× the normal risk unit. Short runway, no second chance.

### B2. VWAP mean-reversion (defensive, optional)

Only enabled after Phase 3, and only on the two most liquid names on the list:
if a name is > 1.5 ATR from VWAP at 14:45 with no fresh catalyst, take the
reversion toward VWAP with a hard 15:10 time stop. **Do not enable this early** —
mean reversion feels good and loses money whenever a trend day continues.

## What is deliberately excluded

- **No averaging down. Ever.** Not as a rule you follow — as code that cannot
  express the operation.
- **No overnight positions.** Everything is MIS, everything is flat by 15:15.
  This eliminates gap risk entirely, which is the single largest source of
  uncontrolled loss for a small account.
- **No options or futures in year one.** 91% of individual equity-derivatives
  traders lost money in FY25. Leverage does not fix a strategy without edge; it
  accelerates the outcome. Revisit only with 12 months of profitable equity
  intraday behind you.
- **No midday entries.** 10:30–14:45 is management only.
- **No news-triggered intraday entries.** Latency-disadvantaged by construction —
  you cannot beat the market to a headline through an LLM and a retail API.

## Cost model — the reason most of this fails on paper

Backtests must charge, per round trip: brokerage (Zerodha intraday is the lower of
0.03% or ₹20 per executed order), STT on the sell side, exchange transaction
charges, SEBI turnover fees, stamp duty on the buy side, GST on brokerage+charges,
**plus modelled slippage of at least 0.05% per side** — more for anything near the
turnover floor.

On a ₹25,000 account with 5× MIS leverage, a round trip on a ₹1.25L position runs
roughly ₹40–60 in charges before slippage. **A strategy with an average win of
0.4% is roughly breakeven after costs.** Any backtest that does not model this
honestly will show an edge that does not exist. Model costs first, then look at
the equity curve — never the other way round.

## Source

- [SEBI study — 91% of individual equity derivatives traders incurred net losses in FY25](https://blogs.cfainstitute.org/marketintegrity/2025/11/05/indias-derivatives-market-and-retail-investors/)
