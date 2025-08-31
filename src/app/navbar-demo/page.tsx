'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DynamicButton, CreateButton } from '@/components/ui/DynamicButton';
import { useToast } from '@/contexts/ToastContext';
import { 
  Layout,
  Navigation,
  Search,
  Bell,
  User,
  Settings,
  Sparkles,
  Zap,
  Star,
  Target,
  Activity,
  TrendingUp,
  Users,
  BookOpen,
  Database,
  CheckCircle
} from 'lucide-react';

export default function NavbarDemoPage() {
  const toast = useToast();

  const features = [
    {
      icon: Navigation,
      title: 'Navigation Complète',
      description: 'Tous les éléments de la sidebar sont maintenant intégrés dans la navbar',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Search,
      title: 'Recherche Intégrée',
      description: 'Barre de recherche centrée pour trouver rapidement vos skill paths',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Actions Rapides',
      description: 'Menu déroulant avec les actions les plus utilisées',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Centre de notifications avec badge de comptage',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: User,
      title: 'Menu Utilisateur',
      description: 'Profil complet, paramètres et informations utilisateur',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Layout,
      title: 'Design Responsive',
      description: 'Interface adaptive qui s\'ajuste parfaitement sur tous les appareils',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const navigationItems = [
    { name: 'Accueil', icon: '🏠', description: 'Page d\'accueil principale' },
    { name: 'Dashboard', icon: '📊', description: 'Vue d\'ensemble de vos activités' },
    { name: 'Skill Paths', icon: '📚', description: 'Gérez vos parcours d\'apprentissage' },
    { name: 'Générateur', icon: '✨', description: 'Créez du contenu avec l\'IA' },
    { name: 'Demo DB', icon: '🔗', description: 'Démonstration des connexions base de données' },
    { name: 'Profil', icon: '👤', description: 'Paramètres de votre profil' },
    { name: 'Admin', icon: '🛡️', description: 'Panneau d\'administration (admin uniquement)' }
  ];

  const quickActions = [
    { name: 'Nouveau Skill Path', icon: '➕', primary: true },
    { name: 'Générer avec AI', icon: '⚡' },
    { name: 'Voir Dashboard', icon: '📊' }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="glass-effect rounded-3xl p-8 border border-white/10">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                🎉 Nouvelle Navbar Complète
              </h1>
              <p className="text-xl text-white/70 mb-6 max-w-3xl mx-auto leading-relaxed">
                Le site ne contient maintenant qu'une seule barre de navigation qui intègre tous les éléments 
                de l'ancienne sidebar. Navigation, recherche, actions rapides, notifications et menu utilisateur 
                - tout est accessible depuis la navbar !
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <CreateButton
                  onClick={() => toast.success('Test réussi !', 'La navbar fonctionne parfaitement avec les boutons dynamiques')}
                >
                  <Sparkles className="h-5 w-5" />
                  Tester les Boutons
                </CreateButton>
                
                <DynamicButton
                  variant="secondary"
                  onClick={() => toast.info('Navigation', 'Utilisez les liens de navigation dans la navbar ci-dessus')}
                >
                  <Navigation className="h-5 w-5" />
                  Tester Navigation
                </DynamicButton>
              </div>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${feature.color}/20 rounded-xl border border-white/20`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Guide d'utilisation */}
          <div className="glass-effect rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                <Target className="h-5 w-5 text-green-300" />
              </div>
              <h2 className="text-2xl font-bold text-white">Comment Utiliser la Nouvelle Navbar</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-400" />
                  Navigation Principale
                </h3>
                <div className="space-y-3">
                  {navigationItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-white/60">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Actions Rapides
                  </h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border ${
                        action.primary 
                          ? 'bg-purple-500/10 border-purple-400/30' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <span className="text-lg">{action.icon}</span>
                        <span className="text-white font-medium">{action.name}</span>
                        {action.primary && (
                          <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    Fonctionnalités
                  </h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Recherche en temps réel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Notifications avec badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Menu utilisateur complet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Design responsive mobile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Animations fluides</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="glass-effect rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                <Activity className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Instructions d'Utilisation</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="font-semibold text-white mb-2">🖱️ Navigation Desktop</div>
                <div className="text-white/70">
                  Utilisez les liens dans la navbar pour naviguer. La recherche est disponible au centre.
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="font-semibold text-white mb-2">📱 Navigation Mobile</div>
                <div className="text-white/70">
                  Tapez sur le menu hamburger (☰) pour accéder à toutes les options de navigation.
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="font-semibold text-white mb-2">⚡ Actions Rapides</div>
                <div className="text-white/70">
                  Cliquez sur "Créer" pour accéder aux actions les plus utilisées.
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-white mb-1">7</div>
              <div className="text-white/60 text-sm">Pages de Navigation</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-white mb-1">3</div>
              <div className="text-white/60 text-sm">Actions Rapides</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-white/60 text-sm">Responsive</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-white mb-1">✨</div>
              <div className="text-white/60 text-sm">Ultra Modern</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
