# Demo Scenarios

## Scenario 1: Standard Send (L30)
1. Login
2. Open `Send`
3. Choose `Maria Rodriguez`
4. Keep mode `Send Exactly`
5. Enter `$250`
6. Continue to review
7. Accept disclosure
8. Send
9. Observe success and tracked transaction in `Transactions`

Expected:
- Quote appears and expires in 45s
- Transfer auto-progresses across machine states
- Notification emitted for transfer updates

## Scenario 2: Cooling-Off Recipient
1. Open `Connections`
2. Select recipient `Ana Garcia` (state: `validated_new`)
3. Attempt send shortcut

Expected:
- Send action blocked while cooling-off active
- UI indicates cooling-off end time

## Scenario 3: Signal-Only Notifications
1. Open `Notifications`
2. Toggle `Signal Mode`
3. Verify promotions hidden
4. Click `Mark all as read`

Expected:
- Promotion entries removed from visible list
- Unread count decrements to zero

## Scenario 4: Receive Request from Template
1. Open `Receive`
2. Apply template `Monthly Rent`
3. Generate request

Expected:
- Request added to recent list
- Shareable/QR section updates with amount
