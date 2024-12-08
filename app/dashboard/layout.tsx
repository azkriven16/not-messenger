import { auth } from "@clerk/nextjs/server";
import React, { PropsWithChildren } from "react";
import ChatLayoutWrapper from "./_components/chat-layout-wrapper";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const { userId } = await auth();

    // user information
    const preloadedUserInfo = await preloadQuery(api.users.readUser, {
        userId: userId!,
    });

    // conversations + chats
    const preloadedConversations = await preloadQuery(
        api.chats.getConversation,
        {
            userId: userId!,
        }
    );

    return (
        <ChatLayoutWrapper
            preloadedConversations={preloadedConversations}
            preloadedUserInfo={preloadedUserInfo}
        >
            {children}
        </ChatLayoutWrapper>
    );
}
