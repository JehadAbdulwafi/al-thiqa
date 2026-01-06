import Image from "next/image"

export default async function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">عن الثقة للأثاث</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نحن شركة رائدة في مجال الأثاث، نوفر منتجات عالية الجودة تلمتقي توقعاتكم
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">قصتنا</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            تأسست شركة الثقة للأثاث عام 2010 بهدف توفير أثاث عالي الجودة وأنيق للمنازل والمكاتب. على مدار أكثر من عقد من الزمن، نمونا ليصبح أحد الماركات الرائدة في ليبيا في مجال الأثاث.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            نسعى دائماً إلى اختيار أفضل المواد والتصاميم التي تجمع بين الجمال والعملية والراحة، لضمان رضا عملائنا.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#8B7355] rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">الجودة</h3>
                  <p className="text-gray-600">نستخدم أفضل المواد والتصاميم</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#8B7355] rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">الأناقة</h3>
                  <p className="text-gray-600">تصاميم عصرية وعصرية</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#8B7355] rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">المتانة</h3>
                  <p className="text-gray-600">منتجات تدوم طويلاً</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#8B7355] rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">الرضا</h3>
                  <p className="text-gray-600">خدمة عملاء ممتازة</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">جودة عالية</h3>
              <p className="text-gray-600 text-sm">منتجات مصنوعة من أفضل المواد</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">أسعار مناسبة</h3>
              <p className="text-gray-600 text-sm">أسعار تنافسية وعادلة</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-2">توصيل سريع</h3>
              <p className="text-gray-600 text-sm">توصيل لجميع أنحاء ليبيا</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">إحصائياتنا</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-[#8B7355] mb-2">+14</div>
              <p className="text-gray-600">سنة من الخربة</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-[#8B7355] mb-2">+5000</div>
              <p className="text-gray-600">عميل سعيد</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-[#8B7355] mb-2">+1000</div>
              <p className="text-gray-600">منتج متنوع</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-[#8B7355] mb-2">+98%</div>
              <p className="text-gray-600">رضا العملاء</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
