"use client";
import React, { useState, useMemo } from "react";
import { ArrowRight, Droplets, AlertTriangle, CheckCircle2, RotateCcw, Info, Layers, Target, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "inputs", label: "Municipal Supply", icon: Droplets, color: "#3b82f6", unit: "KL/day", type: 'in' },
  { id: "rainwater", label: "Rainwater Harvesting", icon: Target, color: "#0ea5e9", unit: "KL/day", type: 'in' },
  { id: "recycling", label: "Recycled Water", icon: RotateCcw, color: "#10b981", unit: "KL/day", type: 'in' },
  { id: "process", label: "Process Use", icon: Layers, color: "#8b5cf6", unit: "KL/day", type: 'out' },
  { id: "domestic", label: "Domestic Use", icon: CheckCircle2, color: "#ec4899", unit: "KL/day", type: 'out' },
  { id: "discharge", label: "Discharge", icon: Target, color: "#f59e0b", unit: "KL/day", type: 'out' },
];

export function WaterBalanceBuilder() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, number>>({
    inputs: 100, rainwater: 0, recycling: 0, process: 40, domestic: 20, discharge: 30
  });

  const totalIn = values.inputs + values.rainwater + values.recycling;
  const totalOut = values.process + values.domestic + values.discharge;
  const gap = totalIn - totalOut;
  const gapPercent = (Math.abs(gap) / Math.max(1, totalIn)) * 100;
  
  const status = useMemo(() => {
    if (Math.abs(gapPercent) < 2) return 'balanced';
    if (gap > 0) return 'leaking';
    return 'unbalanced';
  }, [gap, gapPercent]);

  const handleValueChange = (id: string, delta: number) => {
    setValues(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mass Balance Calculator</h3>
          <p className="text-slate-500 font-medium mt-2">
            <strong>Instructions:</strong> A water balance means that the total water coming in (Inputs) must equal the total water used or discharged (Outputs). Adjust the values below to balance the equation. If Inputs are greater than Outputs, it indicates a leak or unaccounted usage!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-blue-600 flex items-center gap-2"><ArrowRight /> Total Inputs: {totalIn} KL/day</h4>
            {CATEGORIES.filter(c => c.type === 'in').map(cat => (
              <div key={cat.id} className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <cat.icon size={18} style={{ color: cat.color }} />
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{values[cat.id]}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{cat.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleValueChange(cat.id, -5)} className="flex-1 py-1 bg-white border border-blue-200 rounded text-blue-600 font-bold hover:bg-blue-100 transition-colors">-5</button>
                  <button onClick={() => handleValueChange(cat.id, 5)} className="flex-1 py-1 bg-white border border-blue-200 rounded text-blue-600 font-bold hover:bg-blue-100 transition-colors">+5</button>
                </div>
              </div>
            ))}
          </div>

          {/* Outputs Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-orange-600 flex items-center gap-2">Total Outputs: {totalOut} KL/day <ArrowRight /></h4>
            {CATEGORIES.filter(c => c.type === 'out').map(cat => (
              <div key={cat.id} className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <cat.icon size={18} style={{ color: cat.color }} />
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{values[cat.id]}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{cat.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleValueChange(cat.id, -5)} className="flex-1 py-1 bg-white border border-orange-200 rounded text-orange-600 font-bold hover:bg-orange-100 transition-colors">-5</button>
                  <button onClick={() => handleValueChange(cat.id, 5)} className="flex-1 py-1 bg-white border border-orange-200 rounded text-orange-600 font-bold hover:bg-orange-100 transition-colors">+5</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className={`mt-4 p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
          status === 'balanced' ? 'bg-emerald-50 border-emerald-200' : 
          status === 'leaking' ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-4">
            {status === 'balanced' ? <CheckCircle2 size={32} className="text-emerald-500 shrink-0" /> : 
             status === 'leaking' ? <AlertTriangle size={32} className="text-red-500 shrink-0" /> : 
             <Info size={32} className="text-amber-500 shrink-0" />}
            <div>
              <h4 className={`text-lg font-black ${status === 'balanced' ? 'text-emerald-700' : status === 'leaking' ? 'text-red-700' : 'text-amber-700'}`}>
                {status === 'balanced' ? 'System Balanced!' : status === 'leaking' ? `Gap Detected: ${gap} KL` : 'Balance Required'}
              </h4>
              <p className={`text-sm font-medium ${status === 'balanced' ? 'text-emerald-600' : status === 'leaking' ? 'text-red-600' : 'text-amber-600'}`}>
                {status === 'balanced' ? 'Inputs equal Outputs. The data matches perfectly.' : 
                 status === 'leaking' ? 'Inputs exceed known uses. Find the missing volume!' : 'Outputs exceed inputs. Check your calculations.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => status === 'balanced' ? router.push('/2-3') : null}
            disabled={status !== 'balanced'}
            className={`px-6 py-3 rounded-xl font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              status === 'balanced'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-blue-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {status === 'balanced' ? 'Continue' : 'Balance to Proceed'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
