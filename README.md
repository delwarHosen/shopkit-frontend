# E-commerce (Next.js)

```bash
npm install
npm run dev
```

http://localhost:3000 খুলুন।

## ক্লায়েন্ট কনফিগ
`src/config/client.ts` বদলালেই নাম, কালার, ফিচার বদলে যাবে।

## shadcn কম্পোনেন্ট যোগ করতে
```bash
npx shadcn@latest add button card input
```

## ফোল্ডার
- `src/app/(shop)` → স্টোরফ্রন্ট
- `src/app/(auth)` → লগইন/রেজিস্টার
- `src/app/(dashboard)/admin` → ড্যাশবোর্ড
- `src/data` → ফেক ডেটা
- `src/lib/services` → ডেটা ফাংশন (পরে আসল API বসবে)
- `src/components/ui, layout, shop, dashboard`

## State (Redux Toolkit + RTK Query)
- `src/store/slices` → cart, ui (ক্লায়েন্ট স্টেট)
- `src/store/api` → RTK Query (baseApi + পরে injectEndpoints)
- `src/store/hooks.ts` → `useAppDispatch`, `useAppSelector`
- সার্ভার কম্পোনেন্টে (SSR/SSG/ISR) সরাসরি `lib/services` ফাংশন ডাকবেন, RTK Query শুধু ক্লায়েন্ট কম্পোনেন্টে।
# shopkit-frontend
