interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div className="whitespace-pre-wrap">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
