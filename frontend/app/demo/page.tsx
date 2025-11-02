import { SkyberSecutity } from "@/components/security/skybersecutity";

export default function DemoPage() {
  return (
    <SkyberSecutity>
      <div className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Project <span className="text-[#17D492] skyber-text">Demos</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of innovative projects and solutions we've built for clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for projects - you can add your projects here */}
            <div className="bg-secondary/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold mb-2">Project Title</h3>
              <p className="text-muted-foreground mb-4">
                Project description goes here...
              </p>
              <a 
                href="#" 
                className="text-[#17D492] hover:underline text-sm font-medium"
              >
                View Demo →
              </a>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold mb-2">Project Title</h3>
              <p className="text-muted-foreground mb-4">
                Project description goes here...
              </p>
              <a 
                href="#" 
                className="text-[#17D492] hover:underline text-sm font-medium"
              >
                View Demo →
              </a>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold mb-2">Project Title</h3>
              <p className="text-muted-foreground mb-4">
                Project description goes here...
              </p>
              <a 
                href="#" 
                className="text-[#17D492] hover:underline text-sm font-medium"
              >
                View Demo →
              </a>
            </div>
          </div>
        </div>
      </div>
    </SkyberSecutity>
  );
}

