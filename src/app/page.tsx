import CommerceTimeline from "@/components/commerce-timeline/commerce-timeline";
import Hero from "@/components/hero/hero";
import SectionScroll from "@/components/section-scroll/section-scroll";
import TimelineEnd from "@/components/timeline-end/timeline-end";

export default function Home() {
  return (
    <main>
      <Hero />
      <CommerceTimeline />
      <TimelineEnd />
    </main>
  );
}
