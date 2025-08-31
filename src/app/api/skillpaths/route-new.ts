import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Pour l'instant, retourner une liste de skill paths basique
    const skillPaths = [
      {
        id: "1",
        title: "Développement Web Frontend",
        description: "Apprenez les bases du développement web frontend",
        difficulty: "beginner",
        estimatedHours: 40,
        topics: ["HTML", "CSS", "JavaScript"],
        createdAt: new Date().toISOString()
      },
      {
        id: "2", 
        title: "Backend avec Node.js",
        description: "Maîtrisez le développement backend avec Node.js",
        difficulty: "intermediate",
        estimatedHours: 60,
        topics: ["Node.js", "Express", "Database"],
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(skillPaths);
  } catch (error) {
    console.error('Erreur lors de la récupération des skill paths:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Pour l'instant, retourner le skill path créé avec un ID généré
    const newSkillPath = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newSkillPath, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du skill path:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
