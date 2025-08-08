import { lusitana } from "../ui/fonts";
import UploadModal from "../ui/uploadModal";
import { useFileId } from "../ui/fileIdContext";



export default function Page ()
{


    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard Page
            </h1>
        </main>
    );
}