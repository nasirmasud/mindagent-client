import Link from "next/link";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata = {
  title: "Terms of Service — MindAgent",
  description:
    "The terms that govern your use of MindAgent: your account, acceptable use, your content, and our liability.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      intro="By creating a MindAgent account you agree to these terms. They are written to match what the product actually does today — there is no hidden arbitration clause or unilateral-change clause below."
      sections={[
        {
          heading: "Your account",
          body: (
            <>
              <p>
                You need an account to use the agents. You are responsible for
                keeping your password to yourself and for everything that happens
                under your account. Passwords must be at least 12 characters and
                include an uppercase letter, a lowercase letter, a number, and a
                symbol.
              </p>
              <p>
                One person or organisation per account. You must be old enough to
                enter a binding contract where you live, and at least 13 years old.
              </p>
            </>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <>
              <p>You agree not to use MindAgent to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Upload content you do not have the right to process, or anything
                  unlawful, infringing, or defamatory.
                </li>
                <li>
                  Attempt to break the authentication, rate limits, or availability
                  of the service, or to access another user&apos;s data.
                </li>
                <li>
                  Resell, scrape, or reverse-engineer the service without our
                  written permission.
                </li>
                <li>
                  Use the agents to make consequential decisions about people —
                  hiring, credit, healthcare, or anything else where an error
                  causes real harm.
                </li>
              </ul>
              <p>
                We may suspend accounts that do. Because accounts are cheap to
                create and our compute is not free, deliberate abuse of the free
                plan will get an account closed.
              </p>
            </>
          ),
        },
        {
          heading: "Your content and our outputs",
          body: (
            <>
              <p>
                You keep ownership of everything you upload and everything the
                agents produce from it. We claim no ownership over your reports,
                chats, or generated content.
              </p>
              <p>
                You grant us only the narrow licence needed to operate the service:
                to store your content, process it through our AI provider to answer
                your request, and display it back to you.
              </p>
              <p>
                <strong className="text-foreground">AI output is not guaranteed to
                be correct.</strong> Models hallucinate. Check anything the agents
                tell you before you rely on it, and note that generated content may
                not be unique to you. We are not responsible for decisions you make
                on the basis of an agent&apos;s output.
              </p>
            </>
          ),
        },
        {
          heading: "Plans, billing, and cancellation",
          body: (
            <>
              <p>
                Free, Pro, and Business plans are described on the{" "}
                <Link
                  href="/pricing"
                  className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                >
                  pricing page
                </Link>
                . The Free plan needs no card. Paid plans bill in advance and
                renew until cancelled. You can cancel at any time from your account;
                access continues until the end of the period you have paid for.
                We do not auto-renew into a trial.
              </p>
              <p>Refunds are covered by our{" "}
                <Link
                  href="/refund"
                  className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                >
                  Refund Policy
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          heading: "Availability",
          body: (
            <p>
              We aim to keep MindAgent available around the clock but do not
              guarantee uninterrupted service. Third-party model providers
              (currently OpenRouter) can degrade or fail independently of us, and
              agent output quality tracks their model availability.
            </p>
          ),
        },
        {
          heading: "Liability",
          body: (
            <p>
              To the maximum extent permitted by law, MindAgent and its operators
              are not liable for indirect, incidental, or consequential damages,
              including lost profits or lost data, arising from your use of the
              service. Our total liability is limited to the amount you paid us in
              the 12 months before the claim. Nothing here limits liability that
              cannot be limited by law, including for fraud.
            </p>
          ),
        },
        {
          heading: "Changes and termination",
          body: (
            <p>
              We may update these terms; the date at the top of this page tells you
              when. If you do not accept the changes, delete your account or stop
              using the service. You can close your account at any time, and we may
              suspend or terminate accounts that breach these terms.
            </p>
          ),
        },
      ]}
    />
  );
}