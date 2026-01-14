import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <Button variant="default">Default</Button>
      <Button variant="default" disabled>
        Default disabled
      </Button>

      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary" disabled>
        Secondary disabled
      </Button>

      <Button variant="outline">Outline</Button>
      <Button variant="outline" disabled>
        Outline disabled
      </Button>

      <Button variant="circle">★</Button>
      <Button variant="circle" disabled>
        ★
      </Button>
    </main>
  );
};

export default HomePage;
