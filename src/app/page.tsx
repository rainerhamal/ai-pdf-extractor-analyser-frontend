import Image from "next/image";
import UploadPdf from "./ui/uploadPdf";

export default function Home ()
{
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <UploadPdf/>
      {/* <nav className="flex h-20 shrink-0 items-end rounded-lg bg-neutral-900 p-4 md:h-20">
        <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      </nav> */}
      {/* <main className="flex grow flex-col gap-4 md:flex-row bg-neutral-900 mt-4 overflow rounded-lg">
        
      </main> */}
    </div>
  );
}
