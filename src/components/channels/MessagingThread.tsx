import { Phone, Video, User, CheckCheck, Smile, Paperclip, Mic } from "lucide-react";
import type { Thread } from "@/content/channelDemos";
import { cn } from "@/lib/cn";

type Props = {
  thread: Thread;
};

// WhatsApp-style chat. Business POV: ANNA's replies are the outgoing (right,
// green) messages; the customer's messages are incoming (left, white).
export function MessagingThread({ thread }: Props) {
  const lastTurn = thread[thread.length - 1];
  const meta = lastTurn?.meta;

  return (
    <div
      aria-label="WhatsApp conversation"
      className="mx-auto max-w-md overflow-hidden rounded-2xl border border-sage/30 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <User className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-tight">New enquiry</p>
          <p className="text-[11px] leading-tight text-white/70">online</p>
        </div>
        <Video className="h-5 w-5 text-white/80" aria-hidden="true" />
        <Phone className="h-5 w-5 text-white/80" aria-hidden="true" />
      </div>

      {/* Chat body */}
      <ol
        role="list"
        aria-label="Booking conversation"
        className="flex flex-col gap-1.5 bg-[#ece5dd] px-3 py-4"
      >
        {thread.map((turn, i) => {
          const isCaller = turn.from === "caller";
          const bubbleRole = isCaller ? "caller-bubble" : "anna-bubble";
          const speakerLabel = isCaller ? "Customer" : "ANNA";
          const time = `09:${41 + i}`;
          return (
            <li key={i} className={cn("flex", isCaller ? "justify-start" : "justify-end")}>
              <div
                data-role={bubbleRole}
                aria-label={`${speakerLabel}: ${turn.text}`}
                className={cn(
                  "relative max-w-[80%] rounded-lg px-2.5 py-1.5 text-sm leading-snug text-[#111b21] shadow-sm",
                  isCaller ? "mr-auto rounded-tl-sm bg-white" : "ml-auto rounded-tr-sm bg-[#dcf8c6]"
                )}
              >
                <span>{turn.text}</span>
                <span className="float-right ml-2 mt-1 flex translate-y-0.5 items-center gap-0.5 text-[10px] text-[#667781]">
                  {time}
                  {!isCaller && <CheckCheck className="h-3 w-3 text-[#34b7f1]" aria-hidden="true" />}
                </span>
              </div>
            </li>
          );
        })}
        {meta && (
          <li className="mt-1 flex justify-center">
            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] text-[#54656f]">
              <span className="sr-only">Status: </span>
              {meta}
            </span>
          </li>
        )}
      </ol>

      {/* Decorative input bar */}
      <div aria-hidden="true" className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-[#8696a0]">
          <Smile className="h-4 w-4" />
          <span>Message</span>
          <Paperclip className="ml-auto h-4 w-4" />
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075e54] text-white">
          <Mic className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
