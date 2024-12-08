import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <header className="pt-5 flex justify-between items-center w-full max-w-sm">
                <Logo />
                <ModeToggle />
            </header>
            {children}
        </div>
    );
}
