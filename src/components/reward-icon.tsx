import type { RewardCode } from '../lib/game-data';
import { rewardDetails } from '../lib/game-data';

type RewardIconProps = {
  code: RewardCode;
  labelled?: boolean;
};

export function RewardIcon({ code, labelled = true }: RewardIconProps) {
  const reward = rewardDetails[code];

  return (
    <span
      aria-label={labelled ? reward.name : undefined}
      aria-hidden={labelled ? undefined : 'true'}
      class={`reward ${reward.className}`}
      role={labelled ? 'img' : undefined}
      title={labelled ? reward.name : undefined}
    >
      <svg aria-hidden="true" viewBox="0 0 32 32">
        {code === 'Y' && <path d="M10 5h12v4H10zM11 9v13M16 9v13M21 9v13M8 22h16v4H8z" />}
        {code === 'B' && (
          <>
            <circle cx="16" cy="10" r="7" />
            <circle cx="16" cy="10" r="3" />
            <path d="M12 16v5l-3 4h14l-3-4v-5" />
          </>
        )}
        {code === 'G' && (
          <>
            <path d="M11 4c0 4 10 4 10 8s-10 4-10 8 10 4 10 8M21 4c0 4-10 4-10 8s10 4 10 8-10 4-10 8" />
            <path d="M12 8h8M12 16h8M12 24h8" />
          </>
        )}
        {code === 'R' && (
          <>
            <path d="m16 3 3 5-2 9h-2L13 8l3-5ZM9 17h14l-3 4h-8l-3-4Z" />
            <path d="M14 21v5h4v-5M12 28h8" />
          </>
        )}
        {code === 'P' && (
          <>
            <path d="M16 3v26M9 9h14M7 17h18M10 25h12" />
            <circle cx="16" cy="9" r="4" />
            <circle cx="16" cy="17" r="6" />
            <circle cx="16" cy="25" r="4" />
          </>
        )}
      </svg>
    </span>
  );
}
