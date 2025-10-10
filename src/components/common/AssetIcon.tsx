import Image, { StaticImageData } from "next/image";

export const AssetIcon = ({
  icon,
  name,
  size = "20px",
}: {
  icon?: string | StaticImageData;
  name: string;
  size?: string;
}) => {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-gray-300"
      style={{ width: size, height: size }}
    >
      {icon ? (
        <Image
          src={icon}
          alt={name}
          fill
          sizes={size}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-white bg-gray-400">
          {name?.[0] ?? ""}
        </div>
      )}
    </div>
  );
};
