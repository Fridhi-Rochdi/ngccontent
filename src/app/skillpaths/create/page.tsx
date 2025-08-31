'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DynamicButton, CreateButton, SaveButton } from '@/components/ui/DynamicButton';
import { useDatabase, useDatabaseForm } from '@/hooks/useDatabase';
import { useToast } from '@/contexts/ToastContext';
import { 
  Brain, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Clock,
  User,
  Plus,
  X,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Lightbulb
} from 'lucide-react';

interface SkillPathRequest {
  title: string;
  description: string;
  goals: string[];
  targetAudience: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeCommitment: string;
  preferredFormat: string;
  specialRequirements: string;
}

const initialFormData: SkillPathRequest = {
  title: '',
  description: '',
  goals: [''],
  targetAudience: 'Senior Software Engineer',
  difficulty: 'advanced',
  estimatedTimeCommitment: '',
  preferredFormat: '',
  specialRequirements: ''
};

const validationRules = {
  title: (value: string) => {
    if (!value.trim()) return 'Title is required';
    if (value.length > 100) return 'Title must be under 100 characters';
    return null;
  },
  description: (value: string) => {
    if (!value.trim()) return 'Description is required';
    if (value.length < 50) return 'Description should be at least 50 characters';
    return null;
  },
  goals: (value: string[]) => {
    if (value.filter(goal => goal.trim()).length === 0) return 'At least one goal is required';
    return null;
  },
  targetAudience: (value: string) => {
    if (!value.trim()) return 'Target audience is required';
    return null;
  },
  difficulty: (value: string) => {
    if (!['beginner', 'intermediate', 'advanced'].includes(value)) return 'Invalid difficulty level';
    return null;
  },
  estimatedTimeCommitment: (value: string) => {
    if (!value.trim()) return 'Time commitment is required';
    return null;
  },
  preferredFormat: (value: string) => {
    if (!value.trim()) return 'Preferred format is required';
    return null;
  },
  specialRequirements: () => null // Optional field
};

