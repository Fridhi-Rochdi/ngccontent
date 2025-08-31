'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { Search, BookOpen, Clock, User } from 'lucide-react';

// Données d'exemple pour la démonstration
const generateMockData = (count: number) => {
  const items = [];
  const categories = ['Développement Web', 'Data Science', 'Mobile', 'DevOps', 'IA/ML'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  
  for (let i = 1; i <= count; i++) {
    items.push({
      id: i,
      title: `Skill Path ${i}`,
      description: `Description du skill path ${i}. Apprenez les bases et les concepts avancés.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      hours: Math.floor(Math.random() * 40) + 10,
      lessons: Math.floor(Math.random() * 20) + 5,
      students: Math.floor(Math.random() * 500) + 50,
      rating: (Math.random() * 2 + 3).toFixed(1), // Entre 3.0 et 5.0
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
    });
  }
  return items;
};

export default function PaginationDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // Générer des données d'exemple (50 items)
  const allItems = React.useMemo(() => generateMockData(50), []);
  
  // Filtrer les items selon la recherche et le filtre
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });
  
  // Configuration de la pagination
  const ITEMS_PER_PAGE = 8;
  const pagination = usePagination(filteredItems.length, ITEMS_PER_PAGE);
  
  // Obtenir les items pour la page actuelle
  const currentItems = filteredItems.slice(
    pagination.startIndex,
    pagination.endIndex
  );
  
  // Réinitialiser la pagination quand on change de filtre
  React.useEffect(() => {
    pagination.resetPagination();
  }, [searchQuery, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Démonstration de Pagination
          </h1>
          <p className="text-slate-400 text-lg">
            Exemple d'utilisation du système de pagination avec {allItems.length} éléments
          </p>
        </div>

        {/* Recherche et Filtres */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher des skill paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500"
            />
          </div>
          
          {/* Filtre par difficulté */}
          <div className="flex gap-2">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className={selectedDifficulty === difficulty 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'border-slate-600 hover:bg-slate-700'
                }
              >
                {difficulty === 'all' ? 'Tous' : difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-4 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary-400" />
              <div>
                <p className="text-slate-400 text-sm">Total Items</p>
                <p className="text-white text-xl font-bold">{allItems.length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-4 flex items-center gap-3">
              <Search className="h-8 w-8 text-violet-400" />
              <div>
                <p className="text-slate-400 text-sm">Résultats Filtrés</p>
                <p className="text-white text-xl font-bold">{filteredItems.length}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Page Actuelle</p>
                <p className="text-white text-xl font-bold">
                  {pagination.currentPage} / {pagination.totalPages}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Résultats */}
        {currentItems.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-12 text-center">
              <Search className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-slate-400">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Grille des résultats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentItems.map((item) => (
                <Card key={item.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 hover:transform hover:scale-105">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-white text-lg leading-tight">
                        {item.title}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {/* Catégorie */}
                    <div className="mb-4">
                      <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                    
                    {/* Métadonnées */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.hours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {item.lessons} leçons
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.students}
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                      <div className="text-xs text-slate-500">
                        Créé le {item.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-slate-300">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              className="justify-center"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
