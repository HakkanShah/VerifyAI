
export interface TextVerification {
    id: string;
    userId: string;
    inputText: string;
    credibilityScore: number;
    factCheckSummary: string;
    suspiciousPhrases: string;
    timestamp: any;
}

export interface ImageVerification {
    id: string;
    userId: string;
    imageUrl: string;
    deepfakeProbability: number;
    manipulationsDetected: string;
    referenceArticles: string;
    timestamp: any;
}

export interface VideoVerification {
    id: string;
    userId: string;
    videoUrl: string;
    deepfakeLikelihood: number;
    inconsistenciesBreakdown: string;
    sourceReferences: string;
    timestamp: any;
}
