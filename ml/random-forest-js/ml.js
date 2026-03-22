const { RandomForestClassifier } = require('ml-random-forest');
const fs = require('fs');

const trainingData = [
  // Human-like requests (low score)
  [0, 0, 0, 0, 0], // Clean
  [0, 0, 1, 0, 0], // One missing header
  [0, 0, 0, 0, 0], // Another clean
  [0, 0, 0, 0, 0], // Yet another clean
  [0, 0, 1, 0, 0], // One missing header
  [0, 0, 0, 0, 0], // Clean
  [0, 0, 1, 0, 0], // One missing header
  [0, 0, 0, 0, 0], // Another clean
  [0, 0, 0, 0, 0], // Yet another clean
  [0, 0, 1, 0, 0], // One missing header
  [0, 0, 0, 0, 0], // Clean
  [0, 0, 1, 0, 0], // One missing header
  [0, 0, 0, 0, 0], // Another clean
  [0, 0, 0, 0, 0], // Yet another clean
  [0, 0, 1, 0, 0], // One missing header

  [1, 0, 2, 0, 1], // VPN, some missing headers, suspicious UA
  [0, 1, 0, 0, 0], // Bad ASN
  [0, 0, 3, 1, 1], // Many missing headers, suspicious route, suspicious UA
  [1, 1, 0, 1, 0], // VPN, Bad ASN, suspicious route
  [0, 0, 5, 1, 1], // Very suspicious
  [1, 1, 5, 1, 1], // All flags
  [0, 1, 2, 0, 1], // Bad ASN, some missing headers, suspicious UA
  [1, 0, 0, 1, 0], // VPN, suspicious route
  [0, 0, 4, 1, 1], // More suspicious
  [1, 1, 1, 1, 1], // Full suspicious
];

const labels = [
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
];


const options = {
  seed: 42,
  maxFeatures: 0.8,
  replacement: true,
  nEstimators: 100, // Number of trees
  treeOptions: {
    minNumSamples: 5 // Minimum number of samples required to split an internal node.
  }
};

console.log('Training Random Forest model...');
const classifier = new RandomForestClassifier(options);
classifier.train(trainingData, labels);
console.log('Model training complete.');


const modelJSON = classifier.toJSON();
const modelPath = './trained_bot_score_model.json';

fs.writeFileSync(modelPath, JSON.stringify(modelJSON));
console.log(`Model saved to ${modelPath}`);