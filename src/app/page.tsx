import { Verifier } from "@/components/verifier";
import { DynamicHeadline } from "@/components/dynamic-headline";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <section className="text-center flex justify-center">
        <DynamicHeadline />
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative">
            <Verifier />
          </div>
        </div>
      </section>
    </div>
  );
}
