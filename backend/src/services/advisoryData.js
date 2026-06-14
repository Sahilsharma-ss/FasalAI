// The diseases we can detect plus the advice we show farmers for each one.

export const diseaseClasses = [
  {
    label: "Tomato - Late Blight",
    crop: "Tomato",
    healthy: false,
    advisory: {
      summary:
        "A fast-spreading fungal disease causing dark, water-soaked spots on leaves and fruit.",
      treatment: [
        "Remove and destroy infected leaves and fruit immediately.",
        "Apply a copper-based or mancozeb fungicide as per label instructions.",
        "Avoid overhead watering to keep foliage dry.",
      ],
      prevention: [
        "Use certified disease-free seeds and resistant varieties.",
        "Ensure proper plant spacing for air circulation.",
        "Rotate crops and avoid planting tomatoes in the same spot yearly.",
      ],
    },
  },
  {
    label: "Tomato - Healthy",
    crop: "Tomato",
    healthy: true,
    advisory: {
      summary: "The leaf appears healthy with no visible signs of disease.",
      treatment: ["No treatment needed."],
      prevention: [
        "Continue regular monitoring and balanced watering.",
        "Maintain good soil nutrition and field hygiene.",
      ],
    },
  },
  {
    label: "Potato - Early Blight",
    crop: "Potato",
    healthy: false,
    advisory: {
      summary:
        "A fungal disease showing concentric brown rings on older leaves.",
      treatment: [
        "Apply fungicides containing chlorothalonil or mancozeb.",
        "Remove infected lower leaves to slow the spread.",
      ],
      prevention: [
        "Keep plants well nourished to reduce stress.",
        "Practice crop rotation with non-host crops.",
      ],
    },
  },
  {
    label: "Corn - Common Rust",
    crop: "Corn",
    healthy: false,
    advisory: {
      summary:
        "A fungal disease forming reddish-brown pustules on leaf surfaces.",
      treatment: [
        "Apply a recommended foliar fungicide at early symptom stage.",
        "Remove heavily infected leaves where practical.",
      ],
      prevention: [
        "Plant rust-resistant hybrids.",
        "Avoid excessive nitrogen and ensure good drainage.",
      ],
    },
  },
  {
    label: "Grape - Black Rot",
    crop: "Grape",
    healthy: false,
    advisory: {
      summary:
        "A fungal disease causing brown leaf spots and shriveled black fruit.",
      treatment: [
        "Prune and destroy infected canes and mummified berries.",
        "Apply protective fungicide sprays during the growing season.",
      ],
      prevention: [
        "Improve canopy airflow through proper pruning.",
        "Clean up fallen debris at the end of the season.",
      ],
    },
  },
  {
    label: "Apple - Apple Scab",
    crop: "Apple",
    healthy: false,
    advisory: {
      summary:
        "A fungal disease producing olive-green to black velvety leaf spots.",
      treatment: [
        "Apply fungicide from bud break through early summer.",
        "Rake and remove fallen leaves to reduce spores.",
      ],
      prevention: [
        "Plant scab-resistant apple varieties.",
        "Prune trees to improve light and air penetration.",
      ],
    },
  },
];
