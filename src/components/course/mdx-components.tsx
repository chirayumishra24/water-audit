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
import { FootprintDetective } from "../activities/footprint-detective";
import { PresentationSimulator } from "../activities/presentation-simulator";
import { TechChallengePicker } from "../activities/tech-challenge-picker";
import { Search, TrendingUp, Zap, ShieldCheck } from "lucide-react";



const TopicCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-white shadow-[0_18px_42px_rgba(0,0,0,0.05)] relative overflow-hidden mb-12 last:mb-0 transition-all duration-700 hover:shadow-[0_24px_52px_rgba(0,0,0,0.08)]">
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

const PracticalActivity = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className="bg-emerald-50/50 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border-2 border-emerald-100/50 my-16 shadow-xl shadow-emerald-900/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-emerald-900 m-0 uppercase tracking-tight">
          {title || "Practical Activity"}
        </h3>
      </div>
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm shrink-0 border border-emerald-200 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                {index + 1}
              </div>
              <p className="text-lg md:text-xl font-bold text-slate-800 m-0 leading-tight pt-1">
                {item}
              </p>
            </div>
            <div className="ml-12 h-20 bg-white/60 border-2 border-emerald-100 rounded-2xl group-hover:border-emerald-300 transition-colors duration-300 shadow-inner" />
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Submit your findings in the LMS portal</span>
      </div>
    </div>
  );
};

export const mdxComponents = {
  h2: (props: any) => <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-0 mb-6 tracking-tight leading-[1.12]" {...props} />,
  h3: (props: any) => <h3 className="text-2xl md:text-3xl font-extrabold text-blue-800 mt-0 mb-5 tracking-tight leading-tight" {...props} />,
  h4: (props: any) => <h4 className="text-xl md:text-2xl font-bold text-slate-800 mt-7 mb-3 tracking-tight" {...props} />,
  p: (props: any) => <p className="text-base md:text-lg text-slate-700 leading-[1.75] mb-6 font-medium selection:bg-blue-100" {...props} />,
  ul: (props: any) => <ul className="list-none space-y-4 mb-8" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside space-y-3 mb-6 text-base md:text-lg text-slate-700 font-medium" {...props} />,
  li: (props: any) => (
    <li className="flex items-start gap-3 text-base md:text-lg text-slate-700 font-medium group">
      <span className="mt-2 w-2 h-2 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
      <span>{props.children}</span>
    </li>
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-8 border-blue-600 bg-blue-50/50 p-6 my-8 rounded-r-3xl text-lg md:text-xl font-bold text-blue-900 italic leading-relaxed" {...props} />
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
  FootprintDetective,
  PresentationSimulator,
  TechChallengePicker,
  Search,
  TrendingUp,
  Zap,
  ShieldCheck,
  TopicCard,
  PracticalActivity,
  section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <TopicCard {...props}>{children}</TopicCard>
  ),
};
