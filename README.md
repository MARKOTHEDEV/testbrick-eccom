# Kiln & Co.

A small demo ceramics shop built to be tested with TestBrick: email OTP signup (6 boxes), basket, discount code, checkout with a test card, order email.

## Test data
- Card `4242 4242 4242 4242`, any future MM/YY, any 3-digit code. `4000 0000 0000 0002` is declined.
- Discount code `FIRSTFIRE` (10% off). Free shipping from $75. VAT 7.5%.
- Tide Vase in Terracotta is sold out.

## Break switch (`KILN_BREAK`)
- `checkout` — placing an order fails with "We couldn't reach the payment service."
- `totals` — the order summary total forgets to add shipping.
- `otp` — the emailed code never verifies.

See `.env.example` for the environment variables.
