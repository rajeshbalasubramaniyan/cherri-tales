# 06 — Rollout: from backtest to real capital

You said: start with lower funds, scale as confidence builds. This is that ladder,
made explicit, with the promotion criteria decided **now** — before there is money
on the table and a reason to negotiate with yourself.

## The ladder

| Phase | Capital | Duration gate | Sample gate | What runs |
|---|---|---|---|---|
| **0 — Backtest** | ₹0 | — | ≥ 250 trades over ≥ 2 years incl. one drawdown regime | Historical replay, full cost model |
| **1 — Paper** | ₹0 | ≥ 40 trading days | ≥ 60 trades | Full live stack, orders logged not sent |
| **2 — Micro** | ₹25,000 | ≥ 20 trading days | ≥ 30 trades | Live, 1 trade/day max, manual watchlist approval |
| **3 — Small** | ₹1,00,000 | ≥ 40 trading days | ≥ 60 trades | Live, up to 3 trades/day, manual approval |
| **4 — Base** | ₹3,00,000 | ≥ 60 trading days | ≥ 100 trades | Live, full playbook, approval optional |
| **5 — Scale** | Step +50% per quarter | Per quarter | ≥ 100 trades/quarter | Full autonomy within limits |

**Both gates must pass.** Twenty profitable days on four trades is noise, not
evidence.

## Promotion criteria (all must hold, measured on the phase just completed)

| Metric | Threshold | Why this number |
|---|---|---|
| Profit factor (gross win ÷ gross loss) | ≥ 1.3 | Below this, costs and one bad week erase the edge |
| Max drawdown | ≤ 6% of phase capital | If it breaches here, it breaches worse with size |
| Win rate × avg win / avg loss | Expectancy > 0 after **all** costs | The only number that actually matters |
| Rule violations | **0** | A single unexplained violation blocks promotion. Non-negotiable |
| Slippage vs backtest assumption | Within 1.5× | If real slippage is 3× modelled, the backtest was fiction |
| Days the daily loss limit tripped | ≤ 10% of days | More often means sizing is wrong, not luck |
| Reconciliation mismatches | 0 | Any mismatch is a correctness bug |

## Demotion triggers (automatic, no discussion)

- Monthly drawdown > 8% → drop one capital tier.
- Two consecutive losing months → drop to Phase 1 (paper) and re-derive.
- Any unexplained state divergence → halt, drop one tier, fix, re-qualify.
- Live profit factor falls below 1.0 over a rolling 40 trades → back to paper.
- Real slippage exceeds 2× the backtest assumption → back to paper, re-model costs.

**Demotion is the mechanism that makes the whole thing safe to scale.** A ladder
that only goes up is a ladder that ends at the largest loss you can take.

## Phase 0 specifics — the honest backtest

The most common way this project fails is a backtest that lies. Requirements:

- **Costs modelled per the table in [04](04-strategy-playbook.md)** — brokerage,
  STT, exchange charges, SEBI fees, stamp duty, GST, plus ≥ 0.05%/side slippage.
- **No lookahead.** Signals computed only from data available at the decision
  timestamp. The classic leak: using the day's ATR to size a trade taken at 09:31.
- **Survivorship bias.** Universe must be reconstructed as of each historical date,
  including names since delisted or fallen below the turnover floor.
- **Walk-forward, not a single fit.** Parameters tuned on a window, tested on the
  next, rolled forward. Anything tuned on the whole history is a curve fit.
- **The watchlist is replayed too.** Since the agent's judgement can't be
  backtested, run Phase 0 twice: once with the agent's real historical watchlists
  (expensive but honest, generated day-by-day on point-in-time data), and once
  with a mechanical filter that has no LLM at all. **If the mechanical version
  performs as well, the agent is decoration** — and that is a genuinely possible
  outcome worth knowing before you build around it.

## Phase 1 specifics — paper trading

Paper must run the **entire live stack**, with only the final broker call
stubbed. Same tick stream, same state machine, same risk kernel, same 09:07
startup checks. Anything simulated other than the order call is untested code
that will first execute with real money.

Record for every paper trade what price you *would* have got, using the actual
bid/ask at signal time — not the LTP. The gap between those two numbers is your
real slippage, and it is usually the difference between a viable and an unviable
strategy.

## What "confidence" should mean here

Not a feeling after a good week. A promotion is warranted when:

1. The sample is large enough that the result isn't noise (the trade gates above).
2. The system behaved exactly as specified — zero rule violations, zero
   reconciliation mismatches.
3. Live results match backtest expectations within tolerance. **A system that
   makes money for reasons you can't explain is as much a problem as one that
   loses** — you can't tell when it stops working.

If all three hold, size up on the schedule. If any fails, the ladder holds or
steps down. The decision is arithmetic from the journal, made on a Friday, not a
judgement call made on a Tuesday afternoon.
