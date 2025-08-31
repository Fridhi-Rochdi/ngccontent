import { parseSkillPath } from '@/utils/skillPathParser';
import { SkillPath } from '@/types/skillPath';

export interface ContentGenerationRequest {
  skillPathText: string;
  version: 'basic' | 'intermediate' | 'creative';
  userId: string;
}

export interface ContentGenerationResult {
  skillPath: SkillPath;
  generatedId: string;
  status: 'processing' | 'completed' | 'error';
  message?: string;
}

export async function generateSkillPathContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
  try {
    // 1. Parser le skill path
    const skillPath = parseSkillPath(request.skillPathText);
    
    if (!skillPath.units || skillPath.units.length === 0) {
      throw new Error('Aucune unité détectée dans le texte fourni');
    }

    // 2. Générer un ID unique
    const generatedId = `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 3. Pour l'instant, retourner le skill path parsé
    // TODO: Intégrer la génération complète avec l'IA
    
    return {
      skillPath,
      generatedId,
      status: 'completed',
      message: 'Skill path généré avec succès'
    };

  } catch (error) {
    console.error('Erreur génération:', error);
    return {
      skillPath: { units: [] },
      generatedId: '',
      status: 'error',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

export function validateSkillPathText(text: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!text || text.trim().length === 0) {
    errors.push('Le texte du skill path ne peut pas être vide');
    return { valid: false, errors };
  }

  // Vérifications basiques
  const hasUnits = /Unité?\s+\d+|Unit\s+\d+/i.test(text);
  const hasModules = /Module\s+\d+\.\d+/i.test(text);
  
  if (!hasUnits) {
    errors.push('Aucune unité détectée (format attendu: "Unité 1" ou "Unit 1")');
  }
  
  if (!hasModules) {
    errors.push('Aucun module détecté (format attendu: "Module 1.1")');
  }

  return { valid: errors.length === 0, errors };
}
