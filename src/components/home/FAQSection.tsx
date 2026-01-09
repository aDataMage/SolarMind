import { JsonLd } from "@/components/seo/JsonLd";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How do I calculate the solar system size I need?",
        answer: "The size depends on your energy consumption. You can check your electricity bill for monthly kWh usage or use our AI-powered load calculator to estimate based on your appliances."
    },
    {
        question: "What is the warranty on your solar panels?",
        answer: "Our solar panels come with a 25-year performance warranty, ensuring they produce at least 80% of their rated power after 25 years. We also offer a 10-year product warranty."
    },
    {
        question: "Do you offer installation services?",
        answer: "We focus on providing premium hardware directly to consumers. However, we have a network of certified installation partners we can recommend based on your location."
    },
    {
        question: "How much can I save with solar?",
        answer: "Savings vary by usage and location, but most homeowners save 50-90% on their electricity bills. The typical payback period for our systems is 3-5 years."
    }
];

export function FAQSection() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-24 bg-muted/30">
            <JsonLd data={jsonLd} />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Everything you need to know about switching to solar.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-lg">
                                    {faq.question}
                                    <span className="ml-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180">
                                        <div className="relative">
                                            <Plus className="h-5 w-5 group-open:invisible absolute inset-0" />
                                            <Minus className="h-5 w-5 invisible group-open:visible" />
                                        </div>
                                    </span>
                                </summary>
                                <div className="mt-4 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                    {faq.answer}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
