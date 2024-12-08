"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { MoreVertical, Search, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface SideBarProps {
    preloadedUserInfo: Preloaded<typeof api.users.readUser>;
    preloadedConversations: Preloaded<typeof api.chats.getConversation>;
}

export default function Sidebar({
    preloadedConversations,
    preloadedUserInfo,
}: SideBarProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const { signOut } = useAuth();
    const router = useRouter();
    const userInfo = usePreloadedQuery(preloadedUserInfo);
    const conversations = usePreloadedQuery(preloadedConversations);

    const filteredConversations = useMemo(() => {
        if (!searchQuery) return conversations;

        return conversations
            ?.filter((chat) => {
                const matchesName = chat.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                const matchesMessage = chat.lastMessage
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                return matchesName || matchesMessage;
            })
            .sort((a, b) => {
                const aNameMatch = a.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                const bNameMatch = b.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

                if (aNameMatch && !bNameMatch) return -1;
                if (!aNameMatch && bNameMatch) return 1;

                return 0;
            });
    }, [searchQuery, conversations]);

    return (
        <div className=" m-5 w-[70px] md:w-[380px] lg:w-1/4 h-screen flex flex-col">
            {/* Header */}
            <div className="rounded-lg shrink-0 px-3 py-[18px] md:py-[14px] bg-muted dark:bg-[#202C33] flex justify-center md:justify-between items-center">
                <Link href="/profile">
                    <Avatar>
                        <AvatarImage
                            className="w-8 h-8 md:w-9 md:h-9 rounded-full"
                            src={userInfo?.profileImage}
                            alt="Your avatar"
                        />
                    </Avatar>
                </Link>
                <ModeToggle />
            </div>
        </div>
    );
}
