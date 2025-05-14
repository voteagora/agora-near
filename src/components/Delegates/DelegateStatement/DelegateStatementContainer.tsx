"use client";

import { useNear } from "@/contexts/NearContext";
import { useDelegateStatementStore } from "@/stores/delegateStatement";
import { useEffect } from "react";
import DelegateStatement from "./DelegateStatement";

interface Props {
  statement: string;
  address: string;
}

export default function DelegateStatementContainer({
  statement,
  address,
}: Props) {
  const { signedAccountId } = useNear();
  const isConnected = !!signedAccountId;

  const showSuccessMessage = useDelegateStatementStore(
    (state) => state.showSaveSuccess
  );
  const setSaveSuccess = useDelegateStatementStore(
    (state) => state.setSaveSuccess
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      setSaveSuccess(false);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setSaveSuccess]);

  return (
    <>
      {showSuccessMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
          role="alert"
        >
          <p className="font-bold">Statement Saved</p>
          <p>Nice! Thank you for telling the community what you believe in.</p>
        </div>
      )}
      {!statement && (
        <div className="p-8 text-center text-secondary align-middle bg-wash rounded-xl">
          <p className="break-words">No delegate statement for {address}</p>
          {isConnected && signedAccountId === address && (
            <p className="my-3">
              <a
                rel="noopener"
                target="_blank"
                className="underline"
                href="/delegates/create"
              >
                Create your delegate statement
              </a>
            </p>
          )}
        </div>
      )}

      {statement && <DelegateStatement statement={statement} />}
    </>
  );
}
