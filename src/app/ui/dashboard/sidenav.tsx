'use client';

import NavLinks from "./nav-links";
import { useState } from "react";
import UploadModal from "../uploadModal";

interface SideNavProps {
    onOpenUploadModal: () => void;
}

export default function SideNav ({ onOpenUploadModal }: SideNavProps)
{
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <div className="flex flex-row items-center justify-center h-full">
                <NavLinks onOpenUploadModal={onOpenUploadModal}/>
            </div>
        </div>
    );
}