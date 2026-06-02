import { Ward } from "./Ward";

export type MunicipalWaste = {
    id: number;
    ward_id: number;
    waste_type: string;
    weight_kg: number;
    collection_date: string;
    created_at?: string;
    updated_at?: string;
    ward: Ward[];
}
