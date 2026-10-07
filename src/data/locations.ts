// বাংলাদেশের ৮ বিভাগ ও ৬৪ জেলা। key ইংরেজি (ডেটায় সেভ হয়), bn দেখানোর জন্য
export type District = { key: string; bn: string };
export type Division = { key: string; bn: string; districts: District[] };

const d = (key: string, bn: string): District => ({ key, bn });

export const DIVISIONS: Division[] = [
  {
    key: "Dhaka",
    bn: "ঢাকা",
    districts: [
      d("Dhaka", "ঢাকা"),
      d("Faridpur", "ফরিদপুর"),
      d("Gazipur", "গাজীপুর"),
      d("Gopalganj", "গোপালগঞ্জ"),
      d("Kishoreganj", "কিশোরগঞ্জ"),
      d("Madaripur", "মাদারীপুর"),
      d("Manikganj", "মানিকগঞ্জ"),
      d("Munshiganj", "মুন্সিগঞ্জ"),
      d("Narayanganj", "নারায়ণগঞ্জ"),
      d("Narsingdi", "নরসিংদী"),
      d("Rajbari", "রাজবাড়ী"),
      d("Shariatpur", "শরীয়তপুর"),
      d("Tangail", "টাঙ্গাইল"),
    ],
  },
  {
    key: "Chattogram",
    bn: "চট্টগ্রাম",
    districts: [
      d("Bandarban", "বান্দরবান"),
      d("Brahmanbaria", "ব্রাহ্মণবাড়িয়া"),
      d("Chandpur", "চাঁদপুর"),
      d("Chattogram", "চট্টগ্রাম"),
      d("Cumilla", "কুমিল্লা"),
      d("Cox's Bazar", "কক্সবাজার"),
      d("Feni", "ফেনী"),
      d("Khagrachhari", "খাগড়াছড়ি"),
      d("Lakshmipur", "লক্ষ্মীপুর"),
      d("Noakhali", "নোয়াখালী"),
      d("Rangamati", "রাঙ্গামাটি"),
    ],
  },
  {
    key: "Rajshahi",
    bn: "রাজশাহী",
    districts: [
      d("Bogura", "বগুড়া"),
      d("Joypurhat", "জয়পুরহাট"),
      d("Naogaon", "নওগাঁ"),
      d("Natore", "নাটোর"),
      d("Chapainawabganj", "চাঁপাইনবাবগঞ্জ"),
      d("Pabna", "পাবনা"),
      d("Rajshahi", "রাজশাহী"),
      d("Sirajganj", "সিরাজগঞ্জ"),
    ],
  },
  {
    key: "Khulna",
    bn: "খুলনা",
    districts: [
      d("Bagerhat", "বাগেরহাট"),
      d("Chuadanga", "চুয়াডাঙ্গা"),
      d("Jashore", "যশোর"),
      d("Jhenaidah", "ঝিনাইদহ"),
      d("Khulna", "খুলনা"),
      d("Kushtia", "কুষ্টিয়া"),
      d("Magura", "মাগুরা"),
      d("Meherpur", "মেহেরপুর"),
      d("Narail", "নড়াইল"),
      d("Satkhira", "সাতক্ষীরা"),
    ],
  },
  {
    key: "Barishal",
    bn: "বরিশাল",
    districts: [
      d("Barguna", "বরগুনা"),
      d("Barishal", "বরিশাল"),
      d("Bhola", "ভোলা"),
      d("Jhalokati", "ঝালকাঠি"),
      d("Patuakhali", "পটুয়াখালী"),
      d("Pirojpur", "পিরোজপুর"),
    ],
  },
  {
    key: "Sylhet",
    bn: "সিলেট",
    districts: [
      d("Habiganj", "হবিগঞ্জ"),
      d("Moulvibazar", "মৌলভীবাজার"),
      d("Sunamganj", "সুনামগঞ্জ"),
      d("Sylhet", "সিলেট"),
    ],
  },
  {
    key: "Rangpur",
    bn: "রংপুর",
    districts: [
      d("Dinajpur", "দিনাজপুর"),
      d("Gaibandha", "গাইবান্ধা"),
      d("Kurigram", "কুড়িগ্রাম"),
      d("Lalmonirhat", "লালমনিরহাট"),
      d("Nilphamari", "নীলফামারী"),
      d("Panchagarh", "পঞ্চগড়"),
      d("Rangpur", "রংপুর"),
      d("Thakurgaon", "ঠাকুরগাঁও"),
    ],
  },
  {
    key: "Mymensingh",
    bn: "ময়মনসিংহ",
    districts: [
      d("Jamalpur", "জামালপুর"),
      d("Mymensingh", "ময়মনসিংহ"),
      d("Netrokona", "নেত্রকোণা"),
      d("Sherpur", "শেরপুর"),
    ],
  },
];

export const placeLabel = (
  item: { key: string; bn: string },
  locale: "bn" | "en",
) => (locale === "bn" ? item.bn : item.key);
