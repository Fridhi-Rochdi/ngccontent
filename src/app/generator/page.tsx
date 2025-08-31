'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Download,
  AlertCircle,
  CheckCircle,
  Brain,
  Zap,
  Copy,
  Play,
  Trash2,
  Lightbulb,
  Code,
  Rocket,
  Crown
} from 'lucide-react';
import { generateSkillPathContent, validateSkillPathText } from '@/lib/simpleGenerator';
import { SkillPath } from '@/types/skillPath';

export default function GeneratorPage() {
  const { user, isLoaded } = useUser();
  const [skillPathText, setSkillPathText] = useState('');
  const [skillPathName, setSkillPathName] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<'basic' | 'intermediate' | 'creative'>('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generatedSkillPath, setGeneratedSkillPath] = useState<SkillPath | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [generationResult, setGenerationResult] = useState<string>('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSkillPathText(text);
    
    // Validation en temps réel
    if (text.trim()) {
      const validation = validateSkillPathText(text);
      setValidationErrors(validation.errors);
    } else {
      setValidationErrors([]);
    }
  };

  const handleGenerate = async () => {
    if (!user || !skillPathText.trim()) return;

    const validation = validateSkillPathText(skillPathText);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsGenerating(true);
    setValidationErrors([]);

    try {
      const result = await generateSkillPathContent({
        skillPathText,
        version: selectedVersion,
        userId: user.id
      });

      if (result.status === 'completed') {
        setGeneratedSkillPath(result.skillPath);
        setGenerationResult(`✅ Génération terminée ! ${result.message}`);
      } else {
        setGenerationResult(`❌ Erreur: ${result.message}`);
      }
    } catch (error) {
      setGenerationResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!user || !skillPathText.trim()) return;

    // Utiliser le nom personnalisé ou un nom par défaut
    const finalSkillPathName = skillPathName.trim() || `Skill Path - ${new Date().toLocaleDateString()}`;

    setIsGenerating(true);
    setValidationErrors([]);
    setGenerationProgress(0);
    setGenerationStep('Initialisation...');

    try {
      // Étape 1: Analyse du contenu
      setGenerationProgress(20);
      setGenerationStep('Analyse du contenu pédagogique...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Étape 2: Génération de la structure
      setGenerationProgress(40);
      setGenerationStep('Génération de la structure...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Étape 3: Création du skill path
      setGenerationProgress(60);
      setGenerationStep('Création du parcours d\'apprentissage...');

      // Créer un nouveau skill path avec l'IA
      const response = await fetch('/api/skillpaths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: finalSkillPathName,
          sommaire: skillPathText.trim(),
        }),
      });

      // Étape 4: Finalisation
      setGenerationProgress(80);
      setGenerationStep('Finalisation...');
      await new Promise(resolve => setTimeout(resolve, 300));

      if (response.ok) {
        setGenerationProgress(100);
        setGenerationStep('Terminé !');
        const newSkillPath = await response.json();
        setGenerationResult(`✅ Skill Path "${finalSkillPathName}" créé avec succès ! Redirection...`);
        
        // Rediriger vers le nouveau skill path après 2 secondes
        setTimeout(() => {
          window.location.href = `/skillpaths/${newSkillPath.id}`;
        }, 2000);
      } else {
        setGenerationResult(`❌ Erreur lors de la création du skill path`);
      }
    } catch (error) {
      setGenerationResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStep('');
      }, 3000);
    }
  };

  const handleCopyJson = () => {
    if (!generatedSkillPath) return;

    const jsonString = JSON.stringify(generatedSkillPath, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setGenerationResult('✅ JSON copié dans le presse-papier !');
    });
  };

  const exampleText = `Unité 1 : Introduction au développement web

Module 1.1 : Fondamentaux HTML
Objectifs : Maîtriser les bases du HTML5 et la structure d'une page web

Leçon 1 : Introduction au HTML
Concepts :
- Structure de base d'un document HTML
- Les balises principales
- NGC Video : Les bases du HTML5
- Scrimba : Créer votre première page web

Labo NGC : Création d'une page web simple
Quiz : Questions sur les balises HTML
Projet : Page d'accueil personnelle

Module 1.2 : Styling avec CSS
Objectifs : Apprendre à styliser les pages web avec CSS

Leçon 1 : Introduction au CSS
Concepts :
- Sélecteurs CSS
- Propriétés de base
- Scrimba : Votre premier style
- Article : Guide des couleurs en CSS

Labo NGC : Styliser votre page HTML
Quiz : Sélecteurs et propriétés CSS
Projet : Design d'une carte de visite`;

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="loading-spinner w-12 h-12"></div>
            <p className="text-slate-400 font-medium">Initialisation du générateur...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="glass-effect max-w-md w-full p-8 rounded-2xl text-center animate-slide-in-up">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold gradient-text mb-3">
                Accès Requis
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Connectez-vous pour accéder au générateur de skill paths IA et créer du contenu éducatif professionnel.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="btn-primary-xl w-full"
            >
              <Crown className="w-5 h-5 mr-2" />
              Se connecter
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
        {/* Particules animées en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-float animate-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400/25 rounded-full animate-float animate-delay-2000"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-emerald-400/35 rounded-full animate-float animate-delay-3000"></div>
          <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-violet-400/20 rounded-full animate-float animate-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-rose-400/30 rounded-full animate-float animate-delay-5000"></div>
        </div>

        {/* Hero Header Ultra-Professionnel */}
        {/* Hero Header Ultra-Professionnel */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-violet-600/10 to-transparent"></div>
          <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-24 sm:w-40 h-24 sm:h-40 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="text-center mb-8 sm:mb-12 animate-slide-in-from-top">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-semibold mb-4 sm:mb-6 shadow-lg animate-glow text-sm sm:text-base">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Générateur IA Premium
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
                <span className="gradient-text">Skill Path</span>
                <br />
                <span className="text-white">Generator</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                Transformez vos idées pédagogiques en parcours d'apprentissage structurés avec notre IA avancée. 
                Créez des contenus éducatifs professionnels en quelques clics.
              </p>
            </div>

            {/* Stats rapides */}
            <div className="mb-12 sm:mb-16" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="glass-effect p-4 sm:p-6 rounded-xl text-center animate-slide-in-left animate-delay-100" style={{ flex: '1', minWidth: '250px', maxWidth: '320px' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">IA Avancée</h3>
                <p className="text-slate-400 text-sm">Génération intelligente</p>
              </div>
              
              <div className="glass-effect p-4 sm:p-6 rounded-xl text-center animate-slide-in-up animate-delay-200" style={{ flex: '1', minWidth: '250px', maxWidth: '320px' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-success rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Rapide</h3>
                <p className="text-slate-400 text-sm">Résultats en secondes</p>
              </div>
              
              <div className="glass-effect p-4 sm:p-6 rounded-xl text-center animate-slide-in-right animate-delay-300" style={{ flex: '1', minWidth: '250px', maxWidth: '320px' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">JSON</h3>
                <p className="text-slate-400 text-sm">Export structuré</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interface principale */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          {/* Section Mode de Génération - En haut, séparée */}
          <div className="mb-6 sm:mb-8">
            <div className="relative overflow-hidden rounded-3xl p-8 animate-slide-in-up animate-delay-300" style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.25) 0%, transparent 50%),
                linear-gradient(135deg,
                  rgba(15, 23, 42, 0.95) 0%,
                  rgba(30, 41, 59, 0.9) 25%,
                  rgba(51, 65, 85, 0.85) 50%,
                  rgba(30, 41, 59, 0.9) 75%,
                  rgba(15, 23, 42, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(30px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                0 32px 64px -12px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05)
              `
            }}>
              {/* Animated mesh background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="absolute inset-0 w-full h-full animate-pulse" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="mesh-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="1.5" fill="rgba(255, 255, 255, 0.05)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
                </svg>
              </div>

              {/* Floating orbs with special colors */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-12 left-12 w-32 h-32 rounded-full animate-float" style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                  animation: 'float 6s ease-in-out infinite'
                }} />
                <div className="absolute top-20 right-20 w-24 h-24 rounded-full animate-float" style={{
                  background: 'radial-gradient(circle, rgba(34, 197, 94, 0.35) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 70%)',
                  filter: 'blur(15px)',
                  animation: 'float 8s ease-in-out infinite reverse'
                }} />
                <div className="absolute bottom-16 left-1/3 w-28 h-28 rounded-full animate-float" style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
                  filter: 'blur(18px)',
                  animation: 'float 7s ease-in-out infinite'
                }} />
                <div className="absolute bottom-8 right-12 w-20 h-20 rounded-full animate-float" style={{
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 70%)',
                  filter: 'blur(12px)',
                  animation: 'float 9s ease-in-out infinite reverse'
                }} />
              </div>

              <h2 className="relative text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center justify-center gap-3" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}>
                <div className="relative">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8" style={{
                    filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.5))',
                    background: 'linear-gradient(135deg, #ffd700, #ffed4e, #ffd700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }} />
                </div>
                Mode de Génération
              </h2>

              <div className="relative flex flex-row flex-wrap justify-between max-w-5xl mx-auto gap-4">
                {[
                  {
                    key: 'basic',
                    name: 'Essentiel',
                    duration: '~30s',
                    icon: FileText,
                    gradient: 'from-slate-900 via-cyan-900 to-blue-900',
                    accentGradient: 'from-cyan-500 via-blue-500 to-indigo-600',
                    bgColor: 'bg-slate-900/50',
                    borderColor: 'border-cyan-400/50',
                    iconBg: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600',
                    accentColor: 'cyan',
                    textColor: 'text-cyan-100',
                    description: 'Rapide & efficace',
                    features: ['Génération instantanée', 'Optimisation automatique'],
                    level: 'Débutant',
                    popularity: '95%',
                    premium: false,
                    specialBg: 'radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
                  },
                  {
                    key: 'intermediate',
                    name: 'Avancé',
                    duration: '~45s',
                    icon: Rocket,
                    gradient: 'from-slate-900 via-violet-900 to-purple-900',
                    accentGradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
                    bgColor: 'bg-slate-900/50',
                    borderColor: 'border-violet-400/50',
                    iconBg: 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600',
                    accentColor: 'violet',
                    textColor: 'text-violet-100',
                    description: 'Équilibré & détaillé',
                    features: ['Analyse détaillée', 'Exemples pratiques'],
                    level: 'Intermédiaire',
                    popularity: '87%',
                    premium: false,
                    specialBg: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)'
                  },
                  {
                    key: 'creative',
                    name: 'Expert',
                    duration: '~60s',
                    icon: Sparkles,
                    gradient: 'from-slate-900 via-rose-900 to-pink-900',
                    accentGradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
                    bgColor: 'bg-slate-900/50',
                    borderColor: 'border-rose-400/50',
                    iconBg: 'bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600',
                    accentColor: 'rose',
                    textColor: 'text-rose-100',
                    description: 'Créatif & innovant',
                    features: ['IA créative avancée', 'Contenu expert'],
                    level: 'Expert',
                    popularity: '78%',
                    premium: false,
                    specialBg: 'radial-gradient(circle at 25% 75%, rgba(244, 63, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)'
                  }
                ].map(({ key, name, duration, icon: Icon, gradient, accentGradient, bgColor, borderColor, iconBg, accentColor, textColor, description, features, level, popularity, specialBg }) => (
                  <div
                    key={key}
                    className={`
                      relative flex-1 min-w-0 max-w-xs p-4 rounded-2xl border cursor-pointer overflow-hidden
                      backdrop-blur-xl
                      ${selectedVersion === key
                        ? `shadow-2xl shadow-${accentColor}-500/40 ring-4 ring-${accentColor}-400/50 bg-opacity-90`
                        : 'bg-slate-900/20 border-slate-700/30 shadow-xl'
                      }
                    `}
                    onClick={() => setSelectedVersion(key as any)}
                    style={{
                      background: selectedVersion === key
                        ? key === 'basic'
                          ? `linear-gradient(135deg, rgba(6, 182, 212, 0.98) 0%, rgba(59, 130, 246, 0.95) 50%, rgba(14, 165, 233, 0.9) 100%)`
                          : key === 'intermediate'
                          ? `linear-gradient(135deg, rgba(139, 92, 246, 0.98) 0%, rgba(168, 85, 247, 0.95) 50%, rgba(196, 181, 253, 0.9) 100%)`
                          : `linear-gradient(135deg, rgba(244, 63, 94, 0.98) 0%, rgba(236, 72, 153, 0.95) 50%, rgba(251, 146, 60, 0.9) 100%)`
                        : `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)`
                    }}
                  >

                    {/* Professional selection indicator */}
                    {selectedVersion === key && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white/60" style={{
                        background: key === 'basic'
                          ? 'linear-gradient(135deg, #0891b2, #0284c7)'
                          : key === 'intermediate'
                          ? 'linear-gradient(135deg, #7c3aed, #9333ea)'
                          : 'linear-gradient(135deg, #dc2626, #db2777)',
                        boxShadow: key === 'basic'
                          ? '0 2px 12px rgba(8, 145, 178, 0.5), 0 1px 4px rgba(8, 145, 178, 0.3)'
                          : key === 'intermediate'
                          ? '0 2px 12px rgba(124, 58, 237, 0.5), 0 1px 4px rgba(124, 58, 237, 0.3)'
                          : '0 2px 12px rgba(220, 38, 38, 0.5), 0 1px 4px rgba(220, 38, 38, 0.3)'
                      }}>
                        <div className="w-2 h-2 bg-white rounded-full shadow-inner" style={{
                          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                        }} />
                      </div>
                    )}



                    {/* Inner glow ring */}
                    <div className={`absolute inset-2 rounded-2xl border ${selectedVersion === key ? `border-${accentColor}-400/60 shadow-inner shadow-${accentColor}-400/20` : 'border-transparent'}`} />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center shadow-lg
                          ${selectedVersion === key
                            ? `${iconBg} text-white shadow-${accentColor}-500/60`
                            : `${iconBg} text-white`
                          }
                          border border-white/15
                        `}>
                          <Icon className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`
                            text-xl font-bold
                            ${selectedVersion === key ? 'text-white drop-shadow-lg' : 'text-slate-100'}
                          `}>
                            {name}
                          </h3>
                          <p className={`
                            text-sm font-medium
                            ${selectedVersion === key ? `text-${accentColor}-300` : 'text-slate-400'}
                          `}>
                            {description}
                          </p>
                        </div>
                      </div>

                      {/* Features list */}
                      <ul className="space-y-2.5 mb-4">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className={`
                              w-2 h-2 rounded-full
                              ${selectedVersion === key ? `bg-${accentColor}-400 shadow-md shadow-${accentColor}-400/40` : 'bg-slate-500'}
                              shadow-sm
                            `} />
                            <span className={`
                              text-sm
                              ${selectedVersion === key ? 'text-slate-200 font-medium' : 'text-slate-400'}
                            `}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-600/40">
                        <div className="flex items-center gap-3">
                          <div className={`
                            px-3 py-1.5 rounded-lg text-xs font-semibold
                            ${selectedVersion === key
                              ? `bg-gradient-to-r ${accentGradient} text-white shadow-lg border border-white/20`
                              : 'bg-slate-800 text-slate-300'
                            }
                          `}>
                            {duration}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm" />
                            <span className="text-sm text-slate-300 font-medium">{popularity}</span>
                          </div>
                        </div>
                        <div className={`
                          text-xs font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wide
                          ${selectedVersion === key
                            ? `bg-${accentColor}-500/25 text-${accentColor}-100 shadow-lg border border-${accentColor}-400/40`
                            : 'bg-slate-800/80 text-slate-400'
                          }
                        `}>
                          {level}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Contenu Pédagogique et Résultat Structuré - Côte à côte */}
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
            
            {/* Panel de gauche - Contenu Pédagogique */}
            <div className="space-y-4 sm:space-y-6 animate-slide-in-left animate-delay-500" style={{ flex: '1', minWidth: '300px', maxWidth: '50%', height: 'auto' }}>

              {/* Input principal */}
              <div className="glass-effect p-5 sm:p-6 rounded-2xl" style={{ height: '720px', display: 'flex', flexDirection: 'column' }}>
                <div className="mb-6 pb-4 border-b border-slate-700/50">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 flex items-center gap-1">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    Contenu Pédagogique
                  </h2>
                </div>

                {/* Champ pour le nom du Skill Path */}
                <div className="mb-2">
                  <label htmlFor="skillPathName" className="block text-sm font-medium text-slate-300 mb-1">
                    Nom du Skill Path
                  </label>
                  <div className="relative">
                    <input
                      id="skillPathName"
                      type="text"
                      value={skillPathName}
                      onChange={(e) => setSkillPathName(e.target.value)}
                      placeholder="Ex: Développement Web Complet, Algorithmes Avancés..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-black placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="relative" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Description du parcours
                  </label>
                  <div className="relative" style={{ height: '320px' }}>
                    <textarea
                      value={skillPathText}
                      onChange={handleTextChange}
                      placeholder="Décrivez votre parcours d'apprentissage ici...

Exemple :
• Modules et objectifs d'apprentissage
• Leçons avec concepts clés
• Ressources et activités pratiques
• Évaluations et projets"
                      className="w-full h-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-black placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none font-mono text-sm leading-relaxed"
                      rows={20}
                    />
                  </div>
                  
                  {/* Compteur de caractères */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {skillPathText.length} caractères
                    </div>
                    
                    {/* Indicateur de statut */}
                    {skillPathText.trim() && (
                      <div className={`text-xs px-2 py-1 rounded ${
                        validationErrors.length === 0 
                          ? 'text-green-400 bg-green-500/10' 
                          : 'text-red-400 bg-red-500/10'
                      }`}>
                        {validationErrors.length === 0 ? 'Contenu valide' : `${validationErrors.length} erreur(s)`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Erreurs de validation */}
                {validationErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-red-400 font-medium mb-2">Corrections nécessaires :</h4>
                        <ul className="space-y-1 text-red-300 text-sm">
                          {validationErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions principales */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2" style={{ marginTop: '8px', display: 'flex', flexDirection: 'row', gap: '12px', flexShrink: 0 }}>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !skillPathText.trim() || validationErrors.length > 0}
                    className="flex-1 btn-primary-modern h-12 text-sm sm:text-base font-semibold"
                    style={{
                      flex: 1,
                      height: '48px',
                      backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: (isGenerating || !skillPathText.trim() || validationErrors.length > 0) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: (isGenerating || !skillPathText.trim() || validationErrors.length > 0) ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!(isGenerating || !skillPathText.trim() || validationErrors.length > 0)) {
                        (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                        (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                      (e.target as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 mr-2 border-2 border-white/30 border-t-white rounded-full"></div>
                        <span className="hidden sm:inline">Génération...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Parser
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setSkillPathText('')}
                    className="btn-secondary-modern h-12 px-4 sm:px-6 min-w-0"
                    disabled={!skillPathText.trim()}
                    style={{
                      height: '48px',
                      padding: '0 16px',
                      backgroundColor: '#475569',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: !skillPathText.trim() ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: !skillPathText.trim() ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (skillPathText.trim()) {
                        (e.target as HTMLElement).style.backgroundColor = '#64748b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#475569';
                    }}
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="ml-2 hidden sm:inline">Effacer</span>
                  </Button>
                  
                  <div className="relative group">
                    <Button
                      onClick={() => setSkillPathText(exampleText)}
                      className="btn-outline h-12 px-4 sm:px-6 text-primary-400 border-primary-500/30 hover:bg-primary-500/10 min-w-0 relative overflow-hidden"
                      style={{
                        height: '48px',
                        padding: '0 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        (e.target as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.5)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                        (e.target as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.3)';
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                        (e.target as HTMLElement).style.boxShadow = 'none';
                      }}
                    >
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
                      <span className="ml-2 hidden sm:inline">Exemple</span>
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </Button>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-slate-600 shadow-lg">
                      Charger un exemple complet
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </div>

                {/* Indicateur de progression */}
                {isGenerating && (
                  <div className="mt-6 glass-effect p-6 rounded-2xl animate-slide-in-up">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-6 h-6 text-white animate-spin" />
                        </div>
                        <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-md animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">Génération en cours...</h3>
                        <p className="text-slate-300 text-sm">{generationStep}</p>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${generationProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-slate-400">Progression</span>
                      <span className="text-sm font-medium text-white">{generationProgress}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel de droite - Résultat Structuré */}
            <div className="space-y-4 sm:space-y-6 animate-slide-in-right animate-delay-700" style={{ flex: '1', minWidth: '300px', maxWidth: '50%', height: 'auto' }}>
              {/* Résultat JSON */}
              <div className="glass-effect rounded-2xl" style={{ 
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                height: '720px'
              }}>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2" style={{
                  margin: '0 0 16px 0',
                  flexShrink: 0
                }}>
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  Résultat Structuré
                </h2>
                
                {/* Zone JSON avec hauteur calculée identique au textarea */}
                <div style={{ 
                  height: '420px',
                  marginBottom: '16px',
                  position: 'relative',
                  flex: '1'
                }}>
                  {generatedSkillPath ? (
                    <div style={{ height: '100%', position: 'relative' }}>
                      <pre 
                        className="custom-scrollbar"
                        style={{
                          height: '100%',
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          color: '#cbd5e1',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          lineHeight: '1.4',
                          margin: 0,
                          overflow: 'auto'
                        }}
                      >
                        {JSON.stringify(generatedSkillPath, null, 2)}
                      </pre>
                      <button
                        onClick={handleCopyJson}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '6px',
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(30, 41, 59, 0.8)'}
                        title="Copier le JSON"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      style={{
                        height: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          backgroundColor: 'rgba(30, 41, 59, 0.5)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px auto',
                          animation: 'pulse 2s infinite'
                        }}>
                          <Code className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                        </div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#cbd5e1',
                          marginBottom: '8px'
                        }}>En attente du parsing</h3>
                        <p style={{
                          color: '#64748b',
                          fontSize: '14px',
                          maxWidth: '280px',
                          margin: '0 auto',
                          padding: '0 16px'
                        }}>
                          Saisissez votre contenu pédagogique et lancez la génération pour voir apparaître le JSON structuré
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons en dehors de la zone JSON, à la suite */}
                {generatedSkillPath && (
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '12px',
                    flexShrink: 0
                  }}>
                    <Button
                      onClick={handleCopyJson}
                      className="btn-outline text-sm sm:text-base"
                      style={{
                        flex: 1,
                        height: '40px',
                        minHeight: '40px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        (e.target as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                        (e.target as HTMLElement).style.borderColor = 'rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span style={{ display: 'none' }} className="sm:inline">Copier JSON</span>
                      <span className="sm:hidden">Copier</span>
                    </Button>
                    
                    <div className="relative group">
                      <Button
                        onClick={handleGenerateWithAI}
                        disabled={isGenerating}
                        className="btn-primary-modern text-sm sm:text-base relative overflow-hidden"
                        style={{
                          flex: 1,
                          height: '40px',
                          minHeight: '40px',
                          background: isGenerating 
                            ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '12px',
                          cursor: isGenerating ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          opacity: isGenerating ? 0.7 : 1,
                          boxShadow: isGenerating 
                            ? 'none'
                            : '0 4px 15px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isGenerating) {
                            (e.target as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)';
                            (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isGenerating) {
                            (e.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
                            (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                          }
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 mr-2 border-2 border-white/30 border-t-white rounded-full"></div>
                            <span style={{ display: 'none' }} className="sm:inline">Création IA...</span>
                            <span className="sm:hidden">IA...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                            <span style={{ display: 'none' }} className="sm:inline">Générer avec IA</span>
                            <span className="sm:hidden">IA</span>
                          </>
                        )}
                        
                        {/* Glow effect */}
                        {!isGenerating && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                        )}
                      </Button>
                      
                      {/* Tooltip */}
                      {!isGenerating && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-slate-600 shadow-lg z-10">
                          Créer un parcours complet avec l'IA avancée
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guide d'utilisation - Amélioré et plus visuel */}
          <div className="mt-6 sm:mt-8">
            <div className="glass-effect p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-20 h-20 border border-primary-400 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border border-secondary-400 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-accent-400 rounded-full"></div>
              </div>
              
              <div className="relative">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <div className="relative">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400/20 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  Guide d'utilisation rapide
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="group p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        1
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm sm:text-base mb-1">Structurez votre contenu</h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Organisez votre contenu en Unités → Modules → Leçons avec objectifs clairs</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        2
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm sm:text-base mb-1">Choisissez votre mode</h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Sélectionnez le niveau de détail souhaité selon vos besoins</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        3
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm sm:text-base mb-1">Générez avec l'IA</h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Laissez l'IA créer automatiquement votre parcours d'apprentissage</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        4
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm sm:text-base mb-1">Publiez et partagez</h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Votre skill path est prêt à être utilisé et partagé</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Call to action */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-300 text-sm font-medium">Commencez dès maintenant !</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message de résultat */}
          {generationResult && (
            <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-3 sm:p-4 rounded-xl shadow-lg animate-slide-in-right max-w-xs sm:max-w-md ${
              generationResult.startsWith('✅') 
                ? 'bg-green-500/90 border border-green-400 text-white' 
                : 'bg-red-500/90 border border-red-400 text-white'
            } backdrop-blur-sm`}>
              <div className="flex items-start gap-2 sm:gap-3">
                {generationResult.startsWith('✅') ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="font-medium text-sm sm:text-base">{generationResult}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
