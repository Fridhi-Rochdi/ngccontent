"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import useSWR from "swr";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  Zap,
  Target,
  Palette,
  Rocket,
  Brain,
  TrendingUp,
  Users,
  Award,
  FileText,
  RefreshCw,
  Eye
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  order: number;
  status: string;
  content: LessonContent[];
}

interface LessonContent {
  id: string;
  version: string;
  content: any;
  isSelected: boolean;
  createdAt: string;
}

interface SkillPath {
  id: string;
  name: string;
  sommaire: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SkillPathDetail() {
  const params = useParams();
  const [generatingLessons, setGeneratingLessons] = useState<Set<string>>(new Set());
  const [selectedVersion, setSelectedVersion] = useState<'basic' | 'creative' | 'advanced'>('basic');
  
  const { data: skillPath, error, mutate } = useSWR<SkillPath>(
    params?.id ? `/api/skillpaths/${params.id}` : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  const generateLessonContent = async (lessonId: string, version: 'basic' | 'creative' | 'advanced') => {
    try {
      setGeneratingLessons(prev => new Set(prev).add(lessonId));
      
      const response = await fetch(`/api/skillpaths/${params.id}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          version
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      console.log('Content generated:', result);
      
      mutate();
      
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Erreur lors de la génération du contenu');
    } finally {
      setGeneratingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(lessonId);
        return newSet;
      });
    }
  };

  const generateAllContent = async () => {
    if (!skillPath) return;
    
    for (const lesson of skillPath.lessons) {
      if (lesson.status !== 'COMPLETED') {
        await generateLessonContent(lesson.id, selectedVersion);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { 
        icon: Clock, 
        label: "En attente", 
        className: "status-pending",
        bgClass: "bg-amber-100",
        textClass: "text-amber-800",
        borderClass: "border-amber-200"
      },
      GENERATING: { 
        icon: Zap, 
        label: "Génération...", 
        className: "status-generating animate-pulse",
        bgClass: "bg-blue-100",
        textClass: "text-blue-800",
        borderClass: "border-blue-200"
      },
      COMPLETED: { 
        icon: CheckCircle, 
        label: "Terminé", 
        className: "status-completed",
        bgClass: "bg-green-100",
        textClass: "text-green-800",
        borderClass: "border-green-200"
      },
      FAILED: { 
        icon: AlertCircle, 
        label: "Échec", 
        className: "status-failed",
        bgClass: "bg-red-100",
        textClass: "text-red-800",
        borderClass: "border-red-200"
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
          <div className="glass-effect max-w-md w-full p-8 rounded-2xl text-center animate-slide-in-up">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-3">Erreur de Chargement</h2>
            <p className="text-slate-300 mb-6">Impossible de charger le skill path demandé</p>
            <Button onClick={() => window.location.href = '/skillpaths'} className="btn-primary-modern">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!skillPath) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
          <div className="glass-effect max-w-md w-full p-8 rounded-2xl text-center animate-slide-in-up">
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-3">Chargement</h2>
            <p className="text-slate-300">Récupération des données du skill path...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const progressStats = {
    total: skillPath?.lessons?.length || 0,
    pending: skillPath?.lessons?.filter(l => l.status === 'PENDING').length || 0,
    generating: skillPath?.lessons?.filter(l => l.status === 'GENERATING').length || 0,
    completed: skillPath?.lessons?.filter(l => l.status === 'COMPLETED').length || 0,
    failed: skillPath?.lessons?.filter(l => l.status === 'FAILED').length || 0,
  };

  const progressPercentage = progressStats.total > 0 
    ? Math.round((progressStats.completed / progressStats.total) * 100) 
    : 0;

  const versionConfigs = {
    basic: {
      icon: BookOpen,
      title: "Basique",
      description: "Contenu simple et direct, adapté aux débutants",
      gradient: "from-blue-500 to-cyan-500"
    },
    creative: {
      icon: Palette,
      title: "Créative",
      description: "Contenu engageant avec analogies créatives",
      gradient: "from-purple-500 to-pink-500"
    },
    advanced: {
      icon: Rocket,
      title: "Avancée",
      description: "Contenu approfondi avec défis techniques",
      gradient: "from-orange-500 to-red-500"
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-dark">
        {/* Hero Header Ultra-Modern */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-slate-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-slate-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-slate-700/10 to-slate-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-8 py-16">
            <div className="flex items-center justify-between mb-12">
              <Button 
                onClick={() => window.location.href = '/skillpaths'}
                className="glass-effect border-0 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '12px'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${getStatusConfig(skillPath.status).bgClass} ${getStatusConfig(skillPath.status).textClass} border ${getStatusConfig(skillPath.status).borderClass}`}
                     style={{
                       background: skillPath.status === 'COMPLETED' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))' :
                                 skillPath.status === 'GENERATING' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))' :
                                 'linear-gradient(135deg, rgba(71, 85, 105, 0.2), rgba(51, 65, 85, 0.3))',
                       border: skillPath.status === 'COMPLETED' ? '1px solid rgba(34, 197, 94, 0.4)' :
                              skillPath.status === 'GENERATING' ? '1px solid rgba(59, 130, 246, 0.4)' :
                              '1px solid rgba(71, 85, 105, 0.4)',
                       boxShadow: skillPath.status === 'COMPLETED' ? '0 4px 20px rgba(34, 197, 94, 0.3)' :
                                 skillPath.status === 'GENERATING' ? '0 4px 20px rgba(59, 130, 246, 0.3)' :
                                 '0 4px 20px rgba(71, 85, 105, 0.3)'
                     }}>
                  {React.createElement(getStatusConfig(skillPath.status).icon, { 
                    className: `w-5 h-5 mr-2 inline ${skillPath.status === 'GENERATING' ? 'animate-spin' : ''}` 
                  })}
                  {getStatusConfig(skillPath.status).label}
                </div>
              </div>
            </div>

