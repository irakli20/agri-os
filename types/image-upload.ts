/**
 * Image Upload & AI Identification Types
 * 
 * Types for pest/disease image uploads, AI-powered identification results,
 * and recommended actions.
 */

export type IdentificationStatus = 'pending' | 'analyzing' | 'completed' | 'failed';
export type SeverityLevel = 'Low' | 'Medium' | 'High';

export interface IdentificationResult {
    pestOrDiseaseName: string;
    type: 'pest' | 'disease';
    confidence: number; // 0-100 percentage
    severity: SeverityLevel;
    description: string;
    recommendedActions: string[];
}

export interface ImageUpload {
    id: string;
    imageUrl: string;
    uploadDate: string;
    fieldId: string;
    fieldName: string;
    status: IdentificationStatus;
    identificationResult?: IdentificationResult;
}

// Mock data for sample image uploads with identification results
export const MOCK_IMAGE_UPLOADS: ImageUpload[] = [
    {
        id: 'img-001',
        imageUrl: '/images/pest-aphid-sample.jpg',
        uploadDate: '2024-12-03T10:30:00Z',
        fieldId: 'field-1',
        fieldName: 'North Soybean Field',
        status: 'completed',
        identificationResult: {
            pestOrDiseaseName: 'Soybean Aphid',
            type: 'pest',
            confidence: 94,
            severity: 'Medium',
            description: 'Small, yellow-green insects found on the underside of leaves. Population density indicates moderate infestation.',
            recommendedActions: [
                'Monitor population levels every 2-3 days',
                'Consider insecticide application if threshold exceeded (250 aphids/plant)',
                'Introduce beneficial predators such as lady beetles',
                'Scout field edges and hotspots more frequently'
            ]
        }
    },
    {
        id: 'img-002',
        imageUrl: '/images/disease-blight-sample.jpg',
        uploadDate: '2024-12-02T14:15:00Z',
        fieldId: 'field-2',
        fieldName: 'East Corn Field',
        status: 'completed',
        identificationResult: {
            pestOrDiseaseName: 'Northern Corn Leaf Blight',
            type: 'disease',
            confidence: 87,
            severity: 'High',
            description: 'Gray-green cigar-shaped lesions observed on leaves. Fungal infection spreading rapidly in humid conditions.',
            recommendedActions: [
                'Apply fungicide treatment within 48 hours',
                'Improve air circulation if possible',
                'Remove heavily infected plant material',
                'Plan resistant variety planting for next season'
            ]
        }
    },
    {
        id: 'img-003',
        imageUrl: '/images/pest-earworm-sample.jpg',
        uploadDate: '2024-12-01T09:45:00Z',
        fieldId: 'field-2',
        fieldName: 'East Corn Field',
        status: 'completed',
        identificationResult: {
            pestOrDiseaseName: 'Corn Earworm',
            type: 'pest',
            confidence: 91,
            severity: 'High',
            description: 'Larvae detected feeding on corn ears. Multiple entry holes visible with frass present.',
            recommendedActions: [
                'Apply targeted insecticide to affected areas',
                'Scout for egg masses on silks',
                'Consider pheromone traps for monitoring',
                'Schedule treatment during early larval stage for best efficacy'
            ]
        }
    },
    {
        id: 'img-004',
        imageUrl: '/images/disease-rust-sample.jpg',
        uploadDate: '2024-11-30T16:20:00Z',
        fieldId: 'field-3',
        fieldName: 'West Wheat Field',
        status: 'completed',
        identificationResult: {
            pestOrDiseaseName: 'Wheat Leaf Rust',
            type: 'disease',
            confidence: 96,
            severity: 'Low',
            description: 'Small orange-brown pustules on leaf surfaces. Early stage infection detected.',
            recommendedActions: [
                'Monitor closely for spread',
                'Apply preventive fungicide if conditions favor disease',
                'Increase scouting frequency to twice weekly',
                'Document affected areas for future reference'
            ]
        }
    }
];

// Helper functions
export function getConfidenceColor(confidence: number): string {
    if (confidence >= 90) return 'text-green-400 bg-green-500/20';
    if (confidence >= 70) return 'text-yellow-400 bg-yellow-500/20';
    if (confidence >= 50) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
}

export function getSeverityLevelColor(severity: SeverityLevel): string {
    switch (severity) {
        case 'Low': return 'text-green-400 bg-green-500/20';
        case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
        case 'High': return 'text-red-400 bg-red-500/20';
    }
}

export function getStatusColor(status: IdentificationStatus): string {
    switch (status) {
        case 'pending': return 'text-gray-400 bg-gray-500/20';
        case 'analyzing': return 'text-blue-400 bg-blue-500/20';
        case 'completed': return 'text-green-400 bg-green-500/20';
        case 'failed': return 'text-red-400 bg-red-500/20';
    }
}
