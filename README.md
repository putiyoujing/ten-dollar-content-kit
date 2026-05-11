# 2026 Job Search Kit Storefront

A Cloudflare Pages storefront for a digital download product:

- Product: `2026 Job Search Kit`
- Launch price: `$9`
- Public site: https://kit.toolnaps.com/
- Private product ZIP: `private-products/2026-job-search-kit-v1.zip`

The ZIP is intentionally ignored by Git and Cloudflare Pages. Do not publish it as a public static asset.

## Product Contents

The private ZIP includes:

- Excel job application tracker with dashboard, weekly plan, networking tracker, and interview prep
- ATS-friendly resume template
- Cover letter template
- LinkedIn About templates
- Follow-up email scripts
- AI job-search prompts
- Start-here guide

## Sales Flow

1. Visitor submits the payment-link request form on the site.
2. Cloudflare Pages Function creates a private GitHub issue.
3. Seller sends a Payhip/Gumroad/PayPal checkout link.
4. After payment, buyer receives the ZIP through the payment platform or manually by email.

## Deployment

Deploy with Cloudflare Pages:

```powershell
wrangler pages deploy . --project-name content-rescue-kit --branch master --commit-dirty=true
```

The hosted request form is handled by `/api/order`.
