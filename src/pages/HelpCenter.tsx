import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    question: "How do I create a hustle listing?",
    answer: "Sign up as a hustler, then navigate to your Dashboard. Click 'Create Hustle' and fill in your business details including name, description, category, and images."
  },
  {
    question: "How do I contact a hustler?",
    answer: "Visit the hustle's detail page and use the 'Send Message' button to start a conversation directly with the business owner."
  },
  {
    question: "Is Side Quest free to use?",
    answer: "Yes! Browsing and discovering local businesses is completely free. Hustlers can list their businesses at no cost."
  },
  {
    question: "How do reviews work?",
    answer: "After visiting a hustle, you can leave a review with a star rating and written feedback. Reviews help other users find great local businesses."
  },
  {
    question: "How do I update my hustle information?",
    answer: "Go to your Dashboard, find your hustle in 'Manage Hustles', and click the edit button to update any details."
  },
  {
    question: "Can I have multiple hustles?",
    answer: "Yes! You can create and manage multiple hustle listings from your dashboard."
  }
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Help Center
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about Side Quest
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="p-5 bg-muted/30 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No results found. Try a different search term.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
