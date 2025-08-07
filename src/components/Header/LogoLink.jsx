// import { AgoraIcon } from "@/assets/AgoraIcon";
import Tenant from "@/lib/tenant/tenant";
import Image from "next/image";
import Link from "next/link";

export default function LogoLink() {
  const { ui, isProd } = Tenant.current();

  return (
    <Link href="/" className="flex flex-row justify-between w-full">
      <div className="gap-2 h-full flex flex-row items-center w-full">
        {/* <AgoraIcon
          className="hidden sm:block w-[20px] h-[20px]"
        /> */}
        {/* <div className="h-3 w-[2px] bg-line rounded-full hidden sm:block"></div> */}
        <Image
          src="/assets/icons/nearDelegateAvatar.svg"
          alt="logo"
          width="40"
          height="40"
          className="h-[40px] w-auto ml-1"
        />
        <span className="hidden sm:block font-medium text-primary">{`${ui.title}`}</span>
        {!isProd && (
          <>
            <div className="h-3 w-[2px] bg-line rounded-full hidden sm:block"></div>
            <span className="hidden sm:block font-semibold text-primary bg-tertiary/10 px-1.5 py-0.5 rounded-lg text-xs border border-line">
              Test contracts mode
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
