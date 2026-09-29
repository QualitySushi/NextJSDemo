import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EngineeringArticlePage() {
  return (
    <div className="page-container">
      <Header />

      <main className="grow max-w-4xl w-full mx-auto px-6 py-10 space-y-6">
        <span className="article-badge">
          Engineering • 4 min read
        </span>
        <h1 className="article-title sm:text-4xl">
          Building Scalable UI Components
        </h1>
        <p className="article-meta">By Alex Turner • Oct 24</p>

        <div className="article-image-box sm:h-96">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" 
            alt="Engineering" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="article-content">
          <p>
            Explore how modern styling frameworks streamline development. When building out a component reference library or showcase site, establishing clear modular boundaries prevents cascading style pollution.
          </p>
          <p>
            By isolating cards and controls into dedicated subfolders and leveraging strict TypeScript interfaces, you can scale your UI architecture cleanly across multiple layouts without friction.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}