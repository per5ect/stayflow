import { Box } from "@mui/material";
import { Navbar } from "../../../components/organisms/Navbar/Navbar";
import { useHomeController } from "./useHomeController";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { FeaturedApartmentsSection } from "./components/FeaturedApartmentsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CTASection } from "./components/CTASection";
import { HomeFooter } from "./components/HomeFooter";

export default function Home() {
  const { city, setCity, handleSearch, featured, isLoading } = useHomeController();

  return (
    <Box>
      <Navbar />
      <HeroSection city={city} setCity={setCity} handleSearch={handleSearch} />
      <HowItWorksSection />
      <FeaturedApartmentsSection featured={featured} isLoading={isLoading} />
      <FeaturesSection />
      <CTASection />
      <HomeFooter />
    </Box>
  );
}
