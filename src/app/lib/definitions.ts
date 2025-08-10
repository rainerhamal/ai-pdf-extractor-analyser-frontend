    export type Goal =
    {
        description: string;
        type: string;
        status: string;
        target: number | null;
        achieved: number | null;
        timeline: string;
    }

   export type BMP =
    {
        name: string;
        type: string;
        target: number;
        achieved: number;
        status: string;
    }

    export type Implementation =
    {
        activity: string;
        location: string;
        date: string;
        responsibleParty: string;
        status: string;
    }

    export type Monitoring =
    {
        metric: string;
        value: number;
        unit: string;
        date: string;
    }

    export type Outreach =
    {
        activity: string;
        audience: string;
        date: string;
        outcome: string;
    }

    export type GeographicArea =
    {
        name: string;
        type: string;
    }

    export type Summary =
    {
        totalGoals: number;
        totalBMPs: number;
        completionRate: number | null;
    }

    export type CountyData =
    {
        county_name: string;
        overview: string;
        summary: Summary;
        goals: Goal[];
        bmps: BMP[];
        implementation: Implementation[];
        monitoring: Monitoring[];
        outreach: Outreach[];
        geographic_areas: GeographicArea[];
    }