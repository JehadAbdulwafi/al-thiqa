"use server"
import { getPrivacyPolicy } from "@/lib/queries";
import Editor from "@/components/editor";

export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicy()

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="container">
        <div>
          <h2 className="section-title">{data?.title || "سياسة الخصوصية"}</h2>
        </div>
      </div>
      <div className="container min-h-96 my-4">
        <Editor
          content={data?.content || ""}
          editable={false}
        />
      </div>
    </main>
  );
}
