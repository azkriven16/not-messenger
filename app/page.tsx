import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="flex items-center justify-between p-4 md:p-6">
                <Logo />
                <ModeToggle />
            </nav>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 space-y-6 md:pr-12">
                    <h1 className="text-4xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        A place for meaningful conversations
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Connect with your friends and family, build your
                        community, and deepen your interests.
                    </p>
                    <Button
                        asChild
                        className="w-full h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white"
                    >
                        <Link href="/dashboard">Sign In</Link>
                    </Button>
                </div>
                <div className="w-full md:w-1/2 mt-12 md:mt-0">
                    <Image
                        src="/hero.png"
                        alt="App Interface"
                        width={400}
                        height={600}
                        className="w-full h-auto"
                    />
                </div>
            </main>
        </div>
    );
}