export default function CreateSkillPathPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { createSkillPath, generateSkillPathContent } = useDatabase();
  const toast = useToast();
  
  const [showTips, setShowTips] = useState(true);
  const [currentGoal, setCurrentGoal] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Use our database form hook
  const { 
    formData, 
    errors, 
    isSubmitting, 
    updateField, 
    handleSubmit: handleHookSubmit, 
    reset 
  } = useDatabaseForm(
    initialFormData, 
    async (data) => {
      // Transform form data to match API expectations
      const skillPathData = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        topics: data.goals.filter(goal => goal.trim()),
        estimatedHours: parseFloat(data.estimatedTimeCommitment) || 0,
        userId: user?.id || ''
      };

      const result = await createSkillPath(skillPathData);
      
      // Clear draft on successful creation
      localStorage.removeItem('skillpath-draft');
      
      // Redirect to the new skill path
      if (result?.id) {
        router.push(`/skillpaths/${result.id}`);
      }
      
      return result;
    },
    validationRules
  );

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('skillpath-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach(key => {
          updateField(key as keyof SkillPathRequest, parsed[key]);
        });
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skillpath-draft', JSON.stringify(formData));
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  }, [formData]);

  const handleInputChange = (field: keyof SkillPathRequest, value: string) => {
    updateField(field, value);
  };

  const addGoal = () => {
    if (currentGoal.trim() && formData.goals.length < 10) {
      const newGoals = [...formData.goals.filter(g => g.trim() !== ''), currentGoal.trim()];
      updateField('goals', newGoals);
      setCurrentGoal('');
    }
  };

  // Validation function
  const validateForm = () => {
    const errors: string[] = [];
    
    Object.keys(validationRules).forEach((key) => {
      const rule = validationRules[key as keyof typeof validationRules];
      const value = formData[key as keyof typeof formData];
      const error = rule(value as any);
      if (error) {
        errors.push(error);
      }
    });
    
    return errors;
  };

  const removeGoal = (index: number) => {
    const newGoals = formData.goals.filter((_, i) => i !== index);
    updateField('goals', newGoals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setSuccessMessage('');
    
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/skillpaths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create skillpath');
      }

      const result = await response.json();
      
      setSuccessMessage('Skill path generated successfully!');
      
      // Clear draft
      localStorage.removeItem('skillpath-draft');
      
      // Redirect to the generated skill path
      setTimeout(() => {
        router.push(`/skillpaths/${result.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating skill path:', error);
      setValidationErrors(['Failed to generate skill path. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearForm = () => {
    reset();
    setCurrentGoal('');
    setValidationErrors([]);
    setSuccessMessage('');
    localStorage.removeItem('skillpath-draft');
  };

  const saveDraft = () => {
    localStorage.setItem('skillpath-draft', JSON.stringify(formData));
    setSuccessMessage('Draft saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="min-h-screen ultra-modern-gradient">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-12 glass-effect rounded-2xl w-1/3 mb-8"></div>
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="h-96 glass-effect rounded-3xl"></div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-64 glass-effect rounded-3xl"></div>
                    <div className="h-48 glass-effect rounded-3xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient">
        <div className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 p-8">
            <div className="max-w-7xl mx-auto">
              {/* Ultra-professional header */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.back()}
                      className="group flex items-center justify-center w-12 h-12 glass-effect rounded-xl hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      <ArrowLeft className="h-6 w-6 text-white/80 group-hover:text-white transition-colors" />
                    </button>
                    <div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                        Create Skill Path
                      </h1>
                      <p className="text-xl text-white/70">
                        Generate a personalized learning journey with AI-powered insights
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={saveDraft}
                      className="btn-secondary-modern flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Save Draft
                    </button>
                    <button
                      onClick={clearForm}
                      className="btn-ghost-modern flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Form
                    </button>
                  </div>
                </div>

                {/* Status messages */}
                {validationErrors.length > 0 && (
                  <div className="glass-effect-error border border-red-400/30 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-red-200">Please fix the following errors:</h3>
                    </div>
                    <ul className="space-y-1 text-red-300">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {successMessage && (
                  <div className="glass-effect-success border border-green-400/30 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <p className="text-green-200 font-medium">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Progress indicator */}
                <div className="glass-effect rounded-2xl p-4 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">Form Completion</span>
                    <span className="text-sm text-white/60">
                      {Math.round(((formData.title.length > 0 ? 1 : 0) + 
                                   (formData.description.length > 0 ? 1 : 0) + 
                                   (formData.goals.filter(g => g.trim()).length > 0 ? 1 : 0)) / 3 * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(((formData.title.length > 0 ? 1 : 0) + 
                                             (formData.description.length > 0 ? 1 : 0) + 
                                             (formData.goals.filter(g => g.trim()).length > 0 ? 1 : 0)) / 3 * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2">
                  <div className="glass-effect rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                        <Brain className="h-6 w-6 text-purple-300" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Skill Path Details</h2>
                        <p className="text-white/60">Define your learning objectives and preferences</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Title Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-lg font-semibold text-white">
                            Skill Path Title
                          </label>
                          <span className="text-red-400 text-lg">*</span>
                          <div className="flex items-center gap-1 text-xs text-white/50 ml-auto">
                            <span>{formData.title.length}</span>
                            <span>/</span>
                            <span>100</span>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="e.g., Advanced React Patterns and Architecture"
                          className="skill-path-input-modern w-full"
                          maxLength={100}
                          required
                        />
                      </div>

                      {/* Description Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-lg font-semibold text-white">
                            Description
                          </label>
                          <span className="text-red-400 text-lg">*</span>
                          <div className="flex items-center gap-1 text-xs text-white/50 ml-auto">
                            <span>{formData.description.length}</span>
                            <span>/</span>
                            <span>500</span>
                          </div>
                        </div>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Describe what you want to learn and why. Include your current skill level, specific goals, and what you hope to achieve..."
                          className="skill-path-textarea-modern w-full min-h-[120px]"
                          maxLength={500}
                          required
                        />
                      </div>

                      {/* Learning Goals Section */}
                      <div className="space-y-3">
                        <label className="text-lg font-semibold text-white">
                          Learning Goals
                          <span className="text-sm font-normal text-white/60 ml-2">(Optional)</span>
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={currentGoal}
                            onChange={(e) => setCurrentGoal(e.target.value)}
                            placeholder="Add a specific learning goal..."
                            className="skill-path-input-modern flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                          />
                          <button
                            type="button"
                            onClick={addGoal}
                            disabled={!currentGoal.trim() || formData.goals.length >= 10}
                            className="btn-primary-modern flex items-center gap-2 px-6"
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </button>
                        </div>
                        
                        {formData.goals.filter(goal => goal.trim()).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {formData.goals.filter(goal => goal.trim()).map((goal, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl px-4 py-2">
                                <span className="text-white/90 text-sm">{goal}</span>
                                <button
                                  type="button"
                                  onClick={() => removeGoal(index)}
                                  className="text-white/60 hover:text-red-400 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Difficulty Level */}
                      <div className="space-y-3">
                        <label className="text-lg font-semibold text-white">
                          Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => handleInputChange('difficulty', level)}
                              className={`skill-path-option-button ${formData.difficulty === level ? 'active' : ''}`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                {level === 'beginner' && <Star className="h-4 w-4" />}
                                {level === 'intermediate' && <TrendingUp className="h-4 w-4" />}
                                {level === 'advanced' && <Zap className="h-4 w-4" />}
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Target Audience */}
                      <div className="space-y-3">
                        <label className="text-lg font-semibold text-white">
                          Target Audience
                          <span className="text-sm font-normal text-white/60 ml-2">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.targetAudience}
                          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                          placeholder="e.g., Senior Software Engineer, Tech Lead, Full-Stack Developer"
                          className="skill-path-input-modern w-full"
                        />
                      </div>

                      {/* Time Commitment */}
                      <div className="space-y-3">
                        <label className="text-lg font-semibold text-white">
                          Estimated Time Commitment
                          <span className="text-sm font-normal text-white/60 ml-2">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.estimatedTimeCommitment}
                          onChange={(e) => handleInputChange('estimatedTimeCommitment', e.target.value)}
                          placeholder="e.g., 2-3 hours per week for 8 weeks"
                          className="skill-path-input-modern w-full"
                        />
                      </div>

                      {/* Preferred Format */}
                      <div className="space-y-3">
                        <label className="text-lg font-semibold text-white">
                          Preferred Learning Format
                          <span className="text-sm font-normal text-white/60 ml-2">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.preferredFormat}
                          onChange={(e) => handleInputChange('preferredFormat', e.target.value)}
                          placeholder="e.g., Hands-on projects, Video tutorials, Reading materials, Interactive coding"
                          className="skill-path-input-modern w-full"
                        />
                      </div>

                      {/* Special Requirements */}
                      <div className="space-y-3">
                        <label className="text-lg font-semibold text-white">
                          Special Requirements
                          <span className="text-sm font-normal text-white/60 ml-2">(Optional)</span>
                        </label>
                        <textarea
                          value={formData.specialRequirements}
                          onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                          placeholder="Any specific tools, technologies, constraints, or preferences..."
                          className="skill-path-textarea-modern w-full min-h-[100px]"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6 space-y-4">
                        {/* Save Draft Button */}
                        <SaveButton
                          className="w-full"
                          onClick={() => {
                            localStorage.setItem('skillpath-draft', JSON.stringify(formData));
                            toast.success('Draft Saved', 'Your skill path draft has been saved locally.');
                          }}
                          loadingText="Saving draft..."
                          successText="Draft saved!"
                        >
                          Save Draft
                        </SaveButton>

                        {/* Create Skill Path Button */}
                        <CreateButton
                          className="w-full"
                          size="lg"
                          disabled={!formData.title.trim() || !formData.description.trim()}
                          onClick={() => handleSubmit({} as React.FormEvent)}
                          loadingText="Creating your skill path..."
                          successText="Skill path created!"
                          trackEvent="skillpath_created"
                        >
                          <Sparkles className="h-6 w-6" />
                          Generate AI Skill Path
                        </CreateButton>

                        {/* Reset Form Button */}
                        <DynamicButton
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            reset();
                            localStorage.removeItem('skillpath-draft');
                            toast.info('Form Reset', 'All fields have been cleared.');
                          }}
                          requireConfirmation={true}
                          confirmationMessage="Are you sure you want to clear all form data? This cannot be undone."
                        >
                          <X className="h-4 w-4" />
                          Reset Form
                        </DynamicButton>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tips Card */}
                  <div className="glass-effect rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
                          <Lightbulb className="h-5 w-5 text-yellow-300" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Pro Tips</h3>
                      </div>
                      <button
                        onClick={() => setShowTips(!showTips)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {showTips ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {showTips && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
                          <Target className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-white mb-1">Be Specific</p>
                            <p className="text-xs text-white/70">Include specific technologies, frameworks, or concepts you want to master</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20">
                          <Clock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-white mb-1">Set Realistic Goals</p>
                            <p className="text-xs text-white/70">Define achievable learning objectives based on your available time</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
                          <User className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-white mb-1">Context Matters</p>
                            <p className="text-xs text-white/70">Mention your current experience level and career objectives</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Examples Card */}
                  <div className="glass-effect rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                        <BookOpen className="h-5 w-5 text-green-300" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Example Paths</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Brain className="h-4 w-4 text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors">Advanced React Patterns</p>
                            <p className="text-xs text-white/60">Render props, HOCs, compound components, context patterns</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-blue-300" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-1 group-hover:text-blue-200 transition-colors">Cloud Architecture</p>
                            <p className="text-xs text-white/60">AWS services, microservices, serverless, infrastructure as code</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Zap className="h-4 w-4 text-green-300" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-1 group-hover:text-green-200 transition-colors">System Design</p>
                            <p className="text-xs text-white/60">Distributed systems, scalability, database design</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="glass-effect rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30">
                        <TrendingUp className="h-5 w-5 text-indigo-300" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Quick Stats</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">5-10</div>
                        <div className="text-xs text-white/60">Min to Create</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">AI</div>
                        <div className="text-xs text-white/60">Powered</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">∞</div>
                        <div className="text-xs text-white/60">Possibilities</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">100%</div>
                        <div className="text-xs text-white/60">Personalized</div>
                      </div>
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
