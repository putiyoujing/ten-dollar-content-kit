# $10 Content Rescue Kit

A tiny public storefront for a fixed-price content micro-service.

## Offer

For $10, one customer gets:

- 10 hooks or titles
- 3 cover or thumbnail lines
- 1 ready-to-post caption/body draft
- 5 comment prompts or reply starters

## Order Flow

1. Customer submits the hosted order form on the site.
2. The Cloudflare Pages Function creates a private order issue.
3. Payment method is confirmed before work begins.
4. Delivery is sent within 24 hours.

## Deployment

The site is deployed on Cloudflare Pages:

https://kit.toolnaps.com/

The hosted order form is handled by a Cloudflare Pages Function at `/api/order`.
