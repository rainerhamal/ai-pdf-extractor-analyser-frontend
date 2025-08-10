import UploadPdf from "./uploadPdf";

type UploadModalProps = {
    // onUploadComplete: () => void;
    isOpen: boolean;
    onClose: () => void;
};

export default function UploadModal ( { isOpen, onClose }: UploadModalProps )
{
    if ( !isOpen ) return null;
    return (
        <div className="fixed inset-0 bg-gray-500/25 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-end">
                    <button onClick={ onClose } className="text-gray-400 hover:text-gray-600 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 2 } stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <UploadPdf
                    // onUploadComplete={ onUploadComplete }
                    redirectOnSuccess={ true }
                />
            </div>
        </div>
    )
}