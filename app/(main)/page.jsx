import HeroSection from "@/components/home/HeroSection";
import TemplateGrid from "@/components/home/TemplateGrid";
import RecentDocumentsTable from "@/components/home/RecentDocumentsTable";
import { currentUser } from "@/lib/mock-data/user";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection userName={currentUser.name} />
      <TemplateGrid />
      <RecentDocumentsTable />
    </div>
  );
}
