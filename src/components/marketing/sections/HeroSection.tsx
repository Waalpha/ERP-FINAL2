import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DEFAULT_PUBLIC_WEBSITE_CONTENT } from '../../../types';
import { ArrowRight, Play, Shield, CheckCircle2, Server, Users, DollarSign, Activity, Sparkles, Building2, GraduationCap, Stethoscope, ShoppingCart } from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onExploreSolutions: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemo, onExploreSolutions }) => {
  const { platformSettings } = useAuth();
  const content = platformSettings?.publicWebsiteContent || DEFAULT_PUBLIC_WEBSITE_CONTENT;
  const [activeTab, setActiveTab] = useState<'education' | 'healthcare' | 'retail' | 'college'>('education');

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden bg-white">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-medium shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>{content.heroBadgeText}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            {content.heroHeadline.includes('One Powerful Platform.') ? (
              <>
                One Powerful Platform.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Unlimited Possibilities.
                </span>
              </>
            ) : content.heroHeadline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            {content.heroSubheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            >
              {content.heroPrimaryCtaText} <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExploreSolutions}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-xl font-semibold text-base border border-slate-200 transition-all"
            >
              {content.heroSecondaryCtaText}
            </button>
          </div>

          {/* Trust badges row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> ISO 27001 Certified Security</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 99.99% Cloud Uptime SLA</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Complete Tenant Data Isolation</span>
          </div>
        </div>

        {/* Enterprise ERP Interactive Dashboard Mockup Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto" />
          
          <div className="bg-slate-900/95 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Top Toolbar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="ml-3 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>workspace.davetech.co.ke / enterprise-core</span>
                </div>
              </div>

              {/* Workspace Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('education')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'education' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" /> School ERP
                </button>
                <button
                  onClick={() => setActiveTab('college')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'college' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> College & Univ
                </button>
                <button
                  onClick={() => setActiveTab('healthcare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'healthcare' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Hospital EMR
                </button>
                <button
                  onClick={() => setActiveTab('retail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'retail' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Retail POS
                </button>
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-6 sm:p-8 bg-slate-900/60">
              {activeTab === 'education' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                        <span>Enrolled Students</span>
                        <Users className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mt-2">1,482</div>
                      <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1">↑ +12% this term</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                        <span>Fee Collection Rate</span>
                        <DollarSign className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mt-2">KES 14.8M</div>
                      <div className="text-emerald-400 text-xs mt-1 flex items-center gap-1">94.2% collected</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                        <span>Attendance Today</span>
                        <Activity className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mt-2">98.6%</div>
                      <div className="text-slate-400 text-xs mt-1">1,462 present / 20 absent</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                        <span>Active SMS Broadcasts</span>
                        <Server className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mt-2">4,280</div>
                      <div className="text-emerald-400 text-xs mt-1">Delivered via Africa's Talking</div>
                    </div>
                  </div>

                  {/* Simulated table */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white">Recent Student Admissions & Fee Receipts</h3>
                      <span className="text-xs text-indigo-400 font-mono">Live Firestore Synced</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'Amina Kiprop', admission: 'ADM-2026-089', grade: 'Grade 8 Stream A', status: 'Fully Paid', amount: 'KES 45,000' },
                        { name: 'Brian Ochieng', admission: 'ADM-2026-090', grade: 'Form 2 West', status: 'Pending Balance', amount: 'KES 18,500' },
                        { name: 'Chantal Wanjiku', admission: 'ADM-2026-091', grade: 'Grade 5 East', status: 'Fully Paid', amount: 'KES 42,000' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                              {item.name[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{item.name}</div>
                              <div className="text-slate-400 font-mono">{item.admission} • {item.grade}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">{item.amount}</div>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                              item.status === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'college' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Active Courses</div>
                      <div className="text-2xl font-bold text-white mt-2">64 Programs</div>
                      <div className="text-teal-400 text-xs mt-1">TVET & Degree Level</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Semester Registrations</div>
                      <div className="text-2xl font-bold text-white mt-2">3,240 Students</div>
                      <div className="text-emerald-400 text-xs mt-1">99.1% clearance</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">LMS Assignments</div>
                      <div className="text-2xl font-bold text-white mt-2">1,850 Active</div>
                      <div className="text-indigo-400 text-xs mt-1">Real-time submissions</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Library Volumes</div>
                      <div className="text-2xl font-bold text-white mt-2">24,500 Books</div>
                      <div className="text-purple-400 text-xs mt-1">RFID Tracked</div>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Higher Education Faculty & Department Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['School of Computing & IT', 'Faculty of Business & Economics', 'School of Nursing & Health Sciences'].map((dept, i) => (
                        <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                          <div className="text-white font-medium text-xs">{dept}</div>
                          <div className="text-slate-400 text-[11px] mt-1">Status: Fully Operational (12 Lecturers)</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'healthcare' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Outpatient Triage</div>
                      <div className="text-2xl font-bold text-white mt-2">142 Today</div>
                      <div className="text-teal-400 text-xs mt-1">Average wait: 12 mins</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Pharmacy Stock</div>
                      <div className="text-2xl font-bold text-white mt-2">98.4% Available</div>
                      <div className="text-emerald-400 text-xs mt-1">Zero stockouts</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Inpatient Admissions</div>
                      <div className="text-2xl font-bold text-white mt-2">48 Occupied</div>
                      <div className="text-amber-400 text-xs mt-1">82% bed occupancy</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">NHIF / Insurance Claims</div>
                      <div className="text-2xl font-bold text-white mt-2">KES 2.4M</div>
                      <div className="text-emerald-400 text-xs mt-1">Processed successfully</div>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Active Medical Consultations & EMR Feed</h3>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                      <span>Patient #PAT-8842 (Dr. Kamau - General Medicine) • Vitals Recorded: BP 120/80, Temp 36.6°C</span>
                      <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded">Prescription Issued</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'retail' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Today's POS Sales</div>
                      <div className="text-2xl font-bold text-white mt-2">KES 384,500</div>
                      <div className="text-emerald-400 text-xs mt-1">↑ 286 transactions</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Active Registers</div>
                      <div className="text-2xl font-bold text-white mt-2">6 Terminals</div>
                      <div className="text-teal-400 text-xs mt-1">Main Branch & CBD</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Inventory Valuation</div>
                      <div className="text-2xl font-bold text-white mt-2">KES 18.2M</div>
                      <div className="text-indigo-400 text-xs mt-1">1,420 SKUs tracked</div>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
                      <div className="text-slate-400 text-xs uppercase font-semibold">Debtor Collections</div>
                      <div className="text-2xl font-bold text-white mt-2">KES 1.2M</div>
                      <div className="text-emerald-400 text-xs mt-1">Collected this week</div>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Recent POS Checkout Receipts</h3>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                      <span>Receipt #RCP-9941 • M-Pesa Till 884200 • KES 12,450 • Cashier: David R.</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">Completed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
