'use client';

import React, { useEffect, useState } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Brain, 
  ArrowRight, 
  Zap, 
  Target, 
  Users, 
  BookOpen,
  TrendingUp,
  Rocket,
  Award,
  CheckCircle,
  Play,
  Sparkles,
  Globe,
  Shield,
  Code,
  Database,
  Cloud,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';

// Composant CardContent simple
function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number;
    top: number;
    left: number;
    animationDelay: number;
    transform: string;
    innerAnimationDuration: number;
    innerAnimationDelay: number;
    colorClass: string;
  }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialiser les particules côté client seulement
  useEffect(() => {
    const particleData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10,
      transform: `scale(${0.5 + Math.random() * 0.5})`,
      innerAnimationDuration: 3 + Math.random() * 4,
      innerAnimationDelay: Math.random() * 2,
      colorClass: i % 3 === 0 ? 'bg-violet-400' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-indigo-400'
    }));
    setParticles(particleData);
  }, []);

  if (isSignedIn) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-dark">
          {/* Hero Section for Authenticated Users */}
          <div className="relative overflow-hidden min-h-screen flex items-center">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-900 to-indigo-900/20"></div>
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-cyan-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 text-center">
              <div className="animate-slide-in-up">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-4 glass-effect px-6 py-3 rounded-full mb-8">
                    <Brain className="w-8 h-8 text-violet-400 animate-pulse" />
                    <span className="text-white font-medium">Bienvenue sur votre plateforme d'apprentissage</span>
                  </div>
                </div>
                
                <h1 className="text-6xl font-bold mb-6">
                  <span className="gradient-text">Bienvenue,</span>
                  <br />
                  <span className="text-white">{user?.firstName}!</span>
                </h1>
                
                <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Votre parcours d'apprentissage personnalisé vous attend. 
                  Explorez, créez et maîtrisez de nouvelles compétences avec l'IA.
                </p>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <Link href="/dashboard">
                    <div className="glass-effect p-8 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                      <div className="p-4 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-full mb-6 mx-auto w-fit">
                        <Target className="w-12 h-12 text-violet-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Dashboard</h3>
                      <p className="text-slate-400">Suivez vos progrès et gérez vos parcours d'apprentissage</p>
                    </div>
                  </Link>

                  <Link href="/generator">
                    <div className="glass-effect p-8 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                      <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full mb-6 mx-auto w-fit">
                        <Zap className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Générateur IA</h3>
                      <p className="text-slate-400">Créez des parcours personnalisés avec l'intelligence artificielle</p>
                    </div>
                  </Link>

                  <Link href="/skillpaths">
                    <div className="glass-effect p-8 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                      <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full mb-6 mx-auto w-fit">
                        <BookOpen className="w-12 h-12 text-amber-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Skill Paths</h3>
                      <p className="text-slate-400">Explorez tous vos parcours de formation disponibles</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark overflow-hidden">
      {/* Navigation Ultra-Moderne */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="w-10 h-10 text-violet-400 animate-pulse" />
                <div className="absolute inset-0 w-10 h-10 bg-violet-400/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">Athena</span>
                <div className="text-xs text-slate-400">AI Learning Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <Button className="glass-effect border-0 text-white hover:bg-white/10 transition-all duration-300">
                  Connexion
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="btn-primary-modern">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Commencer
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Ultra-Professionnel */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Animé */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-900 to-indigo-900/20"></div>
          
          {/* Particules Flottantes */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute opacity-30"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.animationDelay}s`,
                transform: particle.transform,
              }}
            >
              <div 
                className={`w-2 h-2 rounded-full animate-float ${particle.colorClass}`}
                style={{
                  animationDuration: `${particle.innerAnimationDuration}s`,
                  animationDelay: `${particle.innerAnimationDelay}s`
                }}
              />
            </div>
          ))}

          {/* Éléments de fond géométriques */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-128 h-128 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <div className="animate-slide-in-up">
            {/* Badge Premium */}
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-8 animate-slide-in-down">
              <Rocket className="w-5 h-5 text-violet-400" />
              <span className="text-white font-medium">Powered by Azure OpenAI</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-10 leading-tight tracking-tight">
              <span className="gradient-text animate-gradient-shift bg-gradient-to-r from-violet-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                L'Avenir
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">
                de l'Apprentissage
              </span>
              <br />
              <span className="gradient-text animate-gradient-shift animation-delay-500 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                est Ici
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-300 mb-16 max-w-5xl mx-auto leading-relaxed animate-slide-in-up animation-delay-200 drop-shadow-lg">
              🚀 Transformez votre carrière avec des parcours d'apprentissage 
              <span className="gradient-text font-semibold">intelligents</span>, 
              générés par l'IA et conçus pour les 
              <span className="text-white font-semibold">professionnels exigeants</span>.
            </p>

            {/* CTA Buttons Premium */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <SignUpButton mode="modal">
                <Button size="lg" className="btn-primary-modern text-lg px-10 py-4 animate-scale-in hover:scale-110 transition-all duration-300">
                  <Play className="w-6 h-6 mr-3" />
                  Démarrer l'Expérience
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" className="glass-effect border-2 border-white/20 text-white hover:bg-white/10 text-lg px-10 py-4 animate-scale-in animation-delay-200">
                  <Shield className="w-5 h-5 mr-2" />
                  Accès Membre
                </Button>
              </SignInButton>
            </div>

            {/* Stats Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Users, number: "10K+", label: "Professionnels Formés", color: "from-violet-500 to-purple-500" },
                { icon: Award, number: "500+", label: "Parcours Experts", color: "from-cyan-500 to-blue-500" },
                { icon: TrendingUp, number: "95%", label: "Taux de Réussite", color: "from-emerald-500 to-green-500" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-effect p-8 rounded-2xl hover:scale-105 transition-all duration-300 animate-slide-in-up group"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className={`p-4 bg-gradient-to-r ${stat.color} bg-opacity-20 rounded-full mb-6 mx-auto w-fit group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 gradient-text">{stat.number}</div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités Ultra-Moderne */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800/50"></div>
        
        {/* Section Démonstration Interactive */}
        <div className="relative max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16 animate-slide-in-up">
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-8">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Démonstration Interactive</span>
            </div>
            <h2 className="text-5xl font-bold mb-8">
              <span className="gradient-text">Voyez l'IA</span>
              <br />
              <span className="text-white">en Action</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez comment notre IA transforme un simple concept en parcours d'apprentissage complet
            </p>
          </div>

          {/* Démonstration Interactive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Input de démonstration */}
            <div className="glass-effect p-8 rounded-3xl animate-slide-in-left">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-violet-400" />
                Concept Initial
              </h3>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/30">
                <p className="text-slate-300 leading-relaxed">
                  "Créer un parcours complet sur le développement web moderne, 
                  incluant React, Next.js, TypeScript et les meilleures pratiques"
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-3">
                <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
                <span className="text-violet-400 font-medium">Traitement par IA...</span>
              </div>
            </div>

            {/* Output de démonstration */}
            <div className="glass-effect p-8 rounded-3xl animate-slide-in-right">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                Résultat Généré
              </h3>
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">12 Leçons Structurées</span>
                  </div>
                  <p className="text-slate-300 text-sm">Du HTML/CSS aux APIs avancées</p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Exercices Pratiques</span>
                  </div>
                  <p className="text-slate-300 text-sm">Projets réels avec solutions</p>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-medium">Évaluations</span>
                  </div>
                  <p className="text-slate-300 text-sm">Quiz et challenges adaptés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          
          {/* En-tête Section */}
          <div className="text-center mb-20 animate-slide-in-up">
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-8">
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">Fonctionnalités Avancées</span>
            </div>
            <h2 className="text-5xl font-bold mb-8">
              <span className="gradient-text">Technologie</span>
              <br />
              <span className="text-white">de Pointe</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Une plateforme d'apprentissage révolutionnaire conçue pour les professionnels 
              qui exigent l'excellence et l'innovation.
            </p>
          </div>

          {/* Grille de Fonctionnalités Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Intelligence Artificielle Avancée",
                description: "Algorithmes d'apprentissage automatique pour personnaliser votre parcours en temps réel selon vos compétences et objectifs.",
                gradient: "from-violet-500 to-purple-600",
                delay: "0.1s"
              },
              {
                icon: Target,
                title: "Contenu Expert-Level",
                description: "Plongez dans des architectures avancées, la conception de systèmes et les technologies de pointe utilisées par les entreprises leaders.",
                gradient: "from-blue-500 to-cyan-600",
                delay: "0.2s"
              },
              {
                icon: Users,
                title: "Communauté Premium",
                description: "Connectez-vous avec des ingénieurs expérimentés, partagez des insights et collaborez sur des projets avancés.",
                gradient: "from-emerald-500 to-green-600",
                delay: "0.3s"
              },
              {
                icon: Zap,
                title: "Apprentissage Adaptatif",
                description: "Parcours dynamiques qui évoluent selon vos progrès, les changements industriels et les nouvelles technologies.",
                gradient: "from-amber-500 to-orange-600",
                delay: "0.4s"
              },
              {
                icon: Award,
                title: "Reconnaissance Industrielle",
                description: "Obtenez des certifications reconnues par les entreprises tech leaders et validez votre expertise avancée.",
                gradient: "from-pink-500 to-red-600",
                delay: "0.5s"
              },
              {
                icon: TrendingUp,
                title: "Accélération Carrière",
                description: "Parcours stratégiques conçus pour accélérer votre progression vers des rôles de leadership technique.",
                gradient: "from-indigo-500 to-purple-600",
                delay: "0.6s"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group glass-effect p-8 rounded-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-slide-in-up border border-white/10 hover:border-white/20"
                style={{ animationDelay: feature.delay }}
              >
                {/* Icône avec effet hover */}
                <div className="relative mb-8">
                  <div className={`p-4 bg-gradient-to-r ${feature.gradient} bg-opacity-20 rounded-xl w-fit group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute inset-0 p-4 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-xl blur-xl transition-all duration-300`}></div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de Technologies */}
          <div className="mt-20 text-center animate-slide-in-up animation-delay-700">
            <h3 className="text-2xl font-bold text-white mb-8">Technologies Supportées</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[
                { icon: Code, label: "React/Next.js" },
                { icon: Database, label: "PostgreSQL" },
                { icon: Cloud, label: "Azure AI" },
                { icon: Globe, label: "Web Technologies" },
                { icon: Shield, label: "Security" },
                { icon: Zap, label: "Performance" }
              ].map((tech, index) => (
                <div key={index} className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full hover:opacity-100 transition-opacity duration-300">
                  <tech.icon className="w-5 h-5 text-violet-400" />
                  <span className="text-white text-sm font-medium">{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Ultra-Premium */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-indigo-900/30 to-purple-900/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="animate-slide-in-up">
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-8">
              <Rocket className="w-5 h-5 text-violet-400" />
              <span className="text-white font-medium">Rejoignez l'Élite</span>
            </div>
            
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-white">Prêt à</span>
              <br />
              <span className="gradient-text animate-gradient-shift">Révolutionner</span>
              <br />
              <span className="text-white">Votre Carrière ?</span>
            </h2>
            
            <p className="text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Rejoignez des milliers de professionnels qui transforment leur avenir 
              avec l'apprentissage intelligent par IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <SignUpButton mode="modal">
                <Button size="lg" className="btn-primary-modern text-xl px-12 py-6 animate-scale-in hover:scale-110 transition-all duration-300 shadow-2xl">
                  <Play className="w-6 h-6 mr-3" />
                  Commencer Maintenant
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </SignUpButton>
              <div className="flex items-center gap-4 text-slate-400">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-medium">Accès instantané • Pas de carte requise</span>
              </div>
            </div>

            {/* Témoignages/Social Proof */}
            <div className="glass-effect p-8 rounded-2xl max-w-4xl mx-auto animate-slide-in-up animation-delay-300">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="flex -space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full border-2 border-white/20"></div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">10,000+</div>
                  <div className="text-slate-400">Professionnels nous font confiance</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
                <span className="text-white font-bold ml-2">4.9/5</span>
                <span className="text-slate-400 ml-2">• 2,500+ avis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-slide-in-up">
            <div className="inline-flex items-center gap-2 glass-effect px-6 py-3 rounded-full mb-8">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Témoignages</span>
            </div>
            <h2 className="text-5xl font-bold mb-8">
              <span className="gradient-text">Ils nous font</span>
              <br />
              <span className="text-white">confiance</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez ce que disent nos utilisateurs après avoir utilisé notre plateforme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Témoignage 1 */}
            <div className="glass-effect p-8 rounded-3xl animate-slide-in-left">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "L'IA a généré un parcours complet sur React en quelques minutes. 
                La qualité du contenu est impressionnante et les exercices sont vraiment pertinents."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SM</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Sarah Martin</p>
                  <p className="text-slate-400 text-sm">Développeuse Frontend</p>
                </div>
              </div>
            </div>

            {/* Témoignage 2 */}
            <div className="glass-effect p-8 rounded-3xl animate-slide-in-up">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "Parfait pour créer des formations personnalisées. J'ai pu adapter 
                le contenu à mes besoins spécifiques et les résultats sont excellents."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JL</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Jean-Luc Dubois</p>
                  <p className="text-slate-400 text-sm">Formateur Professionnel</p>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="glass-effect p-8 rounded-3xl animate-slide-in-right">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                "L'interface est intuitive et les parcours générés sont d'une 
                qualité professionnelle. Un gain de temps considérable !"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MC</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Marie Curie</p>
                  <p className="text-slate-400 text-sm">Chef de Projet Éducation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Ultra-Moderne */}
      <footer className="py-16 bg-slate-900/80 border-t border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-8 md:mb-0">
              <div className="relative">
                <Brain className="w-8 h-8 text-violet-400" />
                <div className="absolute inset-0 w-8 h-8 bg-violet-400/20 rounded-full blur-md"></div>
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">Athena</span>
                <div className="text-sm text-slate-500">© 2025 • Tous droits réservés</div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-slate-300 font-medium mb-2">
                Révolutionnez l'apprentissage professionnel
              </div>
              <div className="text-slate-500 text-sm">
                Propulsé par l'intelligence artificielle Azure OpenAI
              </div>
            </div>
          </div>
          
          {/* Barre de progression scrolling */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="w-full bg-slate-800 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: typeof window !== 'undefined' && document ? 
                    `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` :
                    '0%'
                }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}