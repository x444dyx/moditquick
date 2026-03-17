import React, { useState, useEffect } from 'react';
import Ajv from 'ajv';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Code, List, Trash2, Copy, Check, ShieldCheck } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

const ajv = new Ajv({ allErrors: true });

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState('{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "number" }\n  },\n  "required": ["name"]\n}');
  const [data, setData] = useState('{\n  "name": "John Doe",\n  "age": 30\n}');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    validate();
  }, [schema, data]);

  const validate = () => {
    if (!schema.trim() || !data.trim()) {
      setIsValid(null);
      setErrors([]);
      return;
    }

    try {
      const parsedSchema = JSON.parse(schema);
      const parsedData = JSON.parse(data);
      
      const validateFn = ajv.compile(parsedSchema);
      const valid = validateFn(parsedData);
      
      setIsValid(!!valid);
      setErrors(validateFn.errors || []);
    } catch (err: any) {
      setIsValid(false);
      setErrors([{ message: err.message || 'Invalid JSON format' }]);
    }
  };

  const clear = () => {
    setSchema('');
    setData('');
    setIsValid(null);
    setErrors([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">JSON Schema Validator</h1>
          <p className="text-white/60">Validate JSON data against a JSON Schema locally. Fast, secure, and private.</p>
        </div>
        <button 
          onClick={clear}
          className="glass p-3 rounded-full text-white/40 hover:text-red-400 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
        {/* Schema Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <Code size={14} />
              JSON Schema
            </div>
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={schema}
              onChange={(v) => setSchema(v || '')}
              language="json"
            />
          </div>
        </div>

        {/* Data Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <List size={14} />
              JSON Data
            </div>
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={data}
              onChange={(v) => setData(v || '')}
              language="json"
            />
          </div>
        </div>
      </div>

      {/* Validation Result */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
          <ShieldCheck size={14} />
          Validation Result
        </div>

        <AnimatePresence mode="wait">
          {isValid === null ? (
            <div className="glass p-12 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10 text-center">
              <AlertCircle size={48} className="mb-4" />
              <p className="font-medium">Enter Schema and Data to validate</p>
            </div>
          ) : isValid ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-emerald-500">Validation Passed!</p>
                <p className="text-white/60">The JSON data is valid against the provided schema.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[40px] border border-red-500/20 bg-red-500/5 space-y-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                  <XCircle size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-red-400">Validation Failed</p>
                  <p className="text-white/60">Found {errors.length} error(s) in the data structure.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-black/20 border border-white/5 text-sm">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-white/80 font-medium">{err.message}</p>
                      {err.instancePath && (
                        <p className="text-[10px] font-mono text-white/20">Path: {err.instancePath}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
