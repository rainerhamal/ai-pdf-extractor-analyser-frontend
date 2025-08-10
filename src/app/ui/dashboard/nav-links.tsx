'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { DocumentTextIcon, ChartBarIcon, } from "@heroicons/react/16/solid";

const navLinks = [
    { name: "Summary", href: "/dashboard/", icon: DocumentTextIcon },
    { name: "Charts", href: "/dashboard/charts", icon: ChartBarIcon }
];

export default function NavLinks ( { onOpenUploadModal }: { onOpenUploadModal?: () => void } )
{
    const pathname = usePathname();

    return (
        <>
            { navLinks.map( ( link ) =>
            {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={ link.name }
                        href={ link.href }
                        className={ clsx(
                            "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            pathname.replace( /\/$/, '' ) === link.href.replace( /\/$/, '' )
                                ? 'bg-cyan-900/50 text-amber-600'
                                : "text-amber-300 hover:bg-gray-100/50 hover:text-amber-500"
                        ) }
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{ link.name }</p>

                    </Link>
                )
            } ) }
            <div className="flex gap-2 ml-2">
                <button
                    type="button"
                    onClick={ onOpenUploadModal }
                    className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                    <span className="hidden md:block">Upload New PDF</span>
                </button>
            </div>
        </>
    )
}