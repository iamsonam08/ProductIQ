import { KnowledgeGraphAnomaly, KnowledgeGraphCheck, KnowledgeGraphRule, StructuredProductData } from '../types';
import { MATERIAL_PRESSURE_LIMITS } from '../data/knowledgeGraphRules';

export function evaluateKnowledgeGraph(
  data: StructuredProductData,
  rules: KnowledgeGraphRule[]
): KnowledgeGraphCheck {
  const anomalies: KnowledgeGraphAnomaly[] = [];
  const rulesChecked: string[] = [];

  const categoryNorm = (data.category || '').trim();
  const materialNorm = (data.material || '').trim();
  const pressureNorm = (data.pressure || '').trim();
  const specNorm = (data.spec || '').trim();

  // Find matching rule by category (fuzzy or exact)
  const matchingRule = rules.find(r => 
    r.category.toLowerCase() === categoryNorm.toLowerCase() ||
    categoryNorm.toLowerCase().includes(r.category.toLowerCase().replace('s', ''))
  );

  if (matchingRule) {
    rulesChecked.push(`Category Rule: ${matchingRule.category}`);

    // 1. Material Compatibility Check
    if (materialNorm && materialNorm.toUpperCase() !== 'N/A' && materialNorm.toUpperCase() !== 'UNKNOWN') {
      const isAllowed = matchingRule.allowedMaterials.some(m => 
        m.toLowerCase().includes(materialNorm.toLowerCase()) || 
        materialNorm.toLowerCase().includes(m.toLowerCase())
      );

      if (!isAllowed) {
        anomalies.push({
          field: 'material',
          message: `Material '${materialNorm}' is non-standard for category '${matchingRule.category}'. Expected: ${matchingRule.allowedMaterials.slice(0, 3).join(', ')}`,
          severity: 'medium',
          ruleId: matchingRule.id
        });
      }
    }

    // 2. Specification Standards Check
    if (specNorm && specNorm.toUpperCase() !== 'N/A' && specNorm.toUpperCase() !== 'UNKNOWN') {
      const isTypicalSpec = matchingRule.typicalSpecs.some(s => 
        s.toLowerCase().includes(specNorm.toLowerCase()) || 
        specNorm.toLowerCase().includes(s.toLowerCase())
      );

      if (!isTypicalSpec) {
        anomalies.push({
          field: 'spec',
          message: `Specification '${specNorm}' is uncommon for '${matchingRule.category}'. Standard specs include ${matchingRule.typicalSpecs.join(', ')}`,
          severity: 'low',
          ruleId: matchingRule.id
        });
      }
    }
  } else if (categoryNorm && categoryNorm !== 'N/A') {
    anomalies.push({
      field: 'category',
      message: `Category '${categoryNorm}' is not currently indexed in the active Knowledge Graph ontology rules.`,
      severity: 'low'
    });
  }

  // 3. Physical Material vs Pressure Class Inconsistency Check
  for (const [matKey, limits] of Object.entries(MATERIAL_PRESSURE_LIMITS)) {
    if (materialNorm.toLowerCase().includes(matKey.toLowerCase())) {
      rulesChecked.push(`Material Pressure Limit: ${matKey}`);
      
      const pUpper = pressureNorm.toUpperCase();
      let detectedPressureClass = 0;
      if (pUpper.includes('CLASS 600') || pUpper.includes('CLASS 800') || pUpper.includes('CLASS 900') || pUpper.includes('CLASS 1500') || pUpper.includes('3000 PSI')) {
        detectedPressureClass = 600;
      } else if (pUpper.includes('CLASS 300')) {
        detectedPressureClass = 300;
      }

      if (detectedPressureClass > limits.maxPressureClass) {
        anomalies.push({
          field: 'pressure',
          message: `Physical Anomaly: ${limits.text} Cannot support '${pressureNorm}'.`,
          severity: 'high'
        });
      }
    }
  }

  // Determine overall status
  let status: 'valid' | 'anomaly_flagged' | 'warning' = 'valid';
  if (anomalies.some(a => a.severity === 'high')) {
    status = 'anomaly_flagged';
  } else if (anomalies.length > 0) {
    status = 'warning';
  }

  return {
    status,
    rulesChecked,
    anomalies
  };
}
