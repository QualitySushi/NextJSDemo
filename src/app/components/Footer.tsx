export default function Footer(){
    return (
      <footer className="bg-card text-muted border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-foreground">(Insert Footer Text Here)</h2>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    )
}