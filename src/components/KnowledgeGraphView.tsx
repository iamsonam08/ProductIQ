import React, { useState, useEffect } from 'react';
import { GitFork, AlertTriangle, ShieldCheck, Plus, CheckCircle2, X } from 'lucide-react';
import { KnowledgeGraphRule } from '../types';
import { MATERIAL_PRESSURE_LIMITS } from '../data/knowledgeGraphRules';

interface KnowledgeGraphViewProps {
  userRole?: 'demo' | 'admin';
  onRequestAdminLogin?: (actionName: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  userRole = 'demo',
  onRequestAdminLogin,
}) => {
  const [rules, setRules] = useState<KnowledgeGraphRule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Rule Modal
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newRule, setNewRule] = useState({
    category: '',
    allowedMaterials: '',
    typicalSpecs: '',
    pressureClasses: '',
    notes: ''
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge-graph');
      const data = await res.json();
      setRules(data || []);
    } catch (err) {
      console.error('Error fetching Knowledge Graph rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSaveRule = async () => {
    if (!newRule.category.trim()) return;

    try {
      const payload = {
        category: newRule.category,
        allowedMaterials: newRule.allowedMaterials.split(',').map(s => s.trim()).filter(Boolean),
        typicalSpecs: newRule.typicalSpecs.split(',').map(s => s.trim()).filter(Boolean),
        pressureClasses: newRule.pressureClasses.split(',').map(s => s.trim()).filter(Boolean),
        notes: newRule.notes
      };

      const res = await fetch('/api/knowledge-graph/rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddOpen(false);
        setNewRule({ category: '', allowedMaterials: '', typicalSpecs: '', pressureClasses: '', notes: '' });
        fetchRules();
      }
    } catch (err) {
      console.error('Error saving rule:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 text-slate-200 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center space-x-2.5">
              <GitFork className="w-5 h-5 text-purple-400" />
              <span>Industrial Knowledge Graph & Physical Rules Engine</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-normal">
              Maintains relationships between categories, allowed materials, and standard spec codes. Automatically flags physical inconsistencies.
            </p>
          </div>

          <button
            onClick={() => {
              if (userRole === 'demo') {
                onRequestAdminLogin?.('Adding or managing Knowledge Graph rules requires Admin login.');
              } else {
                setIsAddOpen(true);
              }
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-950 flex items-center justify-center space-x-2 shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Graph Rule</span>
            {userRole === 'demo' && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-950/60 text-amber-300 font-mono border border-amber-500/30">
                Admin
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Physical Limits Matrix Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Active Material Physical Pressure Limits</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(MATERIAL_PRESSURE_LIMITS).map(([mat, limits]) => (
            <div key={mat} className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 hover:border-purple-500/40 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-purple-300">{mat}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-200 font-mono border border-purple-800">
                  Max: Class {limits.maxPressureClass}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-1">{limits.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800/90 space-y-3.5 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 group-hover:text-indigo-300 transition-colors break-words">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{rule.category} Ontology</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">ID: {rule.id}</span>
            </div>

            <p className="text-xs text-slate-300 font-normal leading-relaxed">{rule.notes}</p>

            <div className="space-y-2 text-xs font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Allowed Materials:</span>
                <span className="text-slate-200 font-semibold break-words">{rule.allowedMaterials.join(', ')}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Standard Specs:</span>
                <span className="text-cyan-300 font-semibold break-words">{rule.typicalSpecs.join(', ')}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Pressure Classes:</span>
                <span className="text-indigo-300 font-semibold break-words">{rule.pressureClasses.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Rule Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 text-slate-100">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <GitFork className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Add Knowledge Graph Rule</span>
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-2 min-h-[36px] min-w-[36px] rounded bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  value={newRule.category}
                  onChange={e => setNewRule({ ...newRule, category: e.target.value })}
                  placeholder="e.g. Butterfly Valves"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Allowed Materials (Comma separated)</label>
                <input
                  type="text"
                  value={newRule.allowedMaterials}
                  onChange={e => setNewRule({ ...newRule, allowedMaterials: e.target.value })}
                  placeholder="Ductile Iron, 316 SS, Bronze"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Typical Specs (Comma separated)</label>
                <input
                  type="text"
                  value={newRule.typicalSpecs}
                  onChange={e => setNewRule({ ...newRule, typicalSpecs: e.target.value })}
                  placeholder="API 609, AWWA C504"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Pressure Classes (Comma separated)</label>
                <input
                  type="text"
                  value={newRule.pressureClasses}
                  onChange={e => setNewRule({ ...newRule, pressureClasses: e.target.value })}
                  placeholder="Class 150, 150 PSI, PN16"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={newRule.notes}
                  onChange={e => setNewRule({ ...newRule, notes: e.target.value })}
                  placeholder="Butterfly valves are quarter-turn rotary valves used for flow regulation."
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs bg-slate-800 text-slate-300">
                Cancel
              </button>
              <button onClick={handleSaveRule} className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs bg-purple-500 text-slate-950 font-bold">
                Save Rule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
