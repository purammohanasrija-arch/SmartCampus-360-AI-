import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Trash2, 
  BookOpen, 
  Calendar, 
  Award, 
  ShieldAlert, 
  User as UserIcon,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { Student } from '../../types/campus';

interface CampusCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  { label: 'Attendance Rules', prompt: 'Explain the 75% attendance policy and condonation rules.' },
  { label: 'Upcoming Deadlines', prompt: 'Which coursework assignments and exam schedules are due this week?' },
  { label: '2-Week Revision Plan', prompt: 'Create a focused revision timetable for my upcoming Midterm exams.' },
  { label: 'Scholarship Eligibility', prompt: 'What scholarships and research grants am I eligible for based on my CGPA?' },
];

export function CampusCopilotModal({ isOpen, onClose, currentStudent }: CampusCopilotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${currentStudent.name.split(' ')[0]}! I am your **SmartCampus 360 AI Copilot**.\n\nI have loaded your 6th-semester academic record (**CGPA ${currentStudent.cgpa} · Attendance ${currentStudent.attendancePercentage}%**). How can I assist your studies or university workflow today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await apiClient.askCopilot(prompt, currentStudent);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.response || 'I processed your query according to university regulations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'I encountered a temporary connection issue. Your academic records are safely stored on the local campus database.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `Conversation reset. Ready to answer university policy, exam prep, or attendance questions for ${currentStudent.name}.`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[650px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">SmartCampus 360 AI Copilot</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional Academic Assistant · Authorized Student Context Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-purple-400'
                }`}
              >
                {msg.sender === 'user' ? currentStudent.name.charAt(0) : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                {/* Render markdown-like simple linebreaks & bold */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-purple-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-purple-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing institutional knowledge base & policy regulations...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px] shrink-0">Quick Ask:</span>
          {SUGGESTED_PROMPTS.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sp.prompt)}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-md text-[11px] whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about attendance policies, exam schedules, or revision strategy..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
