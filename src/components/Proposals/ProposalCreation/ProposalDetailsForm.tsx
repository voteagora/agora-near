"use client";

import { HStack, VStack } from "@/components/Layout/Stack";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import InputBox from "@/components/shared/InputBox";
import Markdown from "@/components/shared/Markdown/Markdown";
import { useFormContext } from "react-hook-form";
import { FormValues } from "./CreateProposalForm";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

export const tipTextStyle = "text-sm text-secondary";
const errorTextStyle = "text-sm text-negative mt-1";

type DisplayMode = "write" | "preview";

const displayModeSelectorStyles =
  "cursor-pointer text-sm font-medium text-tertiary py-1 px-3 rounded-full hover:bg-wash hover:text-primary";

const displayModeSelectorSelectedStyles = "bg-wash text-primary rounded-full";

export default function ProposalDetailsForm() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();
  const descriptionValue = watch("description");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("write");

  return (
    <VStack className="mt-4">
      <div className="flex flex-col gap-4">
        <h4 className="text-xs font-semibold mb-1 text-secondary">Title</h4>
        <InputBox
          placeholder={"I'd like to propose..."}
          value={watch("title")}
          onChange={(next) => setValue("title", next)}
          error={!!errors.title}
          required
        />
        {errors.title && (
          <p className={errorTextStyle}>{errors.title.message}</p>
        )}

        <HStack
          alignItems="items-baseline"
          justifyContent="justify-between"
          gap={4}
        >
          <h4 className="text-xs font-semibold mb-1 text-secondary">
            Proposal
          </h4>

          <Tab.Group
            manual
            selectedIndex={(() => {
              switch (displayMode) {
                case "preview":
                  return 1;

                case "write":
                  return 0;
              }
            })()}
            onChange={(index) => {
              switch (index) {
                case 0:
                  setDisplayMode("write");
                  return;

                case 1:
                  setDisplayMode("preview");
                  return;
              }
            }}
          >
            <Tab.List>
              <HStack gap={1}>
                <Tab className="outline-none">
                  {({ selected }) => (
                    <div
                      className={`
                      ${displayModeSelectorStyles}${" "}
                      ${selected && displayModeSelectorSelectedStyles}
                    `}
                    >
                      Write
                    </div>
                  )}
                </Tab>

                <Tab className="outline-none">
                  {({ selected }) => (
                    <div
                      className={`
                      ${displayModeSelectorStyles}${" "}
                      ${selected && displayModeSelectorSelectedStyles}
                    `}
                    >
                      Preview
                    </div>
                  )}
                </Tab>
              </HStack>
            </Tab.List>
          </Tab.Group>
        </HStack>

        {displayMode === "write" && (
          <>
            <textarea
              className={`text-tertiary p-4 rounded-md outline-none w-full min-h-[16rem] border ${errors.description ? "border-negative" : "border-line"}`}
              value={descriptionValue}
              onChange={(e) => setValue("description", e.target.value)}
              placeholder="I'm a proposal body, and I like markdown formatting..."
              required
            />
            {errors.description && (
              <p className={errorTextStyle}>{errors.description.message}</p>
            )}
          </>
        )}

        {displayMode === "preview" && <Markdown content={descriptionValue} />}
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold mb-1 text-secondary">Link</h4>
          <Link
            href="/info?item=proposal-process"
            target="_blank"
            className="text-xs text-primary hover:text-secondary underline flex items-center gap-1"
          >
            Forum post required{" "}
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>
        <InputBox
          placeholder={"https://gov.near.org/your-proposal"}
          value={watch("link")}
          onChange={(next) => setValue("link", next)}
          error={!!errors.link}
          required
        />
        {errors.link && (
          <div className={errorTextStyle}>
            {errors.link.message}
            {errors.link.message?.includes("https://gov.near.org/") && (
              <div className="mt-1">
                <Link
                  href="/info?item=proposal-process"
                  target="_blank"
                  className="text-primary hover:text-secondary underline flex items-center gap-1"
                >
                  Learn more <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </VStack>
  );
}
