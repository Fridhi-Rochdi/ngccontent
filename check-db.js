const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkDatabase() {
  try {
    console.log('🔄 Connexion à Neon Database...\n');

    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion réussie à la base de données Neon\n');

    console.log('=== VÉRIFICATION DE LA BASE DE DONNÉES ===\n');

    // Vérifier les skill paths
    const skillPaths = await prisma.skillPath.findMany({
      include: {
        lessons: {
          include: {
            content: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    console.log(`📚 Nombre de parcours trouvés: ${skillPaths.length}`);

    skillPaths.forEach((skillPath, index) => {
      console.log(`\n--- Parcours ${index + 1}: ${skillPath.name} ---`);
      console.log(`ID: ${skillPath.id}`);
      console.log(`Statut: ${skillPath.status}`);
      console.log(`Leçons: ${skillPath.lessons.length}`);

      skillPath.lessons.forEach((lesson, lessonIndex) => {
        console.log(`\n  📖 Leçon ${lessonIndex + 1}: ${lesson.title}`);
        console.log(`     ID: ${lesson.id}`);
        console.log(`     Statut: ${lesson.status}`);
        console.log(`     Versions de contenu: ${lesson.content.length}`);

        lesson.content.forEach((content, contentIndex) => {
          console.log(`\n    📄 Version ${contentIndex + 1}:`);
          console.log(`       ID: ${content.id}`);
          console.log(`       Version: ${content.version}`);
          console.log(`       Sélectionnée: ${content.isSelected}`);
          console.log(`       Créée le: ${new Date(content.createdAt).toLocaleString('fr-FR')}`);

          // Afficher un aperçu du contenu
          const contentData = content.content;
          if (contentData && typeof contentData === 'object') {
            const data = contentData;
            console.log(`       📝 Script: ${data.script?.length || 0} sections`);
            console.log(`       🧠 Quiz: ${data.quiz?.questions?.length || 0} questions`);
            console.log(`       🎯 Projet: ${data.project ? 'Oui' : 'Non'}`);
            console.log(`       🛠️ Exercices: ${data.lab_exercises?.length || 0}`);
            console.log(`       🎓 BAC: ${data.correction_bac ? 'Oui' : 'Non'}`);
          } else {
            console.log(`       ⚠️ Contenu non structuré ou vide`);
          }
        });
      });
    });

    // Chercher un contenu spécifique pour voir sa structure
    const specificLesson = await prisma.lesson.findUnique({
      where: { id: '0f1be142-fd95-4865-b3c9-557f77fc2a1f' }, // Leçon avec contenu du parcours 37
      include: {
        content: true
      }
    });

    if (specificLesson && specificLesson.content.length > 0) {
      console.log('\n=== STRUCTURE DÉTAILLÉE DU CONTENU ===');
      console.log('Leçon:', specificLesson.title);
      console.log('Contenu brut:', JSON.stringify(specificLesson.content[0].content, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la base de données:', error);
    console.error('Détails de l\'erreur:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Déconnexion de la base de données');
  }
}

checkDatabase();
