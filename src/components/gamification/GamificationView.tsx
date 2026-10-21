import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Award, 
  CheckCircle2, 
  Zap, 
  Target, 
  Sparkles,
  Star,
  Shield,
  ArrowRight
} from 'lucide-react';
import { GamificationProfile } from '../../types/campus';
import { apiClient } from '../../services/apiClient';
import { TiltCard, ParallaxLayer } from '../common/TiltCard';

interface GamificationViewProps {
  initialProfile: GamificationProfile;
}

export function GamificationView({ initialProfile }: GamificationViewProps) {
  const [profile, setProfile] = useState<GamificationProfile>(initialProfile);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));

  const handleClaim = async (questId: string) => {
    setClaimingId(questId);
    try {
      const res = await apiClient.claimQuest(questId);
      if (res.success) {
        setProfile(res.gamification);
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#10b981', '#38bdf8', '#fbbf24']
        });
      }
    } catch (err) {
      console.error('Failed to claim quest reward:', err);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Academic Engagement</span>
            <span aria-hidden="true">·</span>
            <span>Gamification & Quests</span>
            <span aria-hidden="true">·</span>
            <span>Milestone Honors</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Student Quests & Achievement Hall</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Earn Experience Points (XP) through timely submissions, consistent attendance, and academic excellence.
          </p>
        </div>

        {/* Streak & Level Quick Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{profile.streakDays} Days Study Streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-300 text-xs font-semibold">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>Level {profile.level}</span>
          </div>
        </div>
      </div>

      {/* Hero Level & XP Progression Card with 3D Parallax Depth */}
      <TiltCard maxTilt={6} glare={true} className="rounded-2xl">
        <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ParallaxLayer z={32}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-purple-600/40">
                  L{profile.level}
                </div>
              </ParallaxLayer>
              <div>
                <ParallaxLayer z={12}>
                  <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Current Standing</span>
                </ParallaxLayer>
                <ParallaxLayer z={22}>
                  <h3 className="text-lg font-bold text-white mt-0.5">{profile.levelTitle}</h3>
                </ParallaxLayer>
                <ParallaxLayer z={14}>
                  <p className="text-xs text-slate-400 mt-0.5">Top 5% of 3rd Year Computer Science & AI cohort</p>
                </ParallaxLayer>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <ParallaxLayer z={12}>
                <span className="text-xs text-slate-400">Total Experience Points</span>
              </ParallaxLayer>
              <ParallaxLayer z={24}>
                <div className="text-2xl font-black text-white font-mono tabular-nums">
                  {profile.xp.toLocaleString()} <span className="text-xs text-purple-400 font-normal">/ {profile.nextLevelXp.toLocaleString()} XP</span>
                </div>
              </ParallaxLayer>
              <ParallaxLayer z={14}>
                <span className="text-[11px] text-slate-500 font-mono">
                  {(profile.nextLevelXp - profile.xp)} XP remaining to Level {profile.level + 1}
                </span>
              </ParallaxLayer>
            </div>
          </div>

          {/* Level XP Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Level {profile.level}</span>
              <span>{xpPercent}% Progress</span>
              <span>Level {profile.level + 1}</span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* 2 Columns: Weekly Quests (7 cols) + Achievement Badges (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Quests (7 cols) */}
        <div className="lg:col-span-7">
          <TiltCard maxTilt={5} glare={true} className="rounded-2xl h-full">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <ParallaxLayer z={14}>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Weekly Academic Quests
                  </h3>
                </ParallaxLayer>
                <ParallaxLayer z={18}>
                  <span className="text-xs text-slate-400 font-mono">Resets every Monday</span>
                </ParallaxLayer>
              </div>

              <div className="space-y-3">
                {profile.quests.map(quest => (
                  <TiltCard key={quest.id} maxTilt={6} scale={1.01} glare={true} className="rounded-xl">
                    <div className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/50 rounded-xl space-y-3 transition-all shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <ParallaxLayer z={14}>
                            <h4 className="text-xs font-semibold text-white">{quest.title}</h4>
                          </ParallaxLayer>
                          <ParallaxLayer z={10}>
                            <span className="text-[11px] text-purple-400 font-mono mt-0.5 block">
                              Reward: +{quest.rewardXp} XP
                            </span>
                          </ParallaxLayer>
                        </div>

                        <div>
                          {quest.claimed ? (
                            <span className="px-2.5 py-1 text-[11px] font-medium text-slate-400 bg-slate-800 rounded-md border border-slate-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Claimed
                            </span>
                          ) : quest.completed ? (
                            <button
                              onClick={() => handleClaim(quest.id)}
                              disabled={claimingId === quest.id}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md transition-all flex items-center gap-1.5 animate-pulse"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Claim Reward</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-mono tabular-nums">
                              {quest.progress} / {quest.goal}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mini progress bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (quest.progress / quest.goal) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Achievement Badges (5 cols) */}
        <div className="lg:col-span-5">
          <TiltCard maxTilt={5} glare={true} className="rounded-2xl h-full">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <ParallaxLayer z={14}>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    Honors & Badges ({profile.badges.length})
                  </h3>
                </ParallaxLayer>
                <ParallaxLayer z={18}>
                  <span className="text-xs text-emerald-400 font-mono">Official Transcript Valid</span>
                </ParallaxLayer>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {profile.badges.map(b => (
                  <TiltCard key={b.id} maxTilt={6} scale={1.01} glare={true} className="rounded-xl">
                    <div className="p-3 bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 rounded-xl flex items-start gap-3 transition-all shadow-sm">
                      <ParallaxLayer z={26}>
                        <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-sm">
                          <Award className="w-5 h-5" />
                        </div>
                      </ParallaxLayer>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <ParallaxLayer z={14}>
                            <h4 className="text-xs font-bold text-white">{b.title}</h4>
                          </ParallaxLayer>
                          <ParallaxLayer z={10}>
                            <span className="text-[10px] text-slate-500 font-mono">{b.unlockedAt}</span>
                          </ParallaxLayer>
                        </div>
                        <ParallaxLayer z={10}>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">{b.description}</p>
                        </ParallaxLayer>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
