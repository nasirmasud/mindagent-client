import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "$0", features: ["10 AI generations/day", "Basic chat", "Groq provider"] },
  { name: "Pro", price: "$12/mo", features: ["Unlimited generations", "Streaming chat", "All providers", "Priority support"] },
  { name: "Team", price: "$29/mo", features: ["Everything in Pro", "Team workspace", "Analytics", "API access"] },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Pricing</h1>
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground">&bull; {f}</li>
                ))}
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
