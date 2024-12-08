import { Laptop } from "lucide-react";
import SearchComponent from "./_components/search";
import Logo from "@/components/logo";

export default function Dashboard() {
    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center bg-muted text-center">
                <div className="max-w-md flex items-center justify-center flex-col space-y-2">
                    <Logo />

                    <p className="text-[#8696A0]">Start a conversation.</p>
                    <SearchComponent onSidebar={false} />
                </div>
            </div>
        </>
    );
}
