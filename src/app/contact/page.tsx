import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-2xl text-center bg-card/70 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl font-headline text-primary">
                        <Mail className="h-8 w-8" />
                        // SECURE_CHANNEL //
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground">
                        For inquiries, please reach out to our team members via their LinkedIn profiles on the 'About' page.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
