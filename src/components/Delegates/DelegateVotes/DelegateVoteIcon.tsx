import {
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";

function DelegateVoteIcon({ support }: { support: string }) {
  if (support === "FOR")
    return (
      <span className="h-5 w-5 flex items-center justify-center rounded-full bg-green-600 self-start">
        <CheckIcon className="h-3 w-3 text-neutral" />
      </span>
    );
  if (support === "AGAINST")
    return (
      <span className="h-5 w-5 flex items-center justify-center rounded-full bg-red-600 self-start">
        <XMarkIcon className="h-3 w-3 text-neutral" />
      </span>
    );
  if (support === "ABSTAIN")
    return (
      <span className="h-5 w-5 flex items-center justify-center rounded-full bg-black self-start">
        <EllipsisVerticalIcon className="h-3 w-3 text-neutral" />
      </span>
    );

  return <></>;
}

export default DelegateVoteIcon;
