import Link from 'next/link';

function BlogCard({
  title = 'Technical Debt Will Bite Us in the Ass: How to Make Non-Technical Stakeholders Actually Care',
}: {
  title?: string;
}) {
  return (
    <Link href="#" className="group block space-y-1">
      <h3 className="text-link line-clamp-2">
        <span className="from-link to-link bg-gradient-to-r bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
          {title}
        </span>
      </h3>
      <p className="text-muted-foreground text-xs">
        November 19, 2025 &middot; 100 views
      </p>
    </Link>
  );
}

export default BlogCard;
