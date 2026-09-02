# 02 — Regulatory: the retail algo framework, as it stands now

This is not background reading. Two of these rules will reject your orders
outright if you get the deployment wrong, so settle them before writing code.

## Where things stand (September 2026)

SEBI issued circular `SEBI/HO/MIRSD/MIRSD-PoD/P/2025/0000013` on **4 February 2025**,
creating a formal framework for retail participation in algorithmic trading. NSE
followed with implementation standards. The phase-in ran through 2025 —
brokers live from 1 October 2025, exchange registration of algo products by
30 November 2025 — and the framework became **fully mandatory on 1 April 2026**.

That date has passed. Everything below is live, not upcoming.

## What binds you, as an individual trading your own account

### 1. Static IP is mandatory — no exceptions, no threshold

Every order sent through Kite Connect must originate from an IP address you have
whitelisted in your Kite Connect developer account. **Orders from an unregistered
IP are rejected**, regardless of how few orders you place. This flows from SEBI's
requirement that brokers "not permit open APIs and allow access only through a
unique vendor client specific API key and static IP whitelisted by the broker."

Practical consequences:

- **Serverless is out.** Lambda, Cloud Functions, Heroku dynos, Railway, GitHub
  Actions runners — all have rotating egress IPs. Your existing Firebase Functions
  habit does not transfer here.
- You need a **VPS or cloud VM with a fixed/elastic IP**. AWS `ap-south-1`
  (Mumbai) with an Elastic IP is the obvious default: closest region to the
  exchanges, and the IP survives instance replacement.
- The whitelist is configured at the **developer-account level and applies to all
  apps under it** — you cannot scope a different static IP per app. Plan for one
  IP covering backtest, paper and live, or separate developer accounts.
- Only **order endpoints** are IP-validated. WebSocket market data, order book,
  positions and the rest stay reachable from anywhere — so a laptop or the hosted
  Kite MCP can still *read* your account fine. Only the executor needs the fixed IP.
- IP sharing is permitted within a family (self, spouse, dependent children,
  dependent parents) and nowhere else.

### 2. 10 orders per second, hard

A strict 10 OPS limit applies at the API; requests above it get HTTP 429.
Separately, the **Threshold Orders Per Second (TOPS)** in the regulation is set at
10 OPS per exchange per client, and crossing it changes your regulatory status:

- **Below 10 OPS** — a self-developed algo for your own use (or immediate family)
  does **not** require exchange registration or an algo ID.
- **At or above 10 OPS** — the strategy must be registered through your broker
  with the exchange and receive an official algo ID before it can keep running.

The strategies in [04](04-strategy-playbook.md) place on the order of **2–8 orders
per day**. You will never approach 10 per second. Design to stay there
deliberately: it is the difference between "personal script" and "registered algo
product". Put a rate limiter in the risk kernel that caps you far below the
threshold anyway — 1 order/sec is more than enough and makes accidental
loops harmless.

### 3. All API orders are tagged as algo orders

Every order placed through the API is categorised as an algo order and is
tagged and monitored at the broker level for audit, whether or not you register
anything. Assume full traceability. Use the Kite order `tag` field yourself with a
strategy identifier — it costs nothing and makes your own post-trade attribution
possible.

### 4. Order type restrictions

- **Market orders require market protection.** An order with market protection
  set to `0` is rejected — this includes SL-M orders. Set an explicit market
  protection percentage on every market/SL-M order or it will bounce.
- **MCX does not support IOC** in the algo segment. Irrelevant if you stay in
  NSE equity/F&O, which the playbook assumes.

## What this means for the build

| Requirement | Design response |
|---|---|
| Static IP on order endpoints | Executor runs on a fixed-IP Mumbai VM; whitelist that IP; document the IP in `infra/` and treat changing it as a change-controlled event |
| Rejection from unregistered IP | Startup self-check: place a deliberately invalid order and assert the error is *not* an IP rejection, before the market opens |
| < 10 OPS | Token bucket at 1 order/sec in the risk kernel; a hard daily order cap well under 3,000 |
| Algo tagging | Every order carries `tag=<strategy>-<date>` for attribution |
| Market protection | Executor never sends a market/SL-M order without an explicit protection pct |

## Not covered here

Taxation of intraday gains (speculative business income), audit thresholds, and
STT/stamp duty modelling. These matter for real net returns — intraday costs
meaningfully change which strategies are viable — and the backtest must model
them. Flagged in [07 — Open questions](07-open-questions.md).

## Sources

- [Explaining the latest SEBI algo trading regulations (Zerodha Z-Connect)](https://zerodha.com/z-connect/business-updates/explaining-the-latest-sebi-algo-trading-regulations)
- [A comprehensive overview of NSE's circular on the new retail algo trading framework](https://zerodha.com/z-connect/general/a-comprehensive-overview-of-nses-circular-on-the-new-retail-algo-trading-framework)
- [Preparing to comply with SEBI's retail algo rules — static IP, ratelimits, order types (Kite Connect forum)](https://kite.trade/forum/discussion/15912/preparing-to-comply-with-sebis-retail-algo-rules-static-ip-ratelimits-order-types)
- [SEBI circular: safeguarding retail investors in algorithmic trading (Mondaq)](https://www.mondaq.com/india/commoditiesderivativesstock-exchanges/1581380/sebi-circular-safeguarding-retail-investors-in-algorithmic-trading)
- [NSE releases implementation standards for retail participation in algorithmic trading](https://www.finseclaw.com/article/nse-releases-implementation-standards-for-retail-participation-in-algorithmic-trading)
- [NSE issues new compliance norms for retail algo trading (Groww)](https://groww.in/blog/nse-issues-new-compliance-norms-for-retail-algo-trading)
- [Static IP for Zerodha Kite Connect API](https://staticip.in/brokers/zerodha)
