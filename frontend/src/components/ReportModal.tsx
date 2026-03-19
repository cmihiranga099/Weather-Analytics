import React from 'react';
import { jsPDF } from 'jspdf';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string;
  cityName: string;
  period: string;
  onPeriodChange: (period: string) => void;
  isGenerating: boolean;
  cities: { code: string; name: string }[];
  selectedCityCode: string;
  onCityChange: (cityCode: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  report, 
  cityName, 
  period, 
  onPeriodChange,
  isGenerating,
  cities,
  selectedCityCode,
  onCityChange
}) => {
  if (!isOpen) return null;

  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ];

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([report], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Weather_Report_${cityName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const title = `Weather Intelligence Report`;
    const subTitle = cityName;
    const date = `Generated: ${new Date().toLocaleDateString()}`;
    const periodLabel = `Review Period: ${period.toUpperCase()}`;

    // Helper to clean markdown/emojis
    const cleanText = (text: string) => {
      return text
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
        .replace(/[#*`_]/g, '') // Remove simple markdown
        .trim();
    };

    // Header Color Bar
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');

    // Title styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 20, 20);

    doc.setFontSize(14);
    doc.text(subTitle, 20, 30);

    // Meta Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`${date}  |  ${periodLabel}`, 20, 35);

    // Body Content
    let yPos = 55;
    doc.setTextColor(30, 41, 59);
    
    const lines = report.split('\n');
    lines.forEach(line => {
      const cleaned = cleanText(line);
      if (!cleaned) {
        yPos += 5;
        return;
      }

      if (line.startsWith('## ') || line.startsWith('# ')) {
        yPos += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(59, 130, 246);
        doc.text(cleaned, 20, yPos);
        yPos += 8;
        doc.setDrawColor(226, 232, 240);
        doc.line(20, yPos - 5, 190, yPos - 5);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        const splitLine = doc.splitTextToSize(cleaned, 170);
        doc.text(splitLine, 20, yPos);
        yPos += (splitLine.length * 7);
      }

      // Page break check
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`SkyCast_Report_${cityName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass w-full max-w-2xl max-h-[85vh] rounded-[32px] shadow-2xl flex flex-col animate-slide-up border-2 border-slate-200 dark:border-slate-700">
        <div className="p-8 border-b-2 border-slate-100 dark:border-slate-800/50">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Weather <span className="text-primary-600 dark:text-primary-400">Intelligence Report</span>
              </h3>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {cityName}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all hover:rotate-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex gap-1.5 bg-slate-100/50 dark:bg-slate-900/40 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPeriodChange(p.id)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    period === p.id
                      ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-48 group lg:ml-auto">
              <select
                value={selectedCityCode}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 text-xs font-bold bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 appearance-none cursor-pointer transition-all"
              >
                {cities.map((city) => (
                  <option key={city.code} value={city.code} className="bg-white dark:bg-slate-900">
                    {city.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-hover:text-primary-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className={`relative whitespace-pre-wrap text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[24px] border border-slate-200/50 dark:border-slate-800/50 transition-all duration-500 font-mono text-sm leading-relaxed ${isGenerating ? 'opacity-40 blur-sm scale-95' : 'opacity-100 scale-100'}`}>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-500 rounded-full animate-spin [animation-duration:1.5s]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">Aggregating Metrics...</p>
              </div>
            ) : (
              report || (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                   <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                   <p className="font-bold">Awaiting Data Generation</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap justify-end items-center gap-4 bg-slate-50/30 dark:bg-slate-900/30">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Collapse
          </button>
          
          <button
            onClick={downloadMarkdown}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 border border-slate-200 dark:border-slate-700 rounded-2xl transition-all"
            disabled={!report || isGenerating}
          >
            MD File
          </button>

          <button
            onClick={downloadPdf}
            className="btn-primary flex items-center gap-2 group"
            disabled={!report || isGenerating}
          >
            <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
;

export default ReportModal;