            <div className="text-center max-w-6xl mx-auto mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-700/30 to-slate-600/30 px-6 py-3 rounded-full text-slate-300 font-semibold mb-8 backdrop-blur-sm border border-slate-500/30">
                <Award className="w-5 h-5" />
                Skill Path IA
                <Brain className="w-5 h-5" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-8 animate-slide-in-down">
                <span className="gradient-text bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                  {skillPath.name}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 animate-slide-in-up leading-relaxed max-w-5xl mx-auto">
                Parcours de formation intelligent avec génération automatique de contenu par IA avancée
              </p>
              
              {/* Stats Cards Ultra-Modern */}
              <div className="flex flex-row justify-center items-center gap-6 mt-12 flex-wrap">
                <div className="glass-effect p-6 rounded-xl animate-slide-in-up animation-delay-300 flex-1 min-w-[180px] max-w-[260px] hover:scale-105 transition-all duration-500 group"
                     style={{
                       background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(59, 130, 246, 0.2)',
                       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/30 to-slate-500/30 rounded-xl group-hover:scale-110 transition-transform duration-300"
                         style={{
                           background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(71, 85, 105, 0.3))',
                           boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                         }}>
                      <BookOpen className="w-8 h-8 text-blue-300" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-2 text-center">{progressStats.total}</div>
                  <div className="text-sm text-slate-400 text-center font-medium">Leçons totales</div>
                  <div className="mt-6 w-full h-2 bg-gradient-to-r from-blue-500/20 to-slate-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-slate-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="glass-effect p-6 rounded-xl animate-slide-in-up animation-delay-400 flex-1 min-w-[180px] max-w-[260px] hover:scale-105 transition-all duration-500 group"
                     style={{
                       background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(34, 197, 94, 0.2)',
                       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform duration-300"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.3))',
                           boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                         }}>
                      <CheckCircle className="w-8 h-8 text-green-300" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-2 text-center">{progressStats.completed}</div>
                  <div className="text-sm text-slate-400 text-center font-medium">Terminées</div>
                  <div className="mt-6 w-full h-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="glass-effect p-6 rounded-xl animate-slide-in-up animation-delay-500 flex-1 min-w-[180px] max-w-[260px] hover:scale-105 transition-all duration-500 group"
                     style={{
                       background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(245, 158, 11, 0.2)',
                       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-xl group-hover:scale-110 transition-transform duration-300"
                         style={{
                           background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.3))',
                           boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
                         }}>
                      <TrendingUp className="w-8 h-8 text-amber-300" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-2 text-center">{progressPercentage}%</div>
                  <div className="text-sm text-slate-400 text-center font-medium">Progression</div>
                  <div className="mt-6 w-full h-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="glass-effect p-8 rounded-2xl animate-slide-in-up animation-delay-600 flex-1 min-w-[200px] max-w-[300px] hover:scale-105 transition-all duration-500 group"
                     style={{
                       background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(147, 51, 234, 0.2)',
                       boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-3 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl group-hover:scale-110 transition-transform duration-300"
                         style={{
                           background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.3))',
                           boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                         }}>
                      <Award className="w-8 h-8 text-indigo-300" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-white mb-2 text-center">
                    {new Date(skillPath.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-slate-400 text-center font-medium">Créé le</div>
                  <div className="mt-4 w-full h-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Progress Bar Section Ultra-Modern */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="glass-effect p-6 rounded-xl animate-slide-in-up animation-delay-700"
               style={{
                 background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
                 backdropFilter: 'blur(25px)',
                 border: '1px solid rgba(59, 130, 246, 0.15)',
                 boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
               }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-slate-600/30 to-slate-500/30 rounded-xl"
                     style={{
                       background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.2), rgba(51, 65, 85, 0.3))',
                       boxShadow: '0 8px 25px rgba(71, 85, 105, 0.3)'
                     }}>
                  <TrendingUp className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Progression Globale</h3>
                  <p className="text-slate-400 text-sm">
                    {progressStats.completed} / {progressStats.total} leçons générées
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black gradient-text mb-1">{progressPercentage}%</div>
                <p className="text-slate-400 text-sm font-medium">Terminé</p>
              </div>
            </div>

            {/* Progress Bar Ultra-Modern */}
            <div className="relative h-6 bg-slate-700/40 rounded-2xl overflow-hidden mb-10 shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 rounded-2xl transition-all duration-1500 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/50 via-indigo-400/50 to-purple-400/50 rounded-2xl animate-pulse"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"></div>
            </div>

            {/* Stats Grid Ultra-Modern */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 hover:scale-105 transition-all duration-300 group"
                   style={{
                     background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.15) 100%)',
                     border: '1px solid rgba(245, 158, 11, 0.3)',
                     boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)'
                   }}>
                <Clock className="w-8 h-8 text-amber-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-black text-amber-200 mb-2">{progressStats.pending}</div>
                <div className="text-sm text-slate-300 font-semibold">En attente</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 hover:scale-105 transition-all duration-300 group"
                   style={{
                     background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.15) 100%)',
                     border: '1px solid rgba(59, 130, 246, 0.3)',
                     boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                   }}>
                <Zap className="w-8 h-8 text-blue-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
                <div className="text-3xl font-black text-blue-200 mb-2">{progressStats.generating}</div>
                <div className="text-sm text-slate-300 font-semibold">Génération</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 hover:scale-105 transition-all duration-300 group"
                   style={{
                     background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.15) 100%)',
                     border: '1px solid rgba(34, 197, 94, 0.3)',
                     boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)'
                   }}>
                <CheckCircle className="w-8 h-8 text-green-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-black text-green-200 mb-2">{progressStats.completed}</div>
                <div className="text-sm text-slate-300 font-semibold">Terminé</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-2xl border border-red-500/20 hover:scale-105 transition-all duration-300 group"
                   style={{
                     background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)',
                     border: '1px solid rgba(239, 68, 68, 0.3)',
                     boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)'
                   }}>
                <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-black text-red-200 mb-2">{progressStats.failed}</div>
                <div className="text-sm text-slate-300 font-semibold">Échec</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacing between sections */}
        <div className="py-4"></div>

        {/* AI Generation Controls Ultra-Modern */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="glass-effect p-6 rounded-xl animate-slide-in-up animation-delay-800"
               style={{
                 background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
                 backdropFilter: 'blur(25px)',
                 border: '1px solid rgba(59, 130, 246, 0.15)',
                 boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
               }}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-violet-500/30 to-indigo-500/30 rounded-xl mr-4"
                   style={{
                     background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.3))',
                     boxShadow: '0 12px 30px rgba(147, 51, 234, 0.3)'
                   }}>
                <Brain className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Génération Automatique IA</h3>
                <p className="text-slate-400 text-sm">Créez du contenu personnalisé avec l'intelligence artificielle avancée</p>
              </div>
            </div>

            {/* Version Selection Ultra-Modern */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-violet-400" />
                Choisir le style de génération :
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(versionConfigs).map(([key, config], index) => {
                  const isSelected = selectedVersion === key;
                  return (
                    <div 
                      key={key}
                      onClick={() => setSelectedVersion(key as any)}
                      className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-500 border-2 hover:scale-105 ${
                        isSelected 
                          ? 'border-violet-400/60 bg-violet-500/15' 
                          : 'border-slate-600/40 bg-slate-800/40 hover:bg-slate-700/50 hover:border-slate-500/50'
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(145deg, ${config.gradient.replace('from-', 'rgba(').replace('to-', 'rgba(').replace('-500', ', 0.15)')}, ${config.gradient.replace('from-', 'rgba(').replace('to-', 'rgba(').replace('-500', ', 0.1)')} 100%)`
                          : 'linear-gradient(145deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%)',
                        border: isSelected ? `2px solid ${config.gradient.includes('blue') ? '#3b82f6' : config.gradient.includes('purple') ? '#8b5cf6' : '#f59e0b'}` : '2px solid rgba(71, 85, 105, 0.3)',
                        boxShadow: isSelected ? `0 20px 40px -10px ${config.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : config.gradient.includes('purple') ? 'rgba(139, 92, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` : '0 8px 25px rgba(0, 0, 0, 0.15)',
                        animationDelay: `${index * 200}ms`
                      }}
                    >
                      {/* Animated background glow */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-3xl opacity-20 animate-pulse"
                             style={{
                               background: `linear-gradient(45deg, ${config.gradient.includes('blue') ? '#3b82f6' : config.gradient.includes('purple') ? '#8b5cf6' : '#f59e0b'}20, transparent)`
                             }} />
                      )}
                      
                      <div className="flex items-center mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${config.gradient} bg-opacity-20 mr-4 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}
                             style={{
                               boxShadow: isSelected ? `0 8px 20px ${config.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : config.gradient.includes('purple') ? 'rgba(139, 92, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)'}` : 'none'
                             }}>
                          {React.createElement(config.icon, { className: "w-8 h-8 text-white" })}
                        </div>
                        <h5 className="text-2xl font-bold text-white">{config.title}</h5>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-base mb-4">{config.description}</p>
                      
                      {isSelected && (
                        <div className="absolute top-6 right-6 animate-bounce">
                          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Progress indicator line */}
                      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${config.gradient} rounded-bl-3xl rounded-br-3xl transition-all duration-500 ${isSelected ? 'w-full' : 'w-0'}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generation Action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                onClick={generateAllContent}
                disabled={generatingLessons.size > 0}
                className="btn-primary-modern flex-1 mx-2 my-2 px-6 py-3"
              >
                {generatingLessons.size > 0 ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours... ({generatingLessons.size})
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Générer Tout le Contenu ({versionConfigs[selectedVersion].title})
                  </>
                )}
              </Button>
            </div>

            {/* Progress Indicator for Bulk Generation */}
            {generatingLessons.size > 0 && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-400 font-medium">
                    Génération en cours : {generatingLessons.size} leçon(s)
                  </span>
                  <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spacing between sections */}
        <div className="py-4"></div>

        {/* Lessons List Ultra-Modern Professional */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="glass-effect p-6 rounded-xl animate-slide-in-up animation-delay-900"
               style={{
                 background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
                 backdropFilter: 'blur(30px)',
                 border: '1px solid rgba(34, 197, 94, 0.2)',
                 boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.1)'
               }}>
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500/40 to-green-500/40 rounded-2xl mr-6 shadow-2xl"
                   style={{
                     background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.4))',
                     boxShadow: '0 16px 40px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                   }}>
                <BookOpen className="w-8 h-8 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Liste des Leçons
                </h3>
                <p className="text-slate-300 text-sm font-medium">
                  Gestion intelligente du contenu pédagogique avec IA avancée
                </p>
              </div>
            </div>

            {/* Professional Lesson Cards */}
            <div className="space-y-5">
              {skillPath.lessons.map((lesson, index) => {
                const statusConfig = getStatusConfig(lesson.status);
                const isGenerating = generatingLessons.has(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className="group relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Professional Card Design */}
                    <div
                      className="relative p-6 rounded-2xl transition-all duration-700 hover:scale-[1.02] cursor-pointer border-2 hover:border-emerald-400/50"
                      style={{
                        background: isGenerating
                          ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.25))'
                          : 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%)',
                        backdropFilter: 'blur(25px)',
                        border: isGenerating
                          ? '2px solid rgba(59, 130, 246, 0.4)'
                          : '2px solid rgba(34, 197, 94, 0.2)',
                        boxShadow: isGenerating
                          ? '0 25px 60px -15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 20px 50px -15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 20px rgba(34, 197, 94, 0.1)'
                      }}
                    >
                      {/* Animated Background Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                           style={{
                             background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
                           }} />

                      {/* Professional Content Layout */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex-1 flex items-center gap-6">
                          {/* Lesson Number Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-green-500/30 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500"
                                 style={{
                                   background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.4))',
                                   boxShadow: '0 12px 30px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                 }}>
                              <span className="text-emerald-200 font-black text-xl">{lesson.order}</span>
                            </div>
                          </div>

                          {/* Lesson Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 truncate">
                              {lesson.title}
                            </h4>

                            {/* Status and Metadata */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className={`flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg transition-all duration-300 ${statusConfig.bgClass} ${statusConfig.textClass} border ${statusConfig.borderClass}`}
                                   style={{
                                     background: lesson.status === 'COMPLETED' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.35))' :
                                               lesson.status === 'GENERATING' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.35))' :
                                               lesson.status === 'PENDING' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35))' :
                                               'linear-gradient(135deg, rgba(71, 85, 105, 0.25), rgba(51, 65, 85, 0.35))',
                                     border: lesson.status === 'COMPLETED' ? '1px solid rgba(34, 197, 94, 0.5)' :
                                            lesson.status === 'GENERATING' ? '1px solid rgba(59, 130, 246, 0.5)' :
                                            lesson.status === 'PENDING' ? '1px solid rgba(245, 158, 11, 0.5)' :
                                            '1px solid rgba(71, 85, 105, 0.5)',
                                     boxShadow: lesson.status === 'COMPLETED' ? '0 6px 15px rgba(34, 197, 94, 0.3)' :
                                              lesson.status === 'GENERATING' ? '0 6px 15px rgba(59, 130, 246, 0.3)' :
                                              lesson.status === 'PENDING' ? '0 6px 15px rgba(245, 158, 11, 0.3)' :
                                              '0 6px 15px rgba(71, 85, 105, 0.3)'
                                   }}>
                                {React.createElement(statusConfig.icon, {
                                  className: `w-4 h-4 mr-2 ${lesson.status === 'GENERATING' ? 'animate-spin' : ''}`
                                })}
                                {statusConfig.label}
                              </div>

                              {lesson.content.length > 0 && (
                                <div className="flex items-center px-3 py-1.5 bg-slate-700/60 text-slate-300 text-xs font-medium rounded-xl border border-slate-600/50 shadow-md">
                                  <FileText className="w-3 h-3 mr-1.5" />
                                  {lesson.content.length} version{lesson.content.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 ml-6">
                          <Button
                            onClick={() => generateLessonContent(lesson.id, selectedVersion)}
                            disabled={isGenerating}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 mx-1 my-1 ${
                              lesson.status === 'COMPLETED'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl hover:shadow-amber-500/30'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-blue-500/30'
                            } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{
                              boxShadow: lesson.status === 'COMPLETED'
                                ? '0 10px 25px rgba(245, 158, 11, 0.3)'
                                : '0 10px 25px rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            {isGenerating ? (
                              <>
                                <Zap className="w-4 h-4 mr-2 animate-spin" />
                                <span className="hidden sm:inline">Génération...</span>
                              </>
                            ) : lesson.status === 'COMPLETED' ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Régénérer</span>
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Générer</span>
                              </>
                            )}
                          </Button>

                          {lesson.status === 'COMPLETED' && (
                            <Button
                              onClick={() => window.location.href = `/lessons/${lesson.id}`}
                              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-xl hover:shadow-slate-600/30 transition-all duration-300 hover:scale-105 mx-1 my-1"
                              style={{
                                boxShadow: '0 10px 25px rgba(71, 85, 105, 0.3)'
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Voir</span>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Professional Progress Indicator */}
                      {isGenerating && (
                        <div className="mt-6 pt-5 border-t border-slate-600/50 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-slate-700/70 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full animate-pulse shadow-lg"
                                   style={{ width: "100%" }} />
                            </div>
                            <div className="flex items-center text-sm text-slate-300 font-medium">
                              <Zap className="w-4 h-4 mr-2 text-blue-400 animate-pulse" />
                              Génération en cours...
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtle Bottom Accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-blue-500/30 rounded-bl-2xl rounded-br-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
