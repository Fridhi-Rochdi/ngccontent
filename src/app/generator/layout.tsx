import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Générateur de Skill Path | NGC Content',
  description: 'Créez des parcours d\'apprentissage personnalisés avec notre générateur AI.',
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
