// src/components/dashboard/FeatureCard.tsx

import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function FeatureCard({ title, description, image, link }: FeatureCardProps) {
  return (
    <div className="p-4 @container">
      <div className="flex flex-col items-stretch justify-start rounded-lg @xl:flex-row @xl:items-start shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-[#FFFFFF]">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4 px-4">
          <p className="text-black text-lg font-bold leading-tight tracking-[-0.015em]">{title}</p>
          <div className="flex items-end gap-3 justify-between">
            <p className="text-[#6B6B6B] text-base font-normal leading-normal">{description}</p>
            <Link href={link}>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-black text-[#FFFFFF] text-sm font-medium leading-normal"
              >
                <span className="truncate">Aller à {title}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}