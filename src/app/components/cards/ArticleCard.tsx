import Link from 'next/link';

interface ArticleCardProps {
  category: string;
  readTime: string;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
  href?: string; // Optional link destination
}

export default function ArticleCard({
  category,
  readTime,
  title,
  description,
  author,
  date,
  imageUrl,
  href = '#', // Default fallback
}: ArticleCardProps) {
  const cardContent = (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
      <div className="h-40 bg-border overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-5 flex flex-col grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
            {category}
          </span>
          <span className="text-xs text-muted">{readTime}</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted line-clamp-2 mb-4">{description}</p>
        
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
          <span>By {author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );

  // Wrap in Next.js Link if an href is provided
  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}