import ResourceNotFound from "@/components/shared/ResourceNotFound/ResourceNotFound";

export default function NotFound() {
  return (
    <ResourceNotFound
      message="Page not found."
      ctaHref="/"
      ctaLabel="Go home"
      decorated
      showCTA
    />
  );
}
