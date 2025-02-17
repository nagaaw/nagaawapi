export const generateBusinessModelPrompt = (
  projectName: string,
  description: string,
  sector: string,
): string => {
  const prompt = `Génère un business model complet au format JSON respectant le format suivant:
  {
  "valueProposition": "",
  "customerSegments": [],
  "channels": [],
  "customerRelationships": [],
  "revenueStreams": [],
  "keyResources": [],
  "keyActivities": [],
  "keyPartnerships": [],
  "costStructure": []
},
 pour le projet suivant :
- Nom du projet : ${projectName}
- Description : ${description}
- Secteur d'activité : ${sector}

Le business model doit inclure les sections suivantes :
1. Value Proposition
2. Customer Segments
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partnerships
9. Cost Structure

Retourne uniquement le JSON prêt a être parser par JSON.parse de javascripts, sans commentaires ni explications.
Le result json doit être un json complet et valide. 
Il faut fermer les {} et les [] 
La réponse ne doit pas être coupé s'il faut réduire les texts

`;

  return prompt;
};

export const generateSqlScriptPrompt = (prompt: string) => {
  return `
         Génère un script SQL pour insérer les produits suivants dans une table MySQL. 
         La table s'appelle product et a les colonnes suivantes : 
         id (auto-incrémenté), label, description, price, imgUrls. Assure-toi que le script SQL
          est prêt à être exécuté directement en base de données, sans aucun commentaire. 
         Les produits à insérer sont : ${prompt}
         `;
};
