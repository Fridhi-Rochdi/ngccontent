import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, max_tokens = 4000, temperature = 0.7 } = await request.json();

    // Vérifier les variables d'environnement Azure OpenAI
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview';

    if (!azureEndpoint || !azureApiKey) {
      console.error('Variables d\'environnement Azure OpenAI manquantes');
      return NextResponse.json(
        { error: 'Configuration Azure OpenAI manquante' },
        { status: 500 }
      );
    }

    // Construire l'URL Azure OpenAI
    const url = `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    console.log('🔗 URL Azure OpenAI:', url);
    console.log('📡 Appel direct à l\'API Azure OpenAI...');

    // Appel à l'API Azure OpenAI
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens,
        temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur Azure OpenAI:', response.status, errorData);
      return NextResponse.json(
        { error: `Azure OpenAI API error: ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Réponse reçue de l\'API');
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('💥 Erreur lors de l\'appel API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
