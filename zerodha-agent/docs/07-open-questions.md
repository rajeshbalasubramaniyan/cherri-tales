# 07 — Open questions

Decisions needed from you before implementation starts. Grouped by whether they
block the next step.

## Blocking — needed before any code

1. **Segment.** NSE equity cash intraday only, as the playbook assumes? Or do you
   want index options in scope? This changes the risk model substantially, and
   [04](04-strategy-playbook.md) recommends against options for year one.
2. **Starting capital for Phase 2.** The docs assume ₹25,000. Confirm, since every
   sizing threshold in [05](05-guardrails.md) is a percentage of it.
3. **Static IP host.** AWS `ap-south-1` + Elastic IP, or a fixed-IP VPS? You need
   this provisioned and whitelisted in the Kite developer account before *any*
   live order can be placed ([02](02-regulatory.md)).
4. **Do you already have a Kite Connect app + API key?** If not, that signup (and
   the ₹500/month data tier) is step one — Phase 0 backtesting needs historical
   candles.

## Blocking — needed before Phase 0 backtesting

5. **News and global-cues data source.** The research agent needs overnight US/Asia
   closes, GIFT Nifty, sector news, and a results calendar. Options: a paid news
   API, RSS aggregation, or web search at run time. Point-in-time historical news
   is the hard part — without it, the agent's contribution can't be backtested
   honestly, only forward-tested in Phase 1. This is the single biggest unresolved
   item.
6. **How far back does the backtest go?** Kite historical data has depth limits per
   candle interval. Two years of 1-minute data across a universe is a lot of API
   calls at 3 req/sec — this needs a one-time bulk pull with a rate-limited
   downloader and local storage.

## Non-blocking — decide during implementation

7. **Repo extraction.** Confirm this moves to its own private repo before
   implementation. Recommended in the [README](../README.md).
8. **Daily access-token refresh.** Kite tokens rotate daily and the login flow is
   interactive. Semi-automated (you approve on your phone at 08:30, same time as
   the watchlist) is the safe default. Fully automating a broker login is possible
   and is a meaningful security decision — worth doing deliberately rather than
   by default.
9. **Alerting channel.** Telegram bot, ntfy, or push? Needs to be something you'll
   actually see at 09:31.
10. **Approval UI.** Phases 2–3 need you to approve a watchlist from your phone.
    Simplest viable: the summary in the alert, approval by replying. A small web
    page is nicer but is scope.
11. **Tax modelling.** Intraday equity gains are speculative business income, with
    different treatment from delivery gains, and audit thresholds may apply at
    volume. Not a code blocker, but it changes what "profitable" means — worth a
    CA conversation before Phase 4.

## Things I'd want to pressure-test with you

- **Whether the LLM earns its place.** Phase 0 runs the strategy with and without
  the research agent precisely to answer this. Worth agreeing now that if the
  mechanical filter matches the agent, the agent gets cut. It's a good result, not
  a failure.
- **Your actual time budget.** Phases 2–3 require a daily 08:30 approval and a
  weekly Friday review. If that won't happen reliably, the design should change —
  an unapproved-watchlist day is a no-trade day, and a system that silently stops
  trading isn't the one you asked for.
- **What outcome would make you stop.** Worth writing down a number now, while it's
  abstract. The demotion triggers in [06](06-rollout.md) are my proposal; the final
  "stop entirely" threshold should be yours.
