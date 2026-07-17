import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="w-full px-4 py-10 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Email: support@mindagent.ai</p>
          <p>Twitter: @mindagent</p>
          <p>GitHub: github.com/nasirmasud/mindagent</p>
        </CardContent>
      </Card>
    </div>
  );
}
