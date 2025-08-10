'use client';

import { lusitana } from "../../ui/fonts";
import UploadModal from "../../ui/uploadModal";
import { useFileId } from "../../ui/fileIdContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CountyData, Goal, BMP, Implementation, Monitoring, Outreach, GeographicArea, Summary } from "@/app/lib/definitions";
import
{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
    TimeScale,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
    TimeScale
);


export default function Page ()
{
    const params = useParams();
    const countyId = params.countyId as string;


    const [ data, setData ] = useState<CountyData | null>( null );

    useEffect( () =>
    {
        fetch( `${ process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" }/api/counties/${ countyId }` )
            .then( ( res ) => res.json() )
            .then( ( data ) => setData( data ) )
            .catch( ( err ) => console.error( "Error fetching county data:", err ) );
    }, [ countyId ] );

    if ( !data ) return <p className="text-white">Loading...</p>;

    console.log( "Fetched county data:", data );

    console.log( "Fetched county data:", data );

    // Export JSON function
    function exportDataAsJSON ()
    {
        if ( !data ) return;

        const filename = `${ data.county_name?.replace( /\s+/g, "_" ) || "county_data" }.json`;
        const jsonStr = JSON.stringify( data, null, 2 );
        const blob = new Blob( [ jsonStr ], { type: "application/json" } );
        const url = URL.createObjectURL( blob );

        const link = document.createElement( "a" );
        link.href = url;
        link.download = filename;
        document.body.appendChild( link );
        link.click();
        document.body.removeChild( link );
        URL.revokeObjectURL( url );
    }

    // Chart for Summary (Bar)
    const summaryBarData = {
        labels: [ "Goals", "BMPs" ],
        datasets: [
            {
                label: "Count",
                data: data.summary
                    ? [ data.summary.totalGoals ?? 0, data.summary.totalBMPs ?? 0 ]
                    : [ 0, 0 ],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.8)", // Goals
                    "rgba(75, 192, 192, 0.8)", // BMPs
                ],
            },
        ],
    };

    // Chart for Completion Rate (Doughnut)
    const completionRate = data.summary?.completionRate ?? 0;
    const completionDoughnutData = {
        labels: [ "Completed", "Remaining" ],
        datasets: [
            {
                data: [ completionRate, 100 - completionRate ],
                backgroundColor: [ "rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)" ],
                borderWidth: 1,
            },
        ],
    };

    // BMP Implementation Chart
    const bmpLabels = ( data.bmps ?? [] ).map( ( bmp ) => bmp.name );
    const bmpTargets = ( data.bmps ?? [] ).map( ( bmp ) => bmp.target ?? 0 );
    const bmpAchieved = ( data.bmps ?? [] ).map( ( bmp ) => bmp.achieved ?? 0 );

    const bmpStackedData = {
        labels: bmpLabels,
        datasets: [
            {
                label: "Achieved",
                data: bmpAchieved,
                backgroundColor: "rgba(75, 192, 192, 0.8)", // teal
            },
            {
                label: "Target",
                data: bmpTargets,
                backgroundColor: "rgba(54, 162, 235, 0.8)", // blue
            },
        ],
    };

    // Parse date ranges for implementation activities
    const implementationLabels = ( data.implementation ?? [] ).map( ( imp ) => imp.activity );
    const implementationStartYears = ( data.implementation ?? [] ).map( ( imp ) =>
    {
        const [ start ] = imp.date.split( "-" ).map( ( y ) => parseInt( y.trim(), 10 ) );
        return start;
    } );
    const implementationEndYears = ( data.implementation ?? [] ).map( ( imp ) =>
    {
        const parts = imp.date.split( "-" );
        return parts.length > 1 ? parseInt( parts[ 1 ].trim(), 10 ) : parseInt( parts[ 0 ].trim(), 10 );
    } );

    // Find earliest year to align bars
    const minYear = Math.min( ...implementationStartYears );
    const maxYear = Math.max( ...implementationEndYears );

    // Build stacked horizontal data
    const implementationDurations = implementationEndYears.map(
        ( end, i ) => end - implementationStartYears[ i ]
    );
    const implementationOffsets = implementationStartYears.map( ( start ) => start - minYear );

    const implementationTimelineData = {
        labels: implementationLabels,
        datasets: [
            {
                label: "Offset",
                data: implementationOffsets,
                backgroundColor: "rgba(0,0,0,0)", // transparent
            },
            {
                label: "Duration (years)",
                data: implementationDurations,
                backgroundColor: "rgba(255, 206, 86, 0.8)", // yellow
            },
        ],
    };

    // Monitoring Data
    const monitoringMetrics = ( data.monitoring ?? [] ).filter( m => m.value !== null );
    const monitoringLabels = monitoringMetrics.map(
        m => `${ m.metric } (${ m.unit })` // append unit directly to label
    );
    const monitoringValues = monitoringMetrics.map( m => m.value );
    const monitoringUnits = monitoringMetrics.map( m => m.unit );

    const monitoringData = {
        labels: monitoringLabels,
        datasets: [
            {
                label: "Value",
                data: monitoringValues,
                backgroundColor: "rgba(153, 102, 255, 0.8)", // purple
            },
        ],
    };

    // Outreach Audience Frequency
    const outreachAudienceCounts: Record<string, number> = {};
    ( data.outreach ?? [] ).forEach( ( o ) =>
    {
        const audience = o.audience || "Unknown";
        outreachAudienceCounts[ audience ] = ( outreachAudienceCounts[ audience ] || 0 ) + 1;
    } );
    const outreachAudienceLabels = Object.keys( outreachAudienceCounts );
    const outreachAudienceData = {
        labels: outreachAudienceLabels,
        datasets: [
            {
                label: "Number of Activities",
                data: outreachAudienceLabels.map( ( a ) => outreachAudienceCounts[ a ] ),
                backgroundColor: "#38bdf8", // sky-400
            },
        ],
    };


    return (
        <main className="text-white px-2 md:px-6">
            {/* Title */ }
            <button
                onClick={ exportDataAsJSON }
                className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
                Export Data as JSON
            </button>

            <h1 className={ `${ lusitana.className } mb-6 text-2xl` }>
                { data.county_name } - Overview
            </h1>

            {/* Overview and Geographic Areas side by side */ }
            <section className="flex flex-col md:flex-row gap-4 mb-6 w-full">
                <div className="flex-1 bg-gray-800 p-4 rounded-lg min-w-[250px]">
                    <h2 className="text-lg font-semibold mb-2">Overview</h2>
                    <p className="leading-relaxed">
                        { data.overview }
                    </p>
                </div>
                <div className="flex-1 bg-gray-800 p-4 rounded-lg min-w-[250px]">
                    <h2 className="text-lg font-semibold mb-2">Geographic Areas</h2>
                    { Array.isArray( data.geographic_areas ) && data.geographic_areas.length > 0 ? (
                        <ul>
                            { data.geographic_areas.map( ( area, idx ) => (
                                <li key={ idx } className="mb-2">
                                    <span className="font-semibold">{ area.name }</span>
                                    { area.type && (
                                        <span className="text-gray-400 text-sm"> — { area.type }</span>
                                    ) }
                                </li>
                            ) ) }
                        </ul>
                    ) : (
                        <p className="text-gray-400">No geographic areas available.</p>
                    ) }
                </div>
            </section>

            {/* Summary Charts */ }
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                {/* Goals & BMPs Count */ }
                <div className="bg-gray-800 p-2 rounded-lg">
                    <h3 className="mb-4 font-semibold">Goals & BMPs</h3>
                    <Bar
                        data={ summaryBarData }
                        options={ {
                            responsive: true,
                            plugins: { legend: { display: false } },
                        } }
                    />
                </div>

                {/* Completion Rate */ }
                <div className="bg-gray-800 p-2 rounded-lg">
                    <h3 className="mb-4 font-semibold">Completion Rate</h3>
                    <Doughnut
                        data={ completionDoughnutData }
                        options={ {
                            responsive: true,
                            plugins: {
                                legend: {
                                    labels: { color: "#fff" },
                                },
                            },
                        } }
                    />
                </div>
            </section>

            {/* Goals Kanban Board */ }
            <section className="bg-gray-800 p-2 rounded-lg mb-6 w-full">
                <h3 className="mb-4 font-semibold">Goals Status Board</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    { [ "planned", "in progress", "completed" ].map( ( status ) => (
                        <div key={ status } className="bg-gray-700 rounded-lg p-2">
                            <h4 className="capitalize font-bold mb-3 text-center text-white">
                                { status.replace( "-", " " ) }
                            </h4>
                            <div className="space-y-2">
                                { ( data.goals ?? [] )
                                    .filter(
                                        ( goal ) => goal.status?.toLowerCase() === status
                                    )
                                    .map( ( goal, idx ) => (
                                        <div
                                            key={ idx }
                                            className="bg-gray-600 p-2 rounded text-sm text-white"
                                        >
                                            <p className="font-semibold">{ goal.type }</p>
                                            <p className="text-xs italic">
                                                { goal.timeline || "No timeline" }
                                            </p>
                                            <p className="mt-1">{ goal.description }</p>
                                        </div>
                                    ) ) }
                                { !( data.goals ?? [] ).some(
                                    ( goal ) => goal.status?.toLowerCase() === status
                                ) && (
                                        <p className="text-xs italic text-gray-400">
                                            No goals in this status
                                        </p>
                                    ) }
                            </div>
                        </div>
                    ) ) }
                </div>
            </section>

            {/* BMPs Implementation */ }
            <section className="bg-gray-800 p-2 rounded-lg mb-6 w-full h-72 flex flex-col">
                <h3 className="mb-4 font-semibold">BMPs Implementation (Target vs Achieved)</h3>
                <Bar
                    data={ bmpStackedData }
                    options={ {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { labels: { color: "#fff" } },
                            tooltip: {
                                callbacks: {
                                    label: ( context ) => `${ context.dataset.label }: ${ context.parsed.y }`,
                                },
                            },
                        },
                        scales: {
                            x: {
                                stacked: true,
                                ticks: { color: "#fff" },
                            },
                            y: {
                                stacked: true,
                                ticks: { color: "#fff" },
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Target",
                                    color: "#fff",
                                    font: { size: 14 }
                                }
                            },
                        },
                    } }
                    height={ 220 }
                />
            </section>

            {/* Implementation Activities Timeline */ }
            <section className="bg-gray-800 p-2 rounded-lg mb-6 w-full h-72 flex flex-col">
                <h3 className="mb-4 font-semibold">Implementation Activities Timeline</h3>
                <Bar
                    data={ implementationTimelineData }
                    options={ {
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ( context ) =>
                                    {
                                        const activity = data.implementation[ context.dataIndex ];
                                        return `${ activity.date } — ${ activity.status }`;
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                stacked: true,
                                min: 0,
                                max: maxYear - minYear,
                                ticks: {
                                    color: "#fff",
                                    callback: ( value ) => `${ minYear + Number( value ) }`,
                                },
                            },
                            y: {
                                stacked: true,
                                ticks: { color: "#fff" },
                            },
                        },
                    } }
                    height={ 220 }
                />
            </section>

            {/* Monitoring & Outreach side by side */ }
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                {/* Monitoring Metrics */ }
                <div className="bg-gray-800 p-2 rounded-lg h-80 flex flex-col">
                    <h3 className="mb-4 font-semibold">Monitoring</h3>
                    <Bar
                        data={ monitoringData }
                        options={ {
                            indexAxis: "y",
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: ( context ) =>
                                        {
                                            const idx = context.dataIndex;
                                            return `${ context.parsed.x } ${ monitoringUnits[ idx ] }`;
                                        },
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    ticks: { color: "#fff" },
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: "Value",
                                        color: "#fff",
                                        font: { size: 14 },
                                    },
                                },
                                y: {
                                    ticks: {
                                        color: "#fff",
                                        callback: function ( value )
                                        {
                                            // Wrap long labels into multiple lines
                                            const label = this.getLabelForValue( Number( value ) );
                                            const words = label.split( " " );
                                            const lines = [];
                                            let currentLine = "";
                                            words.forEach( word =>
                                            {
                                                if ( ( currentLine + word ).length > 25 )
                                                {
                                                    lines.push( currentLine.trim() );
                                                    currentLine = word + " ";
                                                } else
                                                {
                                                    currentLine += word + " ";
                                                }
                                            } );
                                            if ( currentLine ) lines.push( currentLine.trim() );
                                            return lines;
                                        },
                                    },
                                },
                            },
                        } }
                        height={ 260 }
                    />
                </div>
                {/* Outreach */ }
                <div className="bg-gray-800 p-2 rounded-lg h-80 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">Outreach</h2>
                    <Bar
                        data={ outreachAudienceData }
                        options={ {
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Number of Activities',
                                        color: '#fff',
                                        font: { size: 14 }
                                    },
                                    ticks: { color: '#fff' }
                                },
                                y: {
                                    ticks: { color: '#fff' }
                                }
                            }
                        } }
                        height={ 260 }
                    />
                </div>
            </section>
        </main>
    );
}