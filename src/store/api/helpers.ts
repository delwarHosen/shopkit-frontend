import { sleep } from "@/lib/format";

/**
 * ফেক সার্ভিসকে RTK Query-র queryFn ফরম্যাটে মোড়ায়।
 * ms = কৃত্রিম দেরি, যাতে লোডিং স্টেট/স্কেলিটন দেখা যায়।
 * আসল API বসালে এই ফাইলটা আর লাগবে না।
 */
export async function run<T>(fn: () => Promise<T>, ms = 400) {
  await sleep(ms);
  try {
    return { data: await fn() };
  } catch (e) {
    return {
      error: {
        message: e instanceof Error ? e.message : "কিছু একটা সমস্যা হয়েছে",
      },
    };
  }
}
