// This file contains the raw data for seeding the database.

export const seedCollections = [
  {
    slug: "living-room",
    name: "غرف المعيشة",
    description: "أثاث عصري وأنيق لغرف المعيشة",
    image: "/modern-living-room.avif",
  },
  {
    slug: "bedroom",
    name: "غرف النوم",
    description: "راحة وأناقة لغرف النوم",
    image: "/luxury-bedroom-furniture.avif",
  },
  {
    slug: "dining-room",
    name: "غرف الطعام",
    description: "طاولات وكراسي طعام فاخرة",
    image: "/elegant-dining-room-furniture.avif",
  },
  {
    slug: "office",
    name: "المكاتب",
    description: "أثاث مكتبي مريح وعملي",
    image: "/modern-office-furniture.avif",
  },
  {
    slug: "outdoor",
    name: "الأثاث الخارجي",
    description: "أثاث خارجي مقاوم للعوامل الجوية",
    image: "/outdoor-patio-furniture.avif",
  },
  {
    slug: "kids",
    name: "غرف الأطفال",
    description: "أثاث آمن وملون للأطفال",
    image: "/colorful-kids-room-furniture.avif",
  },
]

export const seedProducts = [
  {
    name: "أريكة مودرن بيج",
    price: 4500,
    compareAtPrice: 5200,
    description:
      "أريكة عصرية فاخرة مصنوعة من القماش الفاخر عالي الجودة. تصميم مريح وأنيق يناسب أي ديكور عصري. مثالية لغرف المعيشة الواسعة.",
    features: [
      "قماش عالي الجودة مقاوم للبقع",
      "إطار خشبي صلب متين",
      "وسائد مريحة قابلة للإزالة",
      "أرجل خشبية قوية",
      "ضمان 5 سنوات",
    ],
    specs: {
      الأبعاد: "220 × 90 × 85 سم",
      المادة: "قماش وخشب",
      اللون: "بيج",
      الوزن: "45 كجم",
      "عدد المقاعد": "3 أشخاص",
    },
    images: [
      "/modern-luxury-sofa-beige-fabric.avif",
      "/beige-sofa-side-view.avif",
      "/beige-sofa-detail-view.avif",
      "/beige-sofa-back-view.avif",
    ],
    category: "غرف المعيشة",
    featured: true,
  },
  {
    name: "أريكة عصرية فاخرة",
    price: 12500,
    images: ["/modern-luxury-sofa-beige-fabric.avif"],
    category: "غرف المعيشة",
    featured: true,
  },
  {
    name: "طاولة طعام خشبية",
    price: 8900,
    images: ["/elegant-wooden-dining-table-modern.avif"],
    category: "غرف الطعام",
    featured: true,
  },
  {
    name: "سرير ملكي مودرن",
    price: 15000,
    compareAtPrice: 18000,
    images: ["/modern-luxury-king-bed-upholstered.avif"],
    category: "غرف النوم",
    featured: true,
  },
  {
    name: "كرسي استرخاء جلد",
    price: 5500,
    images: ["/modern-leather-lounge-chair-brown.avif"],
    category: "غرف المعيشة",
  },
  {
    name: "رف كتب معاصر",
    price: 3800,
    images: ["/modern-wooden-bookshelf-minimalist.avif"],
    category: "المكاتب",
  },
  {
    name: "طاولة قهوة رخامية",
    price: 4200,
    compareAtPrice: 5500,
    images: ["/marble-coffee-table.avif"],
    category: "غرف المعيشة",
  },
  {
    name: "مكتب عمل حديث",
    price: 6800,
    images: ["/modern-office-desk.avif"],
    category: "المكاتب",
  },
  {
    name: "كرسي طعام مخملي",
    price: 2100,
    images: ["/velvet-dining-chair.avif"],
    category: "غرف الطعام",
  },
  {
    name: "طاولة جانبية ذهبية",
    price: 1900,
    images: ["/gold-side-table.avif"],
    category: "غرف المعيشة",
  },
]

export const seedBlogPosts = [
  {
    slug: "comprehensive-guide-to-choosing-living-room-furniture",
    title: "دليلك الشامل لاختيار الأثاث المناسب لغرفة المعيشة",
    excerpt:
      "تعرف على أفضل الطرق لاختيار الأثاث المثالي الذي يناسب مساحة غرفة المعيشة وأسلوبك الشخصي...",
    content:
      "هذا دليل شامل لمساعدتك في اختيار أفضل أثاث لغرفة المعيشة. سنغطي كل شيء من قياس مساحتك إلى اختيار النمط والمواد المناسبة.",
    coverImage: "/modern-luxury-living-room-with-elegant-furniture-b.avif",
    publishedAt: new Date("2024-12-15"),
    published: true,
  },
  {
    slug: "latest-trends-in-modern-furniture-2024",
    title: "أحدث صيحات الأثاث العصري لعام 2024",
    excerpt:
      "استكشف أحدث الاتجاهات في عالم الأثاث والتصميم الداخلي التي ستهيمن على المنازل هذا العام...",
    content:
      "عام 2024 يجلب اتجاهات جديدة ومثيرة في تصميم الأثاث. من المواد المستدامة إلى الألوان الجريئة، إليك ما هو رائج.",
    coverImage: "/marble-coffee-table.avif",
    publishedAt: new Date("2024-12-10"),
    published: true,
  },
  {
    slug: "how-to-maintain-your-wooden-furniture",
    title: "كيف تحافظ على أثاثك الخشبي لسنوات طويلة",
    excerpt:
      "نصائح عملية للعناية بالأثاث الخشبي والحفاظ على جماله ومتانته لأطول فترة ممكنة...",
    content:
      "الأثاث الخشبي استثمار. تعلم كيفية العناية به بشكل صحيح باستخدام هذه النصائح البسيطة والفعالة لضمان استمراره لأجيال.",
    coverImage: "/modern-office-desk.avif",
    publishedAt: new Date("2024-12-05"),
    published: true,
  },
]
