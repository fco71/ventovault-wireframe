# Transfer Machine Contract

## States (13)
1. `initiated`
2. `quoted`
3. `authorized`
4. `funding_pending`
5. `funded`
6. `under_review`
7. `approved`
8. `conversion`
9. `settlement`
10. `payout`
11. `completed`
12. `failed`
13. `refunded`

## Allowed Transitions
- `initiated` -> `quoted`, `failed`
- `quoted` -> `authorized`, `failed`
- `authorized` -> `funding_pending`, `failed`
- `funding_pending` -> `funded`, `failed`, `refunded`
- `funded` -> `under_review`, `conversion`, `failed`
- `under_review` -> `approved`, `failed`, `refunded`
- `approved` -> `conversion`, `failed`
- `conversion` -> `settlement`, `failed`
- `settlement` -> `payout`, `failed`
- `payout` -> `completed`, `failed`, `refunded`
- `failed` -> `refunded`
- `completed` and `refunded` are terminal

## Tier Rules
- L20: `send_exact` only, ACH only, max $500 per transfer
- L30/L40: `send_exact` and `receive_exact`, ACH + debit card
- Cooling-off: 24h (L20), 6h (L30), 0h (L40)

## Validation Guards
- Minimum transfer: $10
- Per-transfer, daily, and monthly checks
- Recipient state checks (`pending_validation`, `validated_new` cooling-off, `flagged`)
- Quote expiry checks (45 seconds)

## Source of Truth
- Machine logic: `src/state/transferMachine.ts`
- Contract types: `src/types/index.ts`
- Mock orchestration: `src/services/mock/transferService.ts`
