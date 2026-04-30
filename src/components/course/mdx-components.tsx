import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Conversation, Message, YoutubeEmbed } from "./conversation";
import { WaterMapExplorer } from "../activities/water-map-explorer";
import { VirtualSchoolAudit } from "../activities/virtual-school-audit";
import { MonsoonSimulator } from "../activities/monsoon-simulator";
import { BucketLab } from "../activities/bucket-lab";
import { MeterDetective } from "../activities/meter-detective";
import { BoundarySandbox } from "../activities/boundary-sandbox";
import { WaterBalanceBuilder } from "../activities/water-balance-builder";
import { SiteWalkthrough } from "../activities/site-walkthrough";
import { TapRepairSimulator } from "../activities/tap-repair-simulator";
import { GroundwaterSandbox } from "../activities/groundwater-sandbox";
import { OpportunityRanking } from "../activities/opportunity-ranking";
import { ImplementationSimulator } from "../activities/implementation-simulator";
import { CommunityGrowth } from "../activities/community-growth";
import { TownHallSim } from "../activities/town-hall-sim";
import { CareerExploration } from "../activities/career-exploration";
import { PhetSimulation } from "../activities/phet-simulation";
import { CourseTimeline, CertificateProcess } from "../activities/course-timeline";
import { ExternalSimulation } from "../activities/external-simulation";
import { Search, TrendingUp, Zap, ShieldCheck } from "lucide-react";



const TopicCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden mb-16 last:mb-0 transition-all duration-700 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-600/10 group-hover:bg-blue-600/30 transition-colors" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

function InlineLink({ href, ...props }: ComponentPropsWithoutRef<"a">) {
  if (!href) {
    return <a {...props} />;
  }

  if (href.startsWith("/")) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} rel="noreferrer" target="_blank" {...props} />;
}




export const mdxComponents = {
  h2: (props: any) => <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-0 mb-8 tracking-tight leading-[1.1]" {...props} />,
  h3: (props: any) => <h3 className="text-3xl md:text-4xl font-extrabold text-blue-800 mt-0 mb-6 tracking-tight leading-tight" {...props} />,
  h4: (props: any) => <h4 className="text-2xl md:text-3xl font-bold text-slate-800 mt-8 mb-4 tracking-tight" {...props} />,
  p: (props: any) => <p className="text-xl md:text-2xl text-slate-700 leading-[1.7] mb-8 font-medium selection:bg-blue-100" {...props} />,
  ul: (props: any) => <ul className="list-none space-y-4 mb-8" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside space-y-4 mb-8 text-xl md:text-2xl text-slate-700 font-medium" {...props} />,
  li: (props: any) => (
    <li className="flex items-start gap-4 text-xl md:text-2xl text-slate-700 font-medium group">
      <span className="mt-2.5 w-2 h-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
      <span>{props.children}</span>
    </li>
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-8 border-blue-600 bg-blue-50/50 p-8 my-10 rounded-r-3xl text-2xl md:text-3xl font-bold text-blue-900 italic leading-relaxed" {...props} />
  ),
  strong: (props: any) => <strong className="font-black text-slate-900" {...props} />,
  em: (props: any) => <em className="italic text-slate-800" {...props} />,
  img: (props: any) => (
    <div className="my-10 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white p-2">
      <img {...props} className="w-full h-auto rounded-2xl object-cover" />
      {props.alt && (
        <div className="mt-4 px-6 pb-4 text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em]">
          {props.alt}
        </div>
      )}
    </div>
  ),
  iframe: (props: any) => (
    <div className="my-10 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl aspect-video bg-slate-900">
      <iframe {...props} className="w-full h-full" />
    </div>
  ),
  a: InlineLink,
  Conversation,
  Message,
  YoutubeEmbed,
  WaterMapExplorer,
  VirtualSchoolAudit,
  MonsoonSimulator,
  BucketLab,
  MeterDetective,
  BoundarySandbox,
  WaterBalanceBuilder,
  SiteWalkthrough,
  TapRepairSimulator,
  GroundwaterSandbox,
  OpportunityRanking,
  ImplementationSimulator,
  CommunityGrowth,
  TownHallSim,
  CareerExploration,
  PhetSimulation,
  CourseTimeline,
  CertificateProcess,
  ExternalSimulation,
  Search,
  TrendingUp,
  Zap,
  ShieldCheck,
  TopicCard,
  section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <TopicCard {...props}>{children}</TopicCard>
  ),
};

