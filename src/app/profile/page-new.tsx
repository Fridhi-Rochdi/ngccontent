'use client';

import React, { useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Calendar,
  Trophy,
  BookOpen,
  Target,
  Clock,
  Settings,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface UserStats {
  totalSkillPaths: number;
  completedLessons: number;
  learningHours: number;
  achievements: number;
  streak: number;
  level: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Passionné de technologie et d\'apprentissage continu');
  const [tempBio, setTempBio] = useState(bio);

  const userStats: UserStats = {
    totalSkillPaths: 5,
    completedLessons: 128,
    learningHours: 147,
    achievements: 12,
    streak: 15,
    level: 'Senior Developer'
  };

  const achievements = [
    { id: 1, name: 'Premier Skill Path', description: 'Complétez votre premier parcours', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Série de 7 jours', description: 'Apprenez 7 jours consécutifs', earned: true, date: '2024-02-01' },
    { id: 3, name: '50 Leçons', description: 'Complétez 50 leçons', earned: true, date: '2024-02-10' },
    { id: 4, name: 'Mentor', description: 'Aidez 5 autres apprenants', earned: false, date: null },
    { id: 5, name: 'Expert', description: 'Maîtrisez 3 domaines techniques', earned: false, date: null },
    { id: 6, name: 'Marathon', description: 'Apprenez 100 heures au total', earned: true, date: '2024-02-20' }
  ];

  const handleSaveBio = () => {
    setBio(tempBio);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempBio(bio);
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-48 bg-slate-700 rounded"></div>
              <div className="h-48 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-slate-400">
            Gérez vos informations et suivez votre progression
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="card">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-24 h-24",
                      }
                    }}
                  />
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-slate-400 mb-2">{userStats.level}</p>
                
                {/* Bio Section */}
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white text-sm resize-none"
                        rows={3}
                        placeholder="Parlez-nous de vous..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveBio} className="btn-primary flex-1">
                          <Save className="h-4 w-4 mr-1" />
                          Sauvegarder
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1">
                          <X className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-300 text-sm">{bio}</p>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center text-sm text-slate-400">
                    <Mail className="h-4 w-4 mr-3" />
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="h-4 w-4 mr-3" />
                    Membre depuis {new Date(user?.createdAt || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Statistics */}
            <Card className="card">
              <h3 className="text-lg font-semibold text-white mb-6">Statistiques d'apprentissage</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userStats.totalSkillPaths}</div>
                  <div className="text-sm text-slate-400">Skill Paths</div>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userStats.completedLessons}</div>
                  <div className="text-sm text-slate-400">Leçons complétées</div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userStats.learningHours}</div>
                  <div className="text-sm text-slate-400">Heures d'apprentissage</div>
                </div>
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userStats.achievements}</div>
                  <div className="text-sm text-slate-400">Succès obtenus</div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <div className="h-8 w-8 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-sm">🔥</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{userStats.streak}</div>
                  <div className="text-sm text-slate-400">Jours de série</div>
                </div>
                <div className="text-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">★</span>
                  </div>
                  <div className="text-sm font-medium text-white">Senior</div>
                  <div className="text-sm text-slate-400">Niveau actuel</div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="card">
              <h3 className="text-lg font-semibold text-white mb-6">Succès & Réalisations</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border transition-colors ${
                      achievement.earned 
                        ? 'bg-purple-500/10 border-purple-500/30' 
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-slate-600 text-slate-400'
                      }`}>
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${
                          achievement.earned ? 'text-white' : 'text-slate-400'
                        }`}>
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-purple-400 mt-2">
                            Obtenu le {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Progress Overview */}
            <Card className="card">
              <h3 className="text-lg font-semibold text-white mb-6">Aperçu des Progrès</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Progression vers Expert</span>
                    <span className="text-slate-400">75%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-3 mt-6">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">JavaScript</div>
                    <div className="text-sm text-green-400">Maîtrisé</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">React</div>
                    <div className="text-sm text-blue-400">Avancé</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">Node.js</div>
                    <div className="text-sm text-yellow-400">Intermédiaire</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
