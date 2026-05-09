"use client";
import React, { useState } from "react";
import { DownloadForm } from "@/components/course/download-form";

export function RainwaterDataForm() {
  const [data, setData] = useState({
    population: "",
    area: "",
    rainfall: "",
    availability: "",
    domestic: ""
  });

  return (
    <div id="rainwater-form" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm my-12">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Rainwater Availability in Your District</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sky-50">
              <th className="p-4 border-b border-sky-100 font-bold text-sky-900">Metric / Examples</th>
              <th className="p-4 border-b border-sky-100 font-bold text-sky-900">About your district/town</th>
              <th className="p-4 border-b border-sky-100 font-bold text-sky-900">What does the data tell us?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-slate-100 text-sm">
                <strong>Population:</strong> (e.g., Pune District: 9,429,408)
              </td>
              <td className="p-4 border-b border-slate-100">
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter population..." value={data.population} onChange={e => setData({...data, population: e.target.value})} />
              </td>
              <td className="p-4 border-b border-slate-100 text-sm text-slate-500">Demographic baseline</td>
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-sm">
                <strong>Area:</strong> (e.g., Pune District: 15,643 sq km)
              </td>
              <td className="p-4 border-b border-slate-100">
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter area..." value={data.area} onChange={e => setData({...data, area: e.target.value})} />
              </td>
              <td className="p-4 border-b border-slate-100 text-sm text-slate-500">Catchment size</td>
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-sm">
                <strong>Rainfall:</strong> (e.g., 446 mm ≈ 0.446m)
              </td>
              <td className="p-4 border-b border-slate-100">
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter rainfall in meters..." value={data.rainfall} onChange={e => setData({...data, rainfall: e.target.value})} />
              </td>
              <td className="p-4 border-b border-slate-100 text-sm text-slate-500">Annual precipitation</td>
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-sm">
                <strong>Total water availability:</strong> Area in m² × Rainfall in m
              </td>
              <td className="p-4 border-b border-slate-100">
                <input type="text" className="w-full p-2 border rounded" placeholder="Calculated total (m³)..." value={data.availability} onChange={e => setData({...data, availability: e.target.value})} />
              </td>
              <td className="p-4 border-b border-slate-100 text-sm text-slate-500">Overall volume available</td>
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-sm">
                <strong>Domestic availability:</strong> (Assuming 10% for domestic)
              </td>
              <td className="p-4 border-b border-slate-100">
                <input type="text" className="w-full p-2 border rounded" placeholder="Per capita L/day..." value={data.domestic} onChange={e => setData({...data, domestic: e.target.value})} />
              </td>
              <td className="p-4 border-b border-slate-100 text-sm text-slate-500">Rainwater available per person</td>
            </tr>
          </tbody>
        </table>
      </div>
      <DownloadForm targetId="rainwater-form" />
    </div>
  );
}
