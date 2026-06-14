import { getTestimonials } from "@/features/website/actions";
import { TestimonialsClientPage } from "./client";

export default async function WebsiteTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsClientPage testimonials={testimonials} />;
}
