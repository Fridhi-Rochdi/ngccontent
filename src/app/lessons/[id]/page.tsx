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
  Eye,
  Code,
  Lightbulb,
  CheckSquare,
  Trophy,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { LessonContent } from "@/types/skillPath";

interface Lesson {
  id: string;
  title: string;
  order: number;
  status: string;
  content: LessonContent[];
  skillPathId: string;
  skillPathName: string;
}

interface SkillPath {
  id: string;
  name: string;
  sommaire: any;
  status: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const { data: lesson, error, isLoading } = useSWR<Lesson>(
    lessonId ? `/api/lessons/${lessonId}` : null,
    fetcher
  );

  const { data: skillPath } = useSWR<SkillPath>(
    lesson?.skillPathId ? `/api/skillpaths/${lesson.skillPathId}` : null,
    fetcher
  );

  const [selectedVersion, setSelectedVersion] = useState<string>("basic");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["script"]));
  const [selectedContentIndex, setSelectedContentIndex] = useState<number>(0);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Mettre à jour la version sélectionnée quand les données changent
  useEffect(() => {
    if (lesson?.content && lesson.content.length > 0) {
      // Sélectionner la version marquée comme sélectionnée, sinon la première
      const selectedIndex = lesson.content.findIndex((content: any) => content.isSelected === true);
      setSelectedContentIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [lesson]);

  const selectedContent = lesson?.content?.[selectedContentIndex] as any;
  const availableVersions = lesson?.content || [];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          bgClass: 'bg-green-500/20 text-green-400 border-green-500/30',
          textClass: 'text-green-400',
          borderClass: 'border-green-500/30',
          icon: CheckCircle,
          label: 'Terminée'
        };
      case 'GENERATING':
        return {
          bgClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          textClass: 'text-blue-400',
          borderClass: 'border-blue-500/30',
          icon: Zap,
          label: 'Génération en cours'
        };
      default:
        return {
          bgClass: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          textClass: 'text-slate-400',
          borderClass: 'border-slate-500/30',
          icon: Clock,
          label: 'En attente'
        };
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Chargement de la leçon...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !lesson) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Leçon introuvable</h2>
            <p className="text-slate-400 mb-6">
              La leçon que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button
              onClick={() => window.location.href = '/skillpaths'}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux parcours
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-dark">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-slate-700/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-slate-600/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative max-w-7xl mx-auto px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <Button
                onClick={() => window.location.href = skillPath ? `/skillpaths/${skillPath.id}` : '/skillpaths'}
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
                Retour au parcours
              </Button>

              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${getStatusConfig(lesson.status).bgClass} ${getStatusConfig(lesson.status).textClass} border ${getStatusConfig(lesson.status).borderClass}`}
                     style={{
                       background: lesson.status === 'COMPLETED' ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))' :
                                 lesson.status === 'GENERATING' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))' :
                                 'linear-gradient(135deg, rgba(71, 85, 105, 0.2), rgba(51, 65, 85, 0.3))',
                       border: lesson.status === 'COMPLETED' ? '1px solid rgba(34, 197, 94, 0.4)' :
                              lesson.status === 'GENERATING' ? '1px solid rgba(59, 130, 246, 0.4)' :
                              '1px solid rgba(71, 85, 105, 0.4)',
                       boxShadow: lesson.status === 'COMPLETED' ? '0 4px 20px rgba(34, 197, 94, 0.3)' :
                                 lesson.status === 'GENERATING' ? '0 4px 20px rgba(59, 130, 246, 0.3)' :
                                 '0 4px 20px rgba(71, 85, 105, 0.3)'
                     }}>
                  {React.createElement(getStatusConfig(lesson.status).icon, {
                    className: `w-4 h-4 mr-2 ${lesson.status === 'GENERATING' ? 'animate-spin' : ''}`
                  })}
                  {getStatusConfig(lesson.status).label}
                </div>
              </div>
            </div>

            <div className="text-center max-w-4xl mx-auto mb-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-700/30 to-slate-600/30 px-6 py-3 rounded-full text-slate-300 font-semibold mb-6 backdrop-blur-sm border border-slate-500/30">
                <BookOpen className="w-5 h-5" />
                Leçon {lesson.order}
                <Brain className="w-5 h-5" />
              </div>

              <h1 className="text-3xl md:text-4xl font-black mb-4 animate-slide-in-down">
                <span className="gradient-text bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                  {lesson.title}
                </span>
              </h1>

              {skillPath && (
                <p className="text-lg text-slate-300 mb-6">
                  Parcours : <span className="font-semibold text-white">{skillPath.name}</span>
                </p>
              )}

              {/* Version Selector */}
              {availableVersions.length > 1 && (
                <div className="mb-8">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-slate-300 font-medium">Version :</span>
                    <div className="flex gap-2 flex-wrap">
                      {availableVersions.map((version, index) => (
                        <Button
                          key={index}
                          onClick={() => setSelectedContentIndex(index)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedContentIndex === index
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:bg-slate-600/50 hover:text-slate-300'
                          }`}
                        >
                          Version {index + 1}
                          {selectedContentIndex === index && (
                            <CheckCircle className="w-4 h-4 ml-2" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-400">
                    {availableVersions.length} version{availableVersions.length > 1 ? 's' : ''} disponible{availableVersions.length > 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          {/* Version Info */}
          {selectedContent && (
            <div className="mb-8">
              <Card className="glass-effect border-0"
                    style={{
                      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Version {selectedContentIndex + 1} sélectionnée
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Générée le {new Date(selectedContent.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>📝 Script: {selectedContent?.content?.lesson?.script?.length || 0} sections</span>
                      <span>•</span>
                      <span>🧠 Quiz: Non disponible</span>
                      <span>•</span>
                      <span>🎯 Projet: {selectedContent?.content?.lesson?.project ? 'Oui' : 'Non'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedContent ? (
            <div className="space-y-8">
              {/* JSON Content Display */}
              <Card className="glass-effect border-0"
                    style={{
                      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-lg">
                      <Code className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">Contenu JSON Brut - Version {selectedContentIndex + 1}</CardTitle>
                      <CardDescription className="text-slate-400">
                        Structure complète du contenu généré par l'IA - Version {selectedContentIndex + 1}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/50 rounded-lg border border-slate-600/30 p-6">
                    <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                      <code>{JSON.stringify(selectedContent.content, null, 2)}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Script Section */}
              {selectedContent?.content?.lesson?.script && selectedContent.content.lesson.script.length > 0 && (
                <Card className="glass-effect border-0"
                      style={{
                        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">Contenu de la Leçon</CardTitle>
                        <CardDescription className="text-slate-400">
                          Script narratif et exemples de code
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {selectedContent.content.lesson.script.map((section: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500/50 pl-6 py-4">
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            {section.segment}
                          </h3>
                          <p className="text-slate-300 leading-relaxed mb-4">{section.narration}</p>
                          {section.code && section.code.trim() && (
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                              <pre className="text-sm text-slate-300 overflow-x-auto">
                                <code>{section.code}</code>
                              </pre>
                            </div>
                          )}
                          {section.video_reference && (
                            <div className="mt-3 text-sm text-slate-400">
                              <Play className="w-4 h-4 inline mr-1" />
                              Référence vidéo: {section.video_reference}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lab Exercises Section */}
              {selectedContent?.content?.lesson?.lab_ngc && (
                <Card className="glass-effect border-0"
                      style={{
                        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-lg">
                        <Code className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">Exercices Pratiques</CardTitle>
                        <CardDescription className="text-slate-400">
                          Mise en pratique des concepts
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <div className="border border-slate-600/30 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <CheckSquare className="w-5 h-5 text-orange-400" />
                          {selectedContent.content.lesson.lab_ngc.title}
                        </h4>
                        <p className="text-slate-300 mb-4">{selectedContent.content.lesson.lab_ngc.instructions}</p>

                        <div className="mb-4">
                          <h5 className="text-md font-semibold text-white mb-3">Étapes :</h5>
                          <ol className="space-y-2">
                            {selectedContent.content.lesson.lab_ngc.steps?.map((step: string, stepIndex: number) => (
                              <li key={stepIndex} className="flex items-start gap-3 text-slate-300">
                                <span className="flex-shrink-0 w-6 h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-medium">
                                  {stepIndex + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {selectedContent.content.lesson.lab_ngc.starter_code && (
                          <div className="mb-4">
                            <h5 className="text-md font-semibold text-white mb-2">Code de départ :</h5>
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                              <pre className="text-sm text-slate-300 overflow-x-auto">
                                <code>{selectedContent.content.lesson.lab_ngc.starter_code}</code>
                              </pre>
                            </div>
                          </div>
                        )}

                        {selectedContent.content.lesson.lab_ngc.solution_code && (
                          <div>
                            <h5 className="text-md font-semibold text-white mb-2">Solution :</h5>
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                              <pre className="text-sm text-slate-300 overflow-x-auto">
                                <code>{selectedContent.content.lesson.lab_ngc.solution_code}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Section */}
              {selectedContent?.content?.lesson?.project && (
                <Card className="glass-effect border-0"
                      style={{
                        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg">
                        <Target className="w-5 h-5 text-green-300" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">Projet Pratique</CardTitle>
                        <CardDescription className="text-slate-400">
                          Appliquez vos connaissances
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{selectedContent.content.lesson.project.title}</h4>
                        <p className="text-slate-300 mb-4">{selectedContent.content.lesson.project.brief}</p>
                      </div>

                      <div>
                        <h5 className="text-md font-semibold text-white mb-3">Étapes :</h5>
                        <ol className="space-y-2">
                          {selectedContent.content.lesson.project.steps?.map((step: string, index: number) => (
                            <li key={index} className="flex items-start gap-3 text-slate-300">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {selectedContent.content.lesson.project.criteria && (
                        <div>
                          <h5 className="text-md font-semibold text-white mb-3">Critères d'Évaluation :</h5>
                          <ul className="space-y-2">
                            {selectedContent.content.lesson.project.criteria.map((criteria: string, index: number) => (
                              <li key={index} className="flex items-start gap-3 text-slate-300">
                                <Trophy className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedContent.content.lesson.project.sample_code && (
                        <div>
                          <h5 className="text-md font-semibold text-white mb-2">Exemple de code :</h5>
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                            <pre className="text-sm text-slate-300 overflow-x-auto">
                              <code>{selectedContent.content.lesson.project.sample_code}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {selectedContent.content.lesson.project.line_by_line_explanation && (
                        <div>
                          <h5 className="text-md font-semibold text-white mb-3">Explication ligne par ligne :</h5>
                          <div className="space-y-3">
                            {selectedContent.content.lesson.project.line_by_line_explanation.map((explanation: any, index: number) => (
                              <div key={index} className="border-l-4 border-blue-500/50 pl-4">
                                <code className="text-blue-300 font-mono text-sm">{explanation.line}</code>
                                <p className="text-slate-400 text-sm mt-1">{explanation.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Contenu non disponible</h3>
              <p className="text-slate-400">
                Le contenu de cette leçon n'a pas encore été généré.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
