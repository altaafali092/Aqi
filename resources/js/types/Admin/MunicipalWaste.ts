import type { Ward } from "./Ward";

export type MunicipalWaste = {
    id: number;
    ward_id: number;
    waste_type: string;
    weight_kg: number;
    collection_date: string;
    population_served?: number | null;
    reporting_period_days?: number;
    collection_status?: 'collected' | 'partial' | 'missed' | 'overflowing';
    segregation_quality?: 'segregated' | 'partially_segregated' | 'mixed';
    organic_weight_kg?: number | null;
    recyclable_weight_kg?: number | null;
    hazardous_weight_kg?: number | null;
    medical_weight_kg?: number | null;
    overflow_spots?: number;
    odor_level?: number;
    standing_water?: boolean;
    missed_collection_days?: number;
    notes?: string | null;
    kg_per_person_per_day?: number | null;
    health_risk_level?: 'Critical' | 'High' | 'Medium' | 'Low';
    health_warning?: string;
    created_at?: string;
    updated_at?: string;
    ward?: Ward;
}
