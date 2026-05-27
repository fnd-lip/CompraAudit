import { HomeHero } from "../components/home/HomeHero";
import { HomeProblem } from "../components/home/HomeProblem";
import { HomeSteps } from "../components/home/HomeSteps";
import { HomeProofPreview } from "../components/home/HomeProofPreview";
import { HomeCallToAction } from "../components/home/HomeCallToAction";

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* exibe a área principal da página inicial */}
      <HomeHero />

      {/* exibe o problema tratado pela aplicação */}
      <HomeProblem />

      {/* exibe o processo de auditoria verificável */}
      <HomeSteps />

      {/* exibe uma prévia visual da prova off-chain e on-chain */}
      <HomeProofPreview />

      {/* exibe a chamada final para uso da aplicação */}
      <HomeCallToAction />
    </div>
  );
}