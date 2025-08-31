'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { safeSum, renderNumber } from '@/lib/safeNumbers';

// Composants Card simples
function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`pb-2 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm ${className}`}>{children}</p>;
}

function Badge({ children, className = '', variant = 'default' }: { children: React.ReactNode, className?: string, variant?: string }) {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClass = variant === 'outline' ? 'border border-slate-600 text-slate-300' : 'bg-slate-700 text-slate-300';
  return <span className={`${baseClass} ${variantClass} ${className}`}>{children}</span>;
}
import { 
  Plus, 
  BookOpen, 
  Clock, 
  User, 
  Calendar,
  ArrowRight,
  Filter,
  Search,
  Star,
  Users,
  Target
} from 'lucide-react';

interface SkillPath {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  topics: string[];
  status: 'draft' | 'published' | 'archived';
}

export default function SkillPathsPage() {
  const { user, isLoaded } = useUser();
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  // Configuration de la pagination
  const ITEMS_PER_PAGE = 6;
  
  useEffect(() => {
    if (isLoaded) {
      fetchSkillPaths();
    }
  }, [isLoaded]);

  const fetchSkillPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skillpaths');
      
      if (response.ok) {
        const data = await response.json();
        // Transformer les données de la base de données au format attendu
        const transformedData = data.map((skillPath: any) => ({
          id: skillPath.id,
          title: skillPath.name,
          description: `Skill path avec ${skillPath.lessons?.length || 0} leçons`,
          createdAt: skillPath.createdAt,
          updatedAt: skillPath.updatedAt,
          userId: user?.id,
          difficulty: skillPath.status === 'COMPLETED' ? 'Advanced' : 
                     skillPath.status === 'PUBLISHED' ? 'Intermediate' : 'Beginner',
          estimatedHours: (skillPath.lessons?.length || 0) * 2, // 2h par leçon en moyenne
          topics: skillPath.sommaire?.units?.slice(0, 3).map((unit: any) => unit.name) || ['Développement Web'],
          status: skillPath.status.toLowerCase()
        }));
        setSkillPaths(transformedData);
      } else {
        console.error('Error fetching skill paths:', response.statusText);
        // Fallback en cas d'erreur
        setSkillPaths([]);
      }
    } catch (error) {
      console.error('Error fetching skill paths:', error);
      // Fallback en cas d'erreur réseau
      setSkillPaths([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkillPaths = skillPaths.filter(skillPath => {
    const matchesSearch = skillPath.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skillPath.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skillPath.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || skillPath.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Configuration de la pagination avec les résultats filtrés
  const pagination = usePagination(filteredSkillPaths.length, ITEMS_PER_PAGE);
  
  // Obtenir les éléments pour la page actuelle
  const paginatedSkillPaths = filteredSkillPaths.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  // Réinitialiser la pagination quand on change de filtre ou de recherche
  useEffect(() => {
    pagination.resetPagination();
  }, [searchQuery, filterStatus]);

  if (!isLoaded || loading) {
    return (
      <MainLayout>
        <div className="skillpaths-container">
          <div className="loading-state">
            <div className="loading-title"></div>
            <div className="skillpaths-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="loading-card"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="skillpaths-container">
        {/* Header */}
        <div className="skillpaths-header">
          <div>
            <h1 className="skillpaths-title">Skill Paths</h1>
            <p className="skillpaths-subtitle">Explore and manage your learning journeys</p>
          </div>
          <Link href="/skillpaths/create">
            <Button className="quick-action-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create New Path
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search skill paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "filter-active" : "filter-inactive"}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <Card className="stat-card-skillpaths">
            <CardContent className="stat-content-skillpaths">
              <BookOpen className="stat-icon-skillpaths" />
              <div className="stat-text">
                <p className="stat-label-skillpaths">Total Paths</p>
                <p className="stat-value-skillpaths">{skillPaths.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-skillpaths">
            <CardContent className="stat-content-skillpaths">
              <Clock className="stat-icon-skillpaths" />
              <div className="stat-text">
                <p className="stat-label-skillpaths">Total Hours</p>
                <p className="stat-value-skillpaths">
                  {safeSum(skillPaths, path => path.estimatedHours)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card-skillpaths">
            <CardContent className="stat-content-skillpaths">
              <User className="stat-icon-skillpaths" />
              <div className="stat-text">
                <p className="stat-label-skillpaths">Published</p>
                <p className="stat-value-skillpaths">
                  {skillPaths.filter(path => path.status === 'published').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Paths Grid */}
        {filteredSkillPaths.length === 0 ? (
          <Card className="stat-card-skillpaths">
            <CardContent className="empty-state-skillpaths">
              <BookOpen className="empty-state-icon-skillpaths" />
              <h3 className="empty-state-title">
                {searchQuery ? 'No matching skill paths found' : 'No skill paths yet'}
              </h3>
              <p className="empty-state-description">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters.'
                  : 'Create your first skill path to start your learning journey.'}
              </p>
              {!searchQuery && (
                <Link href="/skillpaths/create">
                  <Button className="quick-action-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Skill Path
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Grid des skill paths paginés */}
            <div className="skillpaths-grid">
              {paginatedSkillPaths.map((skillPath) => (
                <Card key={skillPath.id} className="skillpath-card">
                  <CardHeader>
                    <div className="skillpath-card-header">
                      <div className="flex-1">
                        <CardTitle className="skillpath-card-title">
                          {skillPath.title}
                        </CardTitle>
                        <CardDescription className="skillpath-card-description">
                          {skillPath.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={`skillpath-badge ${
                          skillPath.status === 'published' ? 'badge-published' : 
                          skillPath.status === 'draft' ? 'badge-draft' : 'badge-archived'
                        }`}
                      >
                        {skillPath.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="skillpath-meta">
                      <div className="skillpath-meta-item">
                        <Clock />
                        {renderNumber(skillPath.estimatedHours)}h
                      </div>
                      <div className="skillpath-meta-item">
                        <Badge className={`skillpath-difficulty difficulty-${skillPath.difficulty.toLowerCase()}`}>
                          {skillPath.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="skillpath-topics">
                      {skillPath.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} className="topic-tag">
                          {topic}
                        </Badge>
                      ))}
                      {skillPath.topics.length > 3 && (
                        <Badge className="topic-tag">
                          +{skillPath.topics.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="skillpath-actions">
                      <div className="text-xs text-slate-500">
                        Updated {new Date(skillPath.updatedAt).toLocaleDateString()}
                      </div>
                      <Link href={`/skillpaths/${skillPath.id}`} className="skillpath-link">
                        View Path
                        <ArrowRight />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              className="mt-8"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
