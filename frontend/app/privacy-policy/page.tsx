import ContentPageView from "@/components/content/ContentPageView";

export default function PrivacyPolicyPage() {
  return (
    <ContentPageView
      pageKey="privacy-policy"
      fallbackTitleKey="legal.privacyPolicy"
      fallbackBodyKey="legal.privacyBody"
    />
  );
}
