# QA Checklist

## Engineering Gates
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run test:e2e`

## Send Flow
- [ ] Recipient selection required
- [ ] Tier restrictions enforced (mode + funding)
- [ ] Quote expires after 45s and refresh works
- [ ] Disclosure checkbox required
- [ ] Success path generates tracked transaction

## Receive + Connections
- [ ] Add recipient validates duplicate and limits
- [ ] Cooling-off recipients cannot be sent to
- [ ] Request templates populate form
- [ ] Request creation updates recent list

## Transactions + Notifications
- [ ] Search/filter updates visible transactions
- [ ] CSV export downloads valid CSV
- [ ] Timeline renders selected transaction detail
- [ ] Notification signal mode hides promotions
- [ ] Mark-all-read updates unread counters

## Reliability + UX
- [ ] Error boundary fallback renders on runtime crash
- [ ] Keyboard-only navigation reaches primary actions
- [ ] Mobile bottom navigation remains usable
- [ ] Reduced-motion settings do not break core flows
