import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getConversation = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((user) => user.eq(user.field("userId"), args.userId))
            .first();

        if (!user) {
            return [];
        }

        const conversations = await ctx.db
            .query("conversations")
            .filter((q) =>
                q.or(
                    q.eq(q.field("participantOne"), user._id),
                    q.eq(q.field("participantTwo"), user._id)
                )
            )
            .collect();

        const conversationsWithDetails = await Promise.all(
            conversations.map(async (conv) => {
                const otherParticipantId =
                    conv.participantOne === user._id
                        ? conv.participantTwo
                        : conv.participantTwo;

                const otherUser = await ctx.db.get(otherParticipantId);
                const lastMessage = conv.lastMessageId
                    ? await ctx.db.get(conv.lastMessageId)
                    : null;

                return {
                    id: conv._id,
                    name: otherUser?.name ?? "Unknown",
                    chatImage: otherUser?.profileImage,
                    lastMessage: lastMessage?.content ?? "",
                    time: formatChatTime(new Date(conv.updatedAt)),
                    unread: 0, // You can implement unread count logic here
                    type: lastMessage?.type,
                };
            })
        );
        return conversationsWithDetails.sort(
            (a: any, b: any) => b.time - a.time
        );
    },
});

export const createOrGetConversation = mutation({
    args: {
        participantUserId: v.string(),
        currentUserId: v.string(),
    },
    handler: async (ctx, args) => {
        // Get both users' Convex IDs from their Clerk IDs

        const currentUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("userId"), args.currentUserId))
            .first();

        const otherUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("userId"), args.participantUserId))
            .first();

        if (!currentUser || !otherUser) {
            throw new Error("User not found");
        }

        const existingConversation = await ctx.db
            .query("conversations")
            .filter((conv) =>
                conv.or(
                    conv.and(
                        conv.eq(conv.field("participantOne"), currentUser._id),
                        conv.eq(conv.field("participantTwo"), otherUser._id)
                    ),
                    conv.and(
                        conv.eq(conv.field("participantOne"), otherUser._id),
                        conv.eq(conv.field("participantTwo"), currentUser._id)
                    )
                )
            )
            .first();

        if (existingConversation) {
            return existingConversation?._id;
        }

        const conversationId = await ctx.db.insert("conversations", {
            participantOne: currentUser._id,
            participantTwo: otherUser._id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return conversationId;
    },
});

const formatChatTime = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
        // Today: show time only
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } else if (date.toDateString() === yesterday.toDateString()) {
        // Yesterday
        return "Yesterday";
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        // Within last week: show day name
        return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
        // Older: show date
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }
};
