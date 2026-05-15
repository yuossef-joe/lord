import ContentPageView from "@/components/content/ContentPageView";

export default function TermsAndConditionsPage() {
  return (
    <ContentPageView
      pageKey="terms"
      fallbackTitleKey="legal.termsConditions"
      fallbackBodyKey="legal.termsBody"
    />
  );
}
