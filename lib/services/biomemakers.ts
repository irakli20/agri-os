export interface BiomemakersMetric {
    value: number; // e.g. negative code or raw amount
    rank?: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
    raw_rank?: number; // 1.0 to 5.999
}

export interface BeCropReport {
    sample_id: string;
    report_date: string;
    score: number; // 0-100 BeCrop Score
    biology: {
        fungi_bacteria_ratio: BiomemakersMetric;
        arbuscular_mycorrhizal: BiomemakersMetric;
        ectomycorrhizal: BiomemakersMetric;
        biodiversity: BiomemakersMetric;
        pathogen_risk: BiomemakersMetric;
    };
    nutrition: {
        nitrogen_fixation: BiomemakersMetric;
        phosphorus_solubilization: BiomemakersMetric;
        potassium_solubilization: BiomemakersMetric;
    };
}

/**
 * Service client for the Biomemakers API.
 * Currently defaults to returning mock sandbox data structured according to the API spec.
 */
export class BiomemakersService {
    private static MOCK_DELAY = 1500;

    /**
     * Fetch a BeCrop report for a particular sample.
     * @param sampleId - The unique identifier of the soil sample.
     */
    static async getSampleReport(sampleId: string): Promise<BeCropReport> {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

        // Generate semi-deterministic mock score based on sample string length
        const mockScore = 65 + (sampleId.length % 20); // ranges typically 65-84

        return {
            sample_id: sampleId,
            report_date: new Date().toISOString(),
            score: mockScore,
            biology: {
                fungi_bacteria_ratio: {
                    value: 1.2,
                    rank: 'Medium',
                    raw_rank: 3.2
                },
                arbuscular_mycorrhizal: {
                    value: 15,
                    rank: 'High',
                    raw_rank: 4.5
                },
                ectomycorrhizal: {
                    value: -2, // Special code: -2 when neither Arbuscular nor Ectomycorrhizal MOs were found
                    rank: 'Very Low',
                    raw_rank: 0,
                },
                biodiversity: {
                    value: 85,
                    rank: 'Very High',
                    raw_rank: 5.2
                },
                pathogen_risk: {
                    value: 10,
                    rank: 'Low',
                    raw_rank: 2.1
                }
            },
            nutrition: {
                nitrogen_fixation: {
                    value: 45,
                    rank: 'Medium',
                    raw_rank: 3.8
                },
                phosphorus_solubilization: {
                    value: 30,
                    rank: 'Low',
                    raw_rank: 2.5
                },
                potassium_solubilization: {
                    value: 70,
                    rank: 'High',
                    raw_rank: 4.1
                }
            }
        };
    }
}
