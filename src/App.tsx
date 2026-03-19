import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeIdea } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [idea, setIdea] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setError('');
    setAnalysis('');

    try {
      const result = await analyzeIdea(idea);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 border border-emerald-500/20"
          >
            <Rocket className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Venture Capital <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Pitch Coach</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Pitch your startup idea and get brutally honest, investor-grade feedback, risk analysis, and a refined elevator pitch.
          </motion.p>
        </div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleAnalyze}
          className="mb-12"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-2 transition-colors focus-within:border-emerald-500/50">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your startup idea... (e.g., 'An AI-powered platform that helps freelance designers manage their invoices and client communications automatically.')"
                className="w-full h-40 bg-transparent text-zinc-100 placeholder:text-zinc-600 resize-none p-4 focus:outline-none"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center p-2 border-t border-zinc-800/50 mt-2">
                <span className="text-xs text-zinc-500 px-2">
                  {idea.length} characters
                </span>
                <button
                  type="submit"
                  disabled={isLoading || !idea.trim()}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all",
                    isLoading || !idea.trim()
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Pitch
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {analysis && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold">Investor Analysis</h2>
              </div>
              <div className="markdown-body">
                <Markdown remarkPlugins={[remarkGfm]}>{analysis}</Markdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
