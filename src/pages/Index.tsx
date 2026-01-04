import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import InstitutionsSection from "@/components/home/InstitutionsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <InstitutionsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
