'use client';

import SideNav from "../../ui/dashboard/sidenav";
import UploadModal from "../../ui/uploadModal";
import { useState } from "react";
import { FileIdContext } from "../../ui/fileIdContext";

export default function Layout ( { children }: { children: React.ReactNode; } )
{
    const [ isUploadOpen, setIsUploadOpen ] = useState( false );
    // const [ fileId, setFileId ] = useState<string | null>( null );
    const handleOpenUploadModal = () => setIsUploadOpen( true );

    // const handleNewUpload = () =>
    // {
    //     // setFileId( newFileId );
    //     setIsUploadOpen( false );
    // }

    return (
        // <FileIdContext.Provider value={ fileId }>
            <div className="flex min-h-screen flex-col p-6 bg-gray-900">
                <div className="flex h-20 shrink-0 items-end rounded-lg bg-gray-700/25 p-4 md:h-20">
                    <SideNav onOpenUploadModal={ handleOpenUploadModal } />
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                    { children }
                    <UploadModal
                        isOpen={ isUploadOpen }
                        onClose={ () => setIsUploadOpen( false ) }
                        // onUploadComplete={ handleNewUpload }
                    />
                </div>
            </div>
        // </FileIdContext.Provider>
    );
}