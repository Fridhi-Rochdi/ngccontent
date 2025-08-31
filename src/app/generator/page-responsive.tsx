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
  const [selectedVersion, setSelectedVersion] = useState<'basic' | 'intermediate' | 'creative'>('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generatedSkillPath, setGeneratedSkillPath] = useState<SkillPath | null>(null);
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
    if (!skillPathText.trim()) return;

    setIsGenerating(true);
    setValidationErrors([]);
    setGeneratedSkillPath(null);
    setGenerationResult('');

    try {
      const result = await generateSkillPathContent({
        skillPathText,
        version: selectedVersion,
        userId: user?.id || 'anonymous'
      });
      
      if (result.status === 'error') {
        setValidationErrors([result.message || 'Erreur lors de la génération']);
      } else {
        setGeneratedSkillPath(result.skillPath);
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setValidationErrors(['Erreur lors de la génération. Veuillez réessayer.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!user || !skillPathText.trim()) return;

    setIsGenerating(true);
    setValidationErrors([]);

    try {
      // Créer un nouveau skill path avec l'IA
      const response = await fetch('/api/skillpaths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Skill Path - ${new Date().toLocaleDateString()}`,
          sommaire: skillPathText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du skill path');
      }

      const skillPath = await response.json();
      setGeneratedSkillPath(skillPath);
    } catch (error) {
      console.error('Erreur:', error);
      setValidationErrors(['Erreur lors de la création du skill path']);
    } finally {
      setIsGenerating(false);
    }
  };

  const exampleContent = `Module 1: Introduction aux bases du CSS
Objectif: Comprendre les fondamentaux du CSS et sa syntaxe

Leçon 1.1: Qu'est-ce que le CSS ?
- Définition et rôle du CSS
- Différence entre CSS et HTML
- Avantages du CSS

Leçon 1.2: Syntaxe de base
- Sélecteurs
- Propriétés et valeurs
- Commentaires en CSS

Resources:
- MDN Web Docs : Introduction au CSS
- W3Schools : Tutorial CSS
- Video : Les bases du CSS expliquées simplement

Module 2: Sélecteurs et propriétés de base
Objectif: Maîtriser les sélecteurs CSS essentiels

Leçon 2.1: Types de sélecteurs
- Sélecteur d'élément
- Sélecteur de classe
- Sélecteur d'ID

Leçon 2.2: Propriétés de texte et couleurs
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
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="glass-effect max-w-md w-full p-6 sm:p-8 rounded-2xl text-center animate-slide-in-up">
            <div className="mb-6">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-3">
                Accès Requis
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Connectez-vous pour accéder au générateur de skill paths IA et créer du contenu éducatif professionnel.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="btn-primary-xl w-full"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Se connecter
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-dark">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              <div className="glass-effect p-4 sm:p-6 rounded-xl text-center animate-slide-in-left animate-delay-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">IA Avancée</h3>
                <p className="text-slate-400 text-sm">Génération intelligente</p>
              </div>
              
              <div className="glass-effect p-4 sm:p-6 rounded-xl text-center animate-slide-in-up animate-delay-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-success rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Rapide</h3>
                <p className="text-slate-400 text-sm">Résultats en secondes</p>
              </div>
              
              <div className="glass-effect p-4 sm:p-6 rounded-xl text-center animate-slide-in-right animate-delay-300">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Panel de gauche - Input Ultra-Moderne */}
            <div className="space-y-4 sm:space-y-6 animate-slide-in-left animate-delay-500">
              {/* Version Selector Premium */}
              <div className="glass-effect p-4 sm:p-6 rounded-2xl">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  Mode de Génération
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { key: 'basic', name: 'Essentiel', duration: '~30s', icon: FileText },
                    { key: 'intermediate', name: 'Avancé', duration: '~45s', icon: Rocket },
                    { key: 'creative', name: 'Expert', duration: '~60s', icon: Sparkles }
                  ].map(({ key, name, duration, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedVersion(key as any)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedVersion === key
                          ? 'bg-gradient-primary border-primary-500 text-white shadow-lg scale-105'
                          : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                      <div className="text-xs sm:text-sm font-semibold">{name}</div>
                      <div className="text-xs opacity-75">{duration}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input principal */}
              <div className="glass-effect p-4 sm:p-6 rounded-2xl">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  Contenu Pédagogique
                </h2>
                
                <div className="relative">
                  <textarea
                    value={skillPathText}
                    onChange={handleTextChange}
                    placeholder="Décrivez votre parcours d'apprentissage ici... 

Exemple :
- Modules et objectifs d'apprentissage
- Leçons avec concepts clés
- Ressources et activités pratiques
- Évaluations et projets"
                    className="w-full h-60 sm:h-80 bg-white border-2 border-slate-300 rounded-xl p-3 sm:p-4 text-black font-mono text-sm leading-relaxed resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 shadow-lg placeholder-slate-500"
                    rows={20}
                  />
                  
                  {/* Compteur de caractères */}
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs text-slate-600 bg-slate-100 border border-slate-300 px-2 py-1 rounded shadow-sm">
                    {skillPathText.length} caractères
                  </div>
                </div>

                {/* Erreurs de validation */}
                {validationErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-slide-in-up">
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !skillPathText.trim() || validationErrors.length > 0}
                    className="flex-1 btn-primary-modern h-12 text-sm sm:text-base font-semibold"
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
                        <span className="hidden sm:inline">Générer le Skill Path</span>
                        <span className="sm:hidden">Générer</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setSkillPathText(exampleContent)}
                    className="btn-secondary h-12 px-4 sm:px-6 font-semibold text-sm sm:text-base"
                  >
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Exemple</span>
                    <span className="sm:hidden">Ex.</span>
                  </Button>
                </div>

                {/* Bouton d'effacement */}
                {skillPathText.trim() && (
                  <div className="mt-3 sm:mt-4">
                    <Button
                      onClick={() => setSkillPathText('')}
                      variant="outline"
                      className="w-full h-10 text-slate-400 border-slate-600 hover:bg-slate-700/50 hover:text-red-400 hover:border-red-500/50 transition-all duration-200 text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Effacer le contenu
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Panel de droite - Résultats Responsive */}
            <div className="space-y-4 sm:space-y-6 animate-slide-in-right animate-delay-700">
              
              {/* Résultat généré */}
              {generatedSkillPath && (
                <div className="glass-effect p-4 sm:p-6 rounded-2xl animate-slide-in-up">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      Skill Path Généré
                    </h2>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedSkillPath, null, 2))}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Copier
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(generatedSkillPath, null, 2)], {
                            type: 'application/json'
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `skillpath-${Date.now()}.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        JSON
                      </Button>
                    </div>
                  </div>
                  
                  {/* Aperçu du contenu */}
                  <div className="bg-slate-900/60 rounded-xl p-3 sm:p-4 border border-slate-600">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-slate-400">Unités:</span>
                        <div className="text-white font-medium">{generatedSkillPath.units.length}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <div className="text-primary-400 font-medium">Généré</div>
                      </div>
                    </div>
                    
                    {generatedSkillPath.units && generatedSkillPath.units.length > 0 && (
                      <div>
                        <span className="text-slate-400 text-sm">Première unité: {generatedSkillPath.units[0].name}</span>
                        <div className="mt-2 space-y-2">
                          {generatedSkillPath.units[0].modules.slice(0, 3).map((module, index) => (
                            <div key={index} className="bg-slate-800/60 rounded-lg p-3">
                              <div className="text-white font-medium text-sm break-words">{module.name}</div>
                              <div className="text-slate-400 text-xs mt-1 break-words">{module.objective}</div>
                              <div className="text-slate-500 text-xs mt-1">
                                {module.lessons.length} leçon(s)
                              </div>
                            </div>
                          ))}
                          {generatedSkillPath.units[0].modules.length > 3 && (
                            <div className="text-slate-400 text-sm text-center py-2">
                              ... et {generatedSkillPath.units[0].modules.length - 3} autres modules
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Résultat de génération textuel */}
              {generationResult && !generatedSkillPath && (
                <div className="glass-effect p-4 sm:p-6 rounded-2xl animate-slide-in-up">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    Contenu Généré
                  </h2>
                  
                  <div className="bg-slate-900/60 rounded-xl p-3 sm:p-4 border border-slate-600">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                      <span className="text-slate-400 text-sm">Résultat brut:</span>
                      <Button
                        onClick={() => navigator.clipboard.writeText(generationResult)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs sm:text-sm"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Copier
                      </Button>
                    </div>
                    <pre className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-72 sm:max-h-96 overflow-y-auto">
                      {generationResult}
                    </pre>
                  </div>
                </div>
              )}

              {/* Conseils et astuces */}
              <div className="glass-effect p-4 sm:p-6 rounded-2xl">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  Conseils Pro
                </h2>
                
                <div className="space-y-3 text-slate-300 text-sm">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Structure claire:</strong> Organisez votre contenu en modules logiques avec des objectifs précis.
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Progression graduelle:</strong> Commencez par les concepts de base avant d'aborder les sujets complexes.
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Activités pratiques:</strong> Incluez des exercices et projets pour renforcer l'apprentissage.
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-white">Évaluations:</strong> Proposez des quiz et des tests pour mesurer les progrès.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
