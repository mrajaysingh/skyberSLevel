import { SkyberSecutity } from "@/components/security/skybersecutity";

export default function ProtectedPage() {
  return (
    <SkyberSecutity>
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Protected Area</h1>
          <p className="text-lg text-muted-foreground mb-8">
            This is a protected page that requires authentication. 
            You can wrap any content with the &lt;SkyberSecutity&gt; component to protect it.
          </p>
          
          <div className="bg-secondary/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <pre className="bg-background p-4 rounded overflow-x-auto">
              <code>{`import { SkyberSecutity } from "@/components/security/skybersecutity";

export default function YourPage() {
  return (
    <SkyberSecutity>
      {/* Your protected content here */}
    </SkyberSecutity>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </SkyberSecutity>
  );
}

