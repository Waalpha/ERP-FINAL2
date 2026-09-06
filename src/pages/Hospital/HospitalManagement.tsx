import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Stethoscope,
  Users,
  Pill,
  Receipt,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Heart,
  Calendar,
  FileText,
  Clock
} from 'lucide-react';
import { HospitalSettingsTab } from './HospitalSettingsTab';
import { HospitalPatient, MedicalConsultation, PharmacyItem } from '../../types';

interface HospitalManagementProps {
  currentTab: string;
}

export const HospitalManagement: React.FC<HospitalManagementProps> = ({ currentTab }) => {
  const {
    tenant,
    hospitalPatients,
    medicalConsultations,
    pharmacyItems,
    admitHospitalPatient,
    recordMedicalConsultation
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // New Patient Form
  const [pName, setPName] = useState('');
  const [pNo, setPNo] = useState('');
  const [pAge, setPAge] = useState(30);
  const [pGender, setPGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('FEMALE');
  const [pPhone, setPPhone] = useState('');
  const [pBloodGroup, setPBloodGroup] = useState('O+');
  const [pBp, setPBp] = useState('120/80');
  const [pTemp, setPTemp] = useState(36.8);
  const [pWeight, setPWeight] = useState(65);

  // Consultation Form
  const [cPatientId, setCPatientId] = useState(hospitalPatients[0]?.id || '');
  const [cDoctorName, setCDoctorName] = useState('Dr. Sarah Kamau, MD');
  const [cDiagnosis, setCDiagnosis] = useState('');
  const [cNotes, setCNotes] = useState('');
  const [cPrescription, setCPrescription] = useState('');
  const [cAmount, setCAmount] = useState(2500);

  // KPIs
  const totalPatients = hospitalPatients.length;
  const triageQueue = hospitalPatients.filter(p => p.status === 'TRIAGE' || p.status === 'WAITING').length;
  const totalConsultations = medicalConsultations.length;
  const totalPharmacyItems = pharmacyItems.length;

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pNo) return;
    await admitHospitalPatient({
      patientNo: pNo.toUpperCase(),
      fullName: pName,
      age: pAge,
      gender: pGender,
      phone: pPhone,
      bloodGroup: pBloodGroup,
      vitals: {
        bloodPressure: pBp,
        temperature: pTemp,
        pulseRate: 72,
        weightKg: pWeight
      }
    });
    setPName('');
    setPNo('');
    setShowPatientModal(false);
  };

  const handleRecordConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cPatientId || !cDiagnosis) return;
    const targetPatient = hospitalPatients.find(p => p.id === cPatientId);
    await recordMedicalConsultation({
      patientId: cPatientId,
      patientName: targetPatient?.fullName || 'Patient',
      doctorName: cDoctorName,
      diagnosis: cDiagnosis,
      clinicalNotes: cNotes,
      prescriptions: cPrescription ? [{ drugName: cPrescription, dosage: '1 tab TDS', durationDays: 5, instructions: 'After meals' }] : [],
      consultationFee: cAmount
    });
    setCDiagnosis('');
    setCNotes('');
    setCPrescription('');
    setShowConsultationModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Hospital Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {tenant?.type.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">Clinical Ward & Outpatient</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{tenant?.name}</h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Outpatient triage, patient health records, doctor clinical consultations, diagnostic notes and pharmacy dispensary.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPatientModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setShowConsultationModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <Stethoscope className="h-4 w-4 text-rose-400" />
              <span>New Consultation</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Registered Patients</span>
              <Users className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalPatients}</div>
            <div className="text-[11px] text-slate-400 mt-1">Medical EMR Records</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Triage / Waiting Queue</span>
              <Activity className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">{triageQueue}</div>
            <div className="text-[11px] text-slate-400 mt-1">Ready for Doctor</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Consultations Today</span>
              <Stethoscope className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">{totalConsultations}</div>
            <div className="text-[11px] text-slate-400 mt-1">Diagnosis & Prescriptions</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Pharmacy Formulations</span>
              <Pill className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalPharmacyItems}</div>
            <div className="text-[11px] text-cyan-300 mt-1">Dispensary Stock Active</div>
          </div>
        </div>
      </div>

      {/* Patient Registry & Triage Queue */}
      {(currentTab === 'hospital-patients' || currentTab === 'hospital-overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Patient Registry & Triage Vitals</h2>
              <p className="text-xs text-slate-500">Record vital signs, triage urgency and medical history</p>
            </div>
            <div className="relative max-w-xs">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient by name or No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Patient & File No</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Triage Vitals</th>
                  <th className="py-3 px-4">Clinical Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitalPatients
                  .filter(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || p.patientNo.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{p.fullName}</div>
                        <div className="text-[11px] font-mono text-rose-700">{p.patientNo} • {p.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.age} Yrs • {p.gender}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold text-[10px]">
                          {p.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {p.vitals ? (
                          <span>
                            BP: {p.vitals.bloodPressure || '120/80'} | {p.vitals.temperature || 36.8}°C | {p.vitals.weightKg || '--'}kg
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans text-[11px] italic">Vitals Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Consultations Tab */}
      {currentTab === 'hospital-consultations' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Doctor Clinical Consultations & Notes</h2>
              <p className="text-xs text-slate-500">Document clinical impressions, diagnoses and prescriptions</p>
            </div>
            <button
              onClick={() => setShowConsultationModal(true)}
              className="px-3 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Record Consultation</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {medicalConsultations.map((c) => (
              <div key={c.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{c.patientName}</h3>
                    <p className="text-xs text-slate-500">Attending: <span className="font-medium text-slate-800">{c.doctorName}</span></p>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div><strong className="text-slate-800">Diagnosis:</strong> <span className="text-rose-700 font-semibold">{c.diagnosis}</span></div>
                  <div><strong className="text-slate-800">Notes:</strong> <span className="text-slate-600">{c.clinicalNotes}</span></div>
                  {c.prescriptions && c.prescriptions.length > 0 && (
                    <div className="pt-1 text-slate-700">
                      <strong>Rx Prescribed:</strong> {c.prescriptions.map(p => `${p.drugName} (${p.dosage})`).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pharmacy & Dispensary Tab */}
      {currentTab === 'hospital-pharmacy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Pharmacy Dispensary & Drug Inventory</h2>
            <p className="text-xs text-slate-500">Pharmaceutical stock on hand, formulations, and expiry surveillance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pharmacyItems.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                    {item.formulation}
                  </span>
                  <span className="font-bold text-xs text-slate-900">
                    KES {item.unitPrice} / dose
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{item.name}</h3>
                <p className="text-xs text-slate-500">Dosage: {item.dosage}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span>Stock: <strong className="text-emerald-700">{item.stockQuantity}</strong></span>
                  <span className="text-[10px] text-slate-400 font-mono">Exp: {item.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {currentTab === 'hospital-settings' && (
        <HospitalSettingsTab />
      )}

      {/* Patient Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Register Outpatient</h3>
            <form onSubmit={handleCreatePatient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grace Achieng"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient / File No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PAT-2025-01"
                    value={pNo}
                    onChange={(e) => setPNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="0712345678"
                    value={pPhone}
                    onChange={(e) => setPPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={pAge}
                    onChange={(e) => setPAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={pGender}
                    onChange={(e) => setPGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood</label>
                  <input
                    type="text"
                    value={pBloodGroup}
                    onChange={(e) => setPBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Press.</label>
                  <input
                    type="text"
                    value={pBp}
                    onChange={(e) => setPBp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pTemp}
                    onChange={(e) => setPTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={pWeight}
                    onChange={(e) => setPWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Record Clinical Consultation</h3>
            <form onSubmit={handleRecordConsultation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient</label>
                <select
                  value={cPatientId}
                  onChange={(e) => setCPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {hospitalPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.patientNo})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={cDoctorName}
                  onChange={(e) => setCDoctorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Tonsillitis / Upper Respiratory Tract Infection"
                  value={cDiagnosis}
                  onChange={(e) => setCDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Notes</label>
                <textarea
                  rows={2}
                  placeholder="Patient presented with sore throat, fever of 38.2C..."
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prescriptions (Rx)</label>
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin 500mg, Paracetamol 1g"
                  value={cPrescription}
                  onChange={(e) => setCPrescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowConsultationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
                >
                  Save Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
