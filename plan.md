# Women's World — E-Commerce Platform: Project Plan

## 1. Context

Client: Women's World, a women's & kids' clothing retail shop, Indira Nagar, Nashik, Maharashtra.
Existing physical store rating: 5.0 (24 reviews). Product range: everyday wear, kids' clothing, occasion wear.
Goal: full e-commerce platform (catalog + cart + checkout + payment + order management), not a static catalog site.

Owner will not write code. Site must be self-service for product management post-launch.

## 2. Tech Stack (locked)

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR/SEO for product pages, matches builder's existing skillset (React) |
| Styling | Tailwind CSS | Fast iteration, no design system lock-in |
| Backend | Next.js API routes / Route Handlers | No separate backend service needed at this scale |
| Database | PostgreSQL via Supabase or Neon | Managed, cheap/free tier, easy migration path |
| ORM | Prisma | Type-safe schema, migrations |
| Auth | NextAuth.js (admin) + guest checkout (customers) | Don't force customer accounts — kills conversion for small retail |
| Payments | Razorpay | UPI/cards/netbanking/COD standard for Indian retail |
| Image storage | Cloudinary or Supabase Storage | Product photos, on-the-fly resizing |
| Hosting | Vercel (app) + Supabase/Neon (DB) | Free tier sufficient at launch scale |
| Shipping | Flat-rate initially; Shiprocket integration later if volume justifies it | Avoid over-engineering for a single-shop launch |

## 3. Core Entities (DB schema, high level)

- **Product**: id, name, description, category, sizes[], colors[], price, discountPrice, stock (per variant), images[], isActive, createdAt
- **Category**: id, name, slug (Women / Kids / Occasion Wear / etc.)
- **Variant**: productId, size, color, stock, sku
- **Order**: id, customerName, phone, address, items[], totalAmount, paymentStatus, orderStatus (placed/confirmed/shipped/delivered/cancelled), razorpayOrderId, createdAt
- **OrderItem**: orderId, productId, variantId, quantity, priceAtPurchase
- **AdminUser**: id, email, passwordHash, role
- **Coupon** (phase 2, optional): code, discountType, value, expiresAt

## 4. Feature Scope by Phase

### Phase 1 — MVP (launch-critical)
- Product catalog: browse by category, filter by size/price, search
- Product detail page: images, sizes, price, stock status, add to cart
- Cart: add/remove/update quantity, persists across session (localStorage or DB-backed for logged-in)
- Guest checkout: name, phone, address, no account required
- Razorpay payment integration (UPI, cards, COD as fallback)
- Order confirmation (on-screen + SMS/WhatsApp or email)
- Admin panel: add/edit/delete products, manage stock, view orders, update order status
- Mobile-responsive (majority of traffic will be mobile in this segment)

### Phase 2 — Post-launch
- Customer accounts (order history, saved addresses)
- Coupons/discounts
- Reviews on product pages
- WhatsApp order notifications (Twilio/WhatsApp Business API)
- Basic analytics dashboard (top products, revenue trend)
- Shiprocket integration if pan-India shipping volume grows

### Explicitly out of scope for now
- Multi-vendor support
- Loyalty/rewards program
- Native mobile app

## 5. Folder Structure (proposed)

```
/app
  /(storefront)
    /page.tsx                → home
    /products/[slug]/page.tsx
    /category/[slug]/page.tsx
    /cart/page.tsx
    /checkout/page.tsx
  /admin
    /dashboard/page.tsx
    /products/page.tsx
    /orders/page.tsx
  /api
    /products/route.ts
    /orders/route.ts
    /payment/razorpay/route.ts
    /webhook/razorpay/route.ts
/components
/lib
  /prisma.ts
  /razorpay.ts
/prisma
  /schema.prisma
```

## 6. Payment Flow (Razorpay)

1. Customer completes checkout form → order created in DB with status `pending`
2. Backend creates Razorpay order via API, returns order ID to frontend
3. Razorpay checkout widget opens client-side
4. On success, Razorpay webhook hits `/api/webhook/razorpay` → verify signature → update order to `paid`
5. Admin sees order in dashboard, updates fulfillment status manually

COD path: order created as `pending`, marked `confirmed` without payment step, settled on delivery.

## 7. Environment Variables (to be provisioned)

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
CLOUDINARY_URL= (or SUPABASE_STORAGE keys)
```

## 8. Open Decisions (need owner/uncle input before or during build)

- [ ] Shipping: local-only, pan-India, or in-store pickup + delivery hybrid?
- [ ] Domain name — does he own one already?
- [ ] Initial product data source: spreadsheet export, or manual entry via admin panel from day one?
- [ ] Who does day-to-day product/order management post-launch — confirm it's the uncle himself, so admin UX needs to be genuinely non-technical (large buttons, no jargon, mobile-friendly admin too, since he may manage from phone).
- [ ] Budget ceiling for Razorpay transaction fees (~2% per transaction) — confirm he's aware this is a per-order cost, not one-time.

## 9. Build Order (for Antigravity execution)

1. Scaffold Next.js + Tailwind + Prisma, connect DB
2. Define schema, run migrations, seed with placeholder products
3. Build storefront: home → category → product detail → cart
4. Build checkout flow (form → order creation, no payment yet)
5. Integrate Razorpay (test mode)
6. Build admin panel: auth, product CRUD, order list/status update
7. Mobile responsiveness pass
8. Razorpay live mode + webhook verification
9. Deploy to Vercel, connect domain
10. Seed real product data (photos from shop, priced by uncle)
