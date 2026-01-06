export default async function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">اتصل بنا</h1>
          <p className="text-gray-600 text-lg">
            نحن هنا لمساعدتك. تواصل معنا عبر أي من القنوات التالية
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">أرسل رسالة</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 outline-none"
                  placeholder="أدخل اسمك"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 outline-none"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 outline-none"
                  placeholder="أدخل رقم هاتفك"
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355] focus:ring-offset-2 outline-none resize-none"
                  placeholder="اكتب رسالتك هنا..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B7355] hover:bg-[#6F5B44] text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                إرسال الرسالة
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الاتصال</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8B7355] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">العنوان</h3>
                  <p className="text-gray-600">
                    طرابلس، ليبيا
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8B7355] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">الهاتف</h3>
                  <p className="text-gray-600" dir="ltr">
                    +218 123 4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#8B7355] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">البريد الإلكتروني</h3>
                  <p className="text-gray-600">
                    info@al-thiqa.com
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ساعات العمل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-[#8B7355] mb-2">السبت - الخميس</p>
              <p className="text-gray-600 text-lg">9:00 ص - 9:00 م</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#8B7355] mb-2">الجمعة</p>
              <p className="text-gray-600 text-lg">9:00 ص - 5:00 م</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
