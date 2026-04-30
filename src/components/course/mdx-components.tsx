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
};

