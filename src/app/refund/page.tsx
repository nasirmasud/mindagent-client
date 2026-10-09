import Link from "next/link";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata = {
  title: "Refund Policy — MindAgent",
  description:
    "When MindAgent issues a refund, how to request one, and what happens to your data afterwards.",
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="October 2026"
      intro="A refund policy for a service that does not yet take payments. We are telling you that plainly rather than writing rules about charges we never process."
      sections={[
        {
          heading: "Current status: no payments are processed",
          body: (
            <>
              <p>
                MindAgent currently has no payment processing integrated. The Pro
                and Business plans shown on the{" "}
                <Link
                  href="/pricing"
                  className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                >
                  pricing page
                </Link>{" "}
                are published for transparency about what we intend to charge. No
                card can be entered, no card is charged, and no billing data is
                collected anywhere in the product.
              </p>
              <p>
                This means there is nothing to refund yet — and, more usefully for
                you, there is also nothing you can be charged for.
              </p>
            </>
          ),
        },
        {
          heading: "What this policy will say once billing ships",
          body: (
            <>
              <p>
                When we turn on payments, this page will be replaced with the
                actual terms before the first paid plan goes on sale. Our intent is
                a 30-day money-back window on first payment, refunds issued to the
                original payment method, and no charge for partial months you did
                not use. We will not change these commitments retroactively for
                anyone who has already paid.
              </p>
              <p>
                We are publishing the intent now so that if you relied on a refund
                promise, you can hold us to it.
              </p>
            </>
          ),
        },
        {
          heading: "If something is wrong with the service",
          body: (
            <p>
              Independent of billing: if MindAgent is not working for you, tell us.
              Email us or use the contact form and we will either fix the problem
              or close your account at your request. For the free plan, closing your
              account is the only thing we ask of you.
            </p>
          ),
        },
        {
          heading: "What happens to your data",
          body: (
            <p>
              If your account is closed, everything attached to it — reports, chat
              history, generated content, image analyses — is deleted. See the{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary underline underline-offset-4 hover:no-underline"
              >
                Privacy Policy
              </Link>{" "}
              for what we hold and for how long.
            </p>
          ),
        },
      ]}
    />
  );
}