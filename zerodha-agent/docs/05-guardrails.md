# 05 — Guardrails: the risk kernel

The part that matters most. A mediocre strategy with a good risk kernel survives
to be improved; a good strategy without one doesn't get a second month.

**Design rule: the risk kernel is the only module in the codebase that imports the
order API.** Every other component calls `risk.submit(intent)` and receives an
approval or a veto. Nothing can route around it, because nothing else has the
capability. This is enforced by an import-lint test in CI, not by convention.

## Layer 1 — Position sizing (before an order exists)

Risk-based sizing, never rupee-fixed:

```
risk_per_trade  = account_equity × RISK_PCT          # Phase 1: 0.4%
stop_distance   = |entry_trigger − stop_price|
raw_qty         = risk_per_trade / stop_distance
qty             = floor(raw_qty × confidence_scalar)
```

- `confidence_scalar = clamp(watchlist.confidence, 0.5, 1.0)` — the agent's
  conviction may *shrink* size, never grow it past the cap.
- Hard ceiling: **no single position exceeds 25% of deployable margin**,
  whatever the arithmetic says.
- If `qty < 1` after all of this, **skip the trade**. Do not widen the stop to make
  a position fit. Widening a stop to afford a trade is how a 0.4% risk becomes a 2% loss.
- Reject if `stop_distance` is below 0.35% of price (spread noise) or above
  1.5 × ATR(14) (thesis is too vague to be tradeable).

## Layer 2 — Hard limits (checked on every submit)

| Limit | Phase 1 value | Behaviour on breach |
|---|---|---|
| Risk per trade | 0.4% of equity | Reject order |
| **Max daily loss** | **2.0% of equity** | **Flatten all, disable trading for the day** |
| Max concurrent positions | 2 | Reject order |
| Max trades per day | 4 | Reject order |
| Max consecutive losers | 2 | Disable trading for the day |
| Max orders per second | 1 | Queue (never breach the regulatory 10 OPS) |
| Max orders per day | 40 | Kill switch — a breach means a bug, not a strategy |
| Weekly loss limit | 4% of equity | Disable trading until Monday + manual review |
| Monthly drawdown | 8% of equity | Demote a capital tier ([06](06-rollout.md)) |

The daily loss limit is computed on **realised + unrealised** P&L, evaluated on
every tick, not on every order. A position moving against you between orders must
still trip it.

## Layer 3 — Circuit breakers (pre-trade, per order)

Every one of these fails **closed** — on error, ambiguity, or missing data, the
answer is no.

1. **Kill switch.** A `HALT` file on disk or a `halted` row in the DB. Checked
   before every single order. Settable by you from your phone. When set: cancel
   all open orders, flatten all positions, refuse everything until cleared
   manually. This is the last line and must be trivially reachable.
2. **Stop-loss co-submission.** An entry order is only approved if its protective
   stop order is submitted in the same transaction. If the stop fails to place,
   the entry is immediately reversed at market. **No naked position exists for
   more than a few seconds, ever.** This is the single highest-value guardrail here.
3. **Market protection.** Every market/SL-M order carries an explicit market
   protection percentage. Protection `0` is rejected by the broker anyway
   ([02](02-regulatory.md)); assert it locally so you find out in tests, not at 09:31.
4. **Spread guard.** Reject if `(ask − bid) / ltp > 0.15%`. A wide spread at entry
   means a worse one at exit.
5. **Slippage guard.** If actual fill deviates from the trigger price by more than
   0.3%, cancel any unfilled remainder and flag it. Three slippage flags in a day
   → halt: something about the liquidity assumption is wrong.
6. **Staleness guard.** If the last tick for a symbol is older than 5 seconds,
   refuse to act on it. Reconnect the WebSocket, then re-evaluate.
7. **Margin guard.** Refuse if the order would consume > 80% of available margin.
   Never rely on the broker to reject you — a margin-rejected order in the middle
   of a scale-out leaves the book in a state the state machine did not plan for.
8. **Duplicate guard.** Every order carries a deterministic idempotency tag
   (`{strategy}-{symbol}-{date}-{seq}`). A resubmit of an existing tag is dropped.
   This is what makes crash-restart safe.
9. **Clock guard.** Refuse to trade if system time drifts > 2s from NTP. Every
   window boundary in [04](04-strategy-playbook.md) is time-based.
10. **Universe guard.** Symbol must be in the approved watchlist. Not in it →
    rejected, with an alert, because it means the executor has a bug.

## Layer 4 — Time-based (the ones you cannot argue with)

- **No entries before 09:30.** Observation window.
- **No entries 10:30–14:45.** Dead zone.
- **No entries after 15:10.**
- **15:15 — flatten everything, unconditionally.** Ten minutes before Zerodha's
  auto square-off (15:25 equity / 15:26 F&O) so you exit at your price rather than
  the broker's. Never let the broker square you off: their square-off is a market
  order into whatever is there.
- **Position time stop:** any position open > 90 minutes without reaching 1R is
  closed. If the thesis were right, it would have worked by now.

## Layer 5 — Reconciliation (continuous)

Every 30 seconds, and after every fill, compare internal state against
`kite.positions()` and `kite.orders()`:

- Position quantity mismatch → **halt immediately, alert, do not self-heal.**
  Auto-correcting a state divergence you don't understand is how a small bug
  becomes a large loss.
- Orphaned stop order (stop live, no position) → cancel it.
- Orphaned position (position live, no stop) → place the stop, or flatten if that
  fails. This is the scenario the co-submission rule exists to prevent, but assume
  it will happen anyway.
- Broker rejection reasons are logged verbatim and classified. An unrecognised
  rejection reason halts the day.

## Layer 6 — Behavioural

Guardrails against you, not the code. These are the ones that decide outcomes
over a year.

- **No manual overrides during market hours.** You may HALT. You may not un-halt,
  raise a limit, or add a symbol while the market is open. Config changes take
  effect the next trading day. There is no exception for "this one is obvious" —
  that feeling is precisely the one the rule exists to block.
- **Capital tier changes are weekly decisions**, made from the journal against the
  criteria in [06](06-rollout.md), never intraday and never after a good day.
- **A losing day ends the day.** The daily loss limit is not a suggestion to be
  reset — the process exits and does not restart until tomorrow.
- **The journal is written whether or not you want to read it.** Every trade
  records the agent's original thesis alongside the outcome. Thesis-vs-outcome
  attribution over 100 trades is the only way to learn whether the research agent
  is contributing anything at all — and the honest possibility that it isn't is
  the thing worth measuring.

## Failure-mode checklist

Every one of these needs a test before live capital:

| Failure | Required behaviour |
|---|---|
| WebSocket disconnects mid-position | Reconnect with backoff; if not restored in 30s, flatten via REST |
| Executor crashes holding a position | On restart, reconcile from broker truth; adopt orphans; never double-enter |
| Broker API returns 429 | Exponential backoff; never spin; orders queue, they don't drop |
| Access token expires mid-session | Halt + alert. Do not attempt silent re-auth in the hot path |
| Watchlist missing or stale at 09:07 | Do not trade today |
| Two strategies signal the same symbol | First one wins; second rejected by universe/duplicate guard |
| Internet dies on the VM | Broker's 15:25 auto square-off is the backstop. Accept the slippage; this is why the self-imposed 15:15 flatten exists |
| NTP drift | Halt |
