"use client";

import React from "react";
import { 
  BookOpen, 
  Target, 
  Award, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Zap, 
  ShieldCheck,
  Search,
  Droplets,
  ClipboardList,
  TrendingUp,
  Award as AwardIcon
} from "lucide-react";

const courseStructure = [
  {
    module: "Foundations of Water Auditing",
    chapters: [
      "Course Overview",
      "Understanding the Crisis",
      "Defining a Water Audit",
      "Setting Scope & Boundaries",
      "Experiential Activity: Water Hero",
      "The Power of Data"
    ],
    icon: <BookOpen className="w-5 h-5" />,
    color: "blue"
  },
  {
    module: "Measurement and Loss Detection",
    chapters: [
      "Scale of Volume",
      "Building a Water Balance",
      "Meter Data & Interpretation",
      "Site Walkthrough & Loss Points",
      "Experiential Activity: Aqua Insight"
    ],
    icon: <Target className="w-5 h-5" />,
    color: "indigo"
  },
  {
    module: "Reporting and Action Planning",
    chapters: [
      "Prioritizing Opportunities",
      "Building the Action Plan",
      "Identifying & Repairs",
      "Conservation & Reuse",
      "Experiential Activity: Water Legacy"
    ],
    icon: <Zap className="w-5 h-5" />,
    color: "amber"
  },
  {
    module: "Future Planning & Forecasting",
    chapters: [
      "Predicting Future Needs",
      "Advocacy for Change",
      "Career Exploration"
    ],
    icon: <Award className="w-5 h-5" />,
    color: "emerald"
  }
];

export function CourseTimeline() {
  return (
    <div className="relative py-12 px-6 bg-slate-50 rounded-[3rem] border-2 border-white shadow-inner overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h3 className="text-3xl font-black text-slate-900 mb-12 text-center uppercase tracking-tighter">
          Learning Journey Timeline
        </h3>

        <div className="space-y-12">
          {courseStructure.map((mod, idx) => (
            <div key={idx} className="relative pl-12 border-l-4 border-slate-200 ml-4 pb-4">
              {/* Module Indicator */}
              <div className={`absolute -left-[1.75rem] top-0 w-12 h-12 rounded-2xl bg-${mod.color}-600 flex items-center justify-center shadow-xl shadow-${mod.color}-200 border-4 border-white`}>
                <span className="text-white">{mod.icon}</span>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h4 className={`text-xl font-black text-${mod.color}-600 uppercase tracking-tighter`}>
                    Module {idx + 1}: {mod.module}
                  </h4>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.chapters.map((chap, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        {cIdx + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{chap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Graduation Indicator */}
          <div className="relative pl-12 ml-4">
            <div className="absolute -left-[1.75rem] top-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl shadow-green-200 border-4 border-white animate-bounce">
              <AwardIcon className="w-6 h-6 text-white" />
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl text-white">
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Certification Phase</h4>
              <p className="text-green-50 opacity-90 text-sm leading-relaxed">
                Complete all chapters, interactive 3D simulations, and end-of-module quizzes. Your final audit report will be reviewed by experts before your professional certification is issued.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateProcess() {
  const steps = [
    { title: "Learning", desc: "Complete 15 Chapters & 3D Activities", icon: <BookOpen className="w-5 h-5" /> },
    { title: "Verification", desc: "Pass 4 Module Quizzes (80%+ score)", icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: "Submission", desc: "Upload your Practical Audit Report", icon: <ClipboardList className="w-5 h-5" /> },
    { title: "Review", desc: "Expert Evaluation of your findings", icon: <Search className="w-5 h-5" /> },
    { title: "Certified", desc: "Download Professional Certificate", icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 my-12">
      {steps.map((step, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg text-center flex flex-col items-center group hover:bg-blue-600 transition-all duration-500">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-white/20 group-hover:text-white transition-all">
            {step.icon}
          </div>
          <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1 group-hover:text-white">{step.title}</h5>
          <p className="text-[10px] text-slate-500 leading-tight group-hover:text-blue-100">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}
