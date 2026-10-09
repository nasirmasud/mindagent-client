import { LegalPage } from "@/components/shared/legal-page";

export const metadata = {
  title: "Privacy Policy — MindAgent",
  description:
    "What MindAgent collects, why we collect it, how long we keep it, and the rights you have over your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      intro="This policy describes what MindAgent does with your data in practice — not what a template says we might do. It covers the deployed application at mindagent-client.vercel.app and its API."
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>
                <strong className="text-foreground">Account data.</strong> When
                you register you give us a name, an email address, and a password.
                Passwords are hashed with bcrypt and are never stored or logged in
                plain text. If you sign in with Google we store your Google user
                ID, name, email, and avatar URL instead of a password.
              </p>
              <p>
                <strong className="text-foreground">Session data.</strong> After
                login your browser stores a JSON Web Token and a small copy of
                your public profile in <code>localStorage</code>. They are cleared
                on logout. Storing them this way makes them readable by any
                script running on our pages, which is why we avoid third-party ad
                and analytics scripts entirely.
              </p>
              <p>
                <strong className="text-foreground">Content you create.</strong> We
                store the things you produce so the product works: analysis
                reports, chat messages, generated content, and image analyses.
                Analysis reports include a preview of up to ten rows from the file
                you uploaded, along with its column names, row count, and file
                name.
              </p>
              <p>
                <strong className="text-foreground">Newsletter signups.</strong> If
                you subscribe on the homepage we store your email address and the
                date you subscribed. Nothing else.
              </p>
              <p>
                <strong className="text-foreground">What we do not collect.</strong> No
                advertising or cross-site tracking cookies. No third-party analytics.
                No contact-form submissions are stored — those are logged to the
                server console only.
              </p>
            </>
          ),
        },
        {
          heading: "Where your data lives and who can see it",
          body: (
            <>
              <p>
                Your data is stored in a MongoDB Atlas database and served by an
                Express API. Infrastructure is hosted on Vercel (frontend) and
                Render (backend).
              </p>
              <p>
                <strong className="text-foreground">AI providers see your
                content.</strong> When you run an agent, the prompt, chat history,
                file summary, or image is sent to our AI provider, currently
                OpenRouter, which routes it to the underlying model. Their
                processing of that data is governed by their own terms. If your
                content is sensitive, do not upload it.
              </p>
              <p>
                <strong className="text-foreground">Uploaded files.</strong> Data
                files are parsed in memory on the server and are never written to
                disk. Images you analyse are stored as base64 in the database so
                your history works across devices.
              </p>
            </>
          ),
        },
        {
          heading: "How long we keep things",
          body: (
            <p>
              Your account and everything attached to it — reports, chats,
              generated content, image analyses — are kept for as long as your
              account exists. Newsletter addresses are kept until you ask us to
              remove them. We do not keep deleted-file copies, because we never
              had any.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <>
              <p>
                You can edit your display name and avatar at any time from{" "}
                <strong className="text-foreground">Settings</strong>, and change
                your password from the same page. To export or delete anything else,
                email us and we will action it within 30 days.
              </p>
              <p>
                If you are in the EU, you have the rights to access, correct,
                export, and erase your personal data, and to object to processing.
                Contact us and we will action it. Our legal basis for processing is
                performance of our contract with you, plus legitimate interest in
                securing the service. Newsletter signups rely on your consent,
                which you can withdraw at any time.
              </p>
            </>
          ),
        },
        {
          heading: "Security",
          body: (
            <p>
              Passwords are bcrypt-hashed, all traffic is served over HTTPS, the
              API serves HSTS and other security headers, and login, AI, and
              newsletter endpoints are rate-limited per IP address. Note that
              because we have not yet shipped a self-service account deletion
              flow, account deletion is currently handled by email. No system is
              perfect: if you discover a vulnerability, please report it to us
              rather than disclosing it publicly.
            </p>
          ),
        },
        {
          heading: "Changes to this policy",
          body: (
            <p>
              If this policy changes materially we will update the date at the top
              of this page. Continuing to use MindAgent after a change means the
              updated policy applies.
            </p>
          ),
        },
      ]}
    />
  );
}