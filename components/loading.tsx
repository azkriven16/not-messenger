"use client";

import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import Logo from "./logo";

export default function LoadingState() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 50); // Update every 50ms to complete in 5 seconds (50ms * 100 = 5000ms)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-sky-700">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <Logo />
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 text-foreground">
                            <Lock className="w-3 h-3" />
                            <span className="text-sm">
                                (NOT REALLY) End-to-end encrypted
                            </span>
                        </div>
                    </div>

                    <div className="w-64">
                        <Progress
                            value={progress}
                            className="h-1 bg-[#202C33]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
