import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { 
  Table as TableIcon, 
  Code, 
  Download, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Copy,
  FileSpreadsheet
} from 'lucide-react';

export default function CsvEditor() {
  const [csvText, setCsvText] = useState('id,name,email,role\n1,John Doe,john@example.com,Admin\n2,Jane Smith,jane@example.com,User\n3,Bob Wilson,bob@example.com,Editor');
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [view, setView] = useState<'table' | 'raw'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (view === 'table') {
      const timer = setTimeout(() => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        if (parsed.data.length > 0) {
          setData(parsed.data);
          setHeaders(Object.keys(parsed.data[0]));
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [csvText, view]);

  const updateRawFromTable = (newData: any[]) => {
    const csv = Papa.unparse(newData);
    setCsvText(csv);
    setData(newData);
  };

  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const newData = [...data];
    newData[rowIndex][header] = value;
    updateRawFromTable(newData);
  };

  const addRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
    updateRawFromTable([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    updateRawFromTable(newData);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modit-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(csvText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">CSV Editor</h1>
          <p className="text-white/60">Edit your CSV data in a powerful table view or raw text mode.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass p-1 rounded-full flex">
            <button
              onClick={() => setView('table')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'table' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <TableIcon size={16} />
              Table View
            </button>
            <button
              onClick={() => setView('raw')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                view === 'raw' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Code size={16} />
              Raw Text
            </button>
          </div>
          <button onClick={downloadCsv} className="btn-primary px-6 py-2 flex items-center gap-2">
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      <div className="glass rounded-[40px] overflow-hidden border border-white/5 min-h-[600px] flex flex-col">
        {view === 'table' ? (
          <>
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  type="text"
                  placeholder="Search rows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full glass rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <button 
                onClick={addRow}
                className="glass px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-primary"
              >
                <Plus size={16} />
                Add Row
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-black/40 backdrop-blur-xl z-10">
                  <tr>
                    {headers.map((header) => (
                      <th key={header} className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/5">
                        {header}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/5 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-white/5 transition-colors group">
                      {headers.map((header) => (
                        <td key={header} className="px-6 py-3">
                          <input
                            type="text"
                            value={row[header] || ''}
                            onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm focus:text-primary transition-colors"
                          />
                        </td>
                      ))}
                      <td className="px-6 py-3 text-right">
                        <button 
                          onClick={() => deleteRow(rowIndex)}
                          className="text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-white/10">
                  <FileSpreadsheet size={48} className="mb-4" />
                  <p>No data found</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-end bg-white/5">
              <button onClick={copyToClipboard} className="text-xs text-primary flex items-center gap-1.5 font-medium">
                {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {isCopied ? 'Copied' : 'Copy CSV'}
              </button>
            </div>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="flex-1 bg-transparent p-8 font-mono text-sm focus:outline-none resize-none leading-relaxed"
              placeholder="Paste your CSV data here..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
