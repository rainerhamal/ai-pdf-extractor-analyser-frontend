"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UploadPdfProps
{
    onUploadComplete?: ( countyId: string ) => void; // for dashboard modal
    redirectOnSuccess?: boolean; // for homepage
}

type County = { id: string; county_name: string };

export default function UploadPdf ( { onUploadComplete, redirectOnSuccess = false }: UploadPdfProps )
{
    const router = useRouter();
    const [ isUploading, setIsUploading ] = useState( false );
    const [ file, setFile ] = useState<File | null>( null );
    const [ reportId, setReportId ] = useState<string | null>( null );
    const [ counties, setCounties ] = useState<County[]>( [] );
    const [ showCountyModal, setShowCountyModal ] = useState<boolean>( false );
    // Add a state for modal animation
    const [ modalVisible, setModalVisible ] = useState( false );

    const handleFileSelect = async ( selectedFile: File ) =>
    {
        if ( selectedFile.type !== "application/pdf" )
        {
            alert( "Please upload a valid PDF file." );
            return;
        }
        setFile( selectedFile );
        uploadFile( selectedFile );
    };

    const uploadFile = async ( file: File ) =>
    {
        setIsUploading( true );
        const formData = new FormData();
        formData.append( "file", file );

        try
        {
            // const response = await axios.post(
            //     `${ process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" }/api/upload`,
            //     formData,
            //     { headers: { "Content-Type": "multipart/form-data" } }
            // );
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if ( response.status !== 200 )
            {
                throw new Error( "Failed to upload file" );
            }

            const data = response.data;

            setReportId( data.reportId )

            console.log( "Upload response:", data );

            if ( data.status === "multiple_counties_found" )
            {
                setCounties( data.counties );
                setShowCountyModal( true );
            } else
            {
                setCounties( data.counties );
                handleSuccess( data.counties[ 0 ]?.id );;
            }
        } catch ( error )
        {
            console.error( "Error uploading file:", error );
            alert( "Failed to upload file. Please try again." );
        } finally
        {
            setIsUploading( false );
        }
    }

    const selectCounty = async ( county: County ) =>
    {
        try
        {

            handleSuccess( county.id );

        } catch ( error )
        {
            console.error( "Error selecting county:", error );
            alert( "Failed to select county. Please try again." );
        }
    }

    const handleSuccess = ( countyId: string ) =>
    {
        console.log( "File uploaded successfully with ID:", countyId );
        if ( redirectOnSuccess )
        {
            router.push( `/dashboard/${ countyId }` );
        } else if ( onUploadComplete )
        {
            onUploadComplete( countyId );
        }
    }

    // Show animation when modal is triggered
    useEffect( () =>
    {
        if ( showCountyModal )
        {
            setModalVisible( true );
        } else
        {
            setModalVisible( false );
        }
    }, [ showCountyModal ] );

    return (
        <>
            {/* County Selection Modal and overlay (global, covers viewport) */ }
            { showCountyModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-900/50" />
                    <div className={ `relative bg-white rounded-lg p-6 w-[36rem] h-[28rem] shadow-lg transition-all duration-200 ease-out z-50 ${ modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0' }` }>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-gray-900 text-2xl font-semibold">Select County</h2>
                            <button
                                onClick={ () => setShowCountyModal( false ) }
                                className="text-gray-900 hover:text-gray-600 focus:outline-none"
                                aria-label="Close county selection modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 2 } stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="mb-4 text-gray-700 text-left text-lg">
                            Multiple counties were detected in the document. Please select the correct county:
                        </p>
                        <div className="overflow-y-auto max-h-[18rem]">
                            { counties.map( ( county ) => (
                                <div key={ county.id }>
                                    <button
                                        className="w-full text-left p-2 text-lg hover:bg-gray-100 rounded"
                                        onClick={ () => selectCounty( county ) }
                                    >
                                        { county.county_name }
                                    </button>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </div>
            ) }
            <div
                className="w-full max-w-2xl min-h-[20rem] justify-center border-2 border-dashed border-amber-600 rounded-lg px-6 py-20 text-center relative overflow-visible"
                onDragOver={ e => { e.preventDefault(); e.stopPropagation(); } }
                onDrop={ e =>
                {
                    e.preventDefault();
                    e.stopPropagation();
                    const droppedFile = e.dataTransfer.files?.[ 0 ];
                    if ( droppedFile ) handleFileSelect( droppedFile );
                } }
            >
                { isUploading ? (
                    <p className="text-blue-500 font-semibold">Processing PDF...</p>
                ) : (
                    <>
                        <input
                            id="file-upload"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={ ( e ) =>
                            {
                                if ( e.target.files?.[ 0 ] ) handleFileSelect( e.target.files[ 0 ] );
                            } }
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="size-15 mb-2 text-amber-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                            </svg>
                            <span className="text-amber-800 font-semibold mb-2">Upload PDF</span>
                            <p className="text-amber-400">Drag and drop or select a PDF file to upload</p>
                        </label>
                    </>
                ) }
            </div>
        </>
    );
}