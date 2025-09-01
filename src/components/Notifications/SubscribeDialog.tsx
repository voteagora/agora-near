"use client";

import { createDelegateStatement } from "@/lib/api/delegates/requests";
import { useDelegateProfile } from "@/hooks/useDelegateProfile";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNear } from "@/contexts/NearContext";
import { Button } from "../ui/button";
import EnvelopeBottom from "./DialogImage/EnvelopeBottom";
import EnvelopePaper from "./DialogImage/EnvelopePaper";
import EnvelopeTop from "./DialogImage/EnvelopeTop";
import StarIcon from "./DialogImage/Star";
import Link from "next/link";

const HeroImage = ({ isHovering }: { isHovering: boolean }) => {
  return (
    <div className="flex items-center gap-2 bg-tertiary/5 rounded-lg relative overflow-y-hidden">
      <div className="absolute w-full h-full bg-[url('/images/grid.svg')]"></div>
      <StarIcon
        className={`text-brandPrimary absolute top-[40px] left-[45px] transition-all duration-500 ${
          isHovering ? "rotate-[20deg] scale-150" : "rotate-[30deg] scale-125"
        }`}
      />
      <StarIcon
        className={`text-brandPrimary absolute top-[40px] right-[45px] transition-all duration-500 ${
          isHovering ? "rotate-[-20deg] scale-150" : "rotate-[-30deg] scale-125"
        }`}
      />
      <StarIcon
        className={`text-secondary absolute bottom-[40px] left-[55px] transition-all duration-500 ${
          isHovering ? "rotate-[-20deg] scale-100" : "rotate-[-30deg] scale-95"
        }`}
      />
      <StarIcon
        className={`text-secondary absolute bottom-[40px] right-[55px] transition-all duration-500 ${
          isHovering ? "rotate-[20deg] scale-100" : "rotate-[30deg] scale-95"
        }`}
      />
      <div className="mt-2 relative block h-[200px] w-[204px] mx-auto mb-[-50px]">
        <EnvelopeTop className="absolute bottom-0" />
        <EnvelopePaper
          className={`absolute bottom-0 left-4 transition-all ${
            isHovering ? "bottom-[-8px] duration-500" : "bottom-2 duration-300"
          }`}
        />
        <EnvelopeBottom className="text-brandPrimary absolute bottom-0" />
      </div>
    </div>
  );
};

const SubscribeDialog = ({
  closeDialog,
  type,
}: {
  closeDialog: () => void;
  type: "root" | "vote";
}) => {
  const { signedAccountId, signMessage, networkId } = useNear();
  const [isHovering, setIsHovering] = useState(false);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const { data, refetch } = useDelegateProfile({
    accountId: signedAccountId,
  });
  const existingEmail = data?.email;
  const hasEmail = existingEmail && existingEmail !== "";

  if (!signedAccountId) {
    closeDialog();
    return null;
  }

  const updateNotificationPreferences = async (
    wantsNotifications: "true" | "prompt"
  ) => {
    if (!signMessage) {
      throw new Error("signMessage not available");
    }

    const emailToUse = existingEmail || email;
    if (!emailToUse) {
      throw new Error("Email is required");
    }

    const body = {
      address: signedAccountId,
      email: emailToUse,
      twitter: data?.twitter || "",
      discord: data?.discord || "",
      warpcast: data?.warpcast || "",
      topIssues: data?.topIssues || [],
      agreeCodeConduct: true,
      statement: data?.statement || "",
      notification_preferences: {
        wants_proposal_created_email: wantsNotifications,
        wants_proposal_ending_soon_email: wantsNotifications,
      },
    };

    const serializedBody = JSON.stringify(body, undefined, "\t");
    const signature = await signMessage({ message: serializedBody });

    if (!signature) {
      throw new Error("Signature failed");
    }

    await createDelegateStatement(
      {
        data: body,
        message: serializedBody,
        signature: signature.signature,
        publicKey: signature.publicKey,
      },
      networkId
    );
  };

  return (
    <div>
      <HeroImage isHovering={isHovering} />
      <h2 className="text-primary text-xl font-bold mt-4">
        Get proposal updates in your inbox!
      </h2>
      <p className="text-secondary mt-2 font-normal">
        Receive email notifications when proposals go live, and when the voting
        window is ending soon.
      </p>
      {!hasEmail && (
        <div className="flex flex-col gap-1 w-full mt-4">
          <label className="text-xs font-semibold secondary">
            Email address
          </label>
          <input
            type="text"
            className="border bg-wash border-line placeholder:text-tertiary text-primary p-2 rounded-lg w-full"
            value={email}
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}
      <div className="flex flex-col items-center gap-1 mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            localStorage.setItem(
              `agora-email-subscriptions--${type}`,
              "prompted"
            );
            try {
              closeDialog();
              toast.success(
                <span>
                  No problem! We won&apos;t bug you again. You can change your
                  preferences in{" "}
                  <Link
                    className="underline"
                    href={`/delegates/${signedAccountId}`}
                  >
                    your profile
                  </Link>
                </span>
              );
              await updateNotificationPreferences("prompt");
              await refetch();
            } catch (error) {
              console.error(error);
            }
          }}
        >
          No thanks
        </Button>
        <Button
          disabled={!(existingEmail || email)}
          className="w-full"
          onMouseOver={() => {
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
          onClick={async () => {
            try {
              await updateNotificationPreferences("true");
              await refetch();
              closeDialog();
              toast.success("Preferences saved.");
            } catch (error) {
              toast.error("Error updating notification preferences.");
              console.error(error);
            }
          }}
        >
          Notify me
        </Button>
      </div>
    </div>
  );
};

export default SubscribeDialog;
