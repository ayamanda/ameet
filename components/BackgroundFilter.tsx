// BackgroundFilters.tsx
import { useBackgroundFilters } from '@stream-io/video-react-sdk';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const BackgroundFilters = () => {
  const {
    isSupported,
    isReady,
    disableBackgroundFilter,
    applyBackgroundBlurFilter,
  } = useBackgroundFilters();

  if (!isSupported) {
    return <div>Background filters are not supported on this device</div>;
  }

  if (!isReady) {
    return <div>Loading background filters...</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
        <img src="/icons/blur.svg" alt="Blur" className="h-5 w-5 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
        <DropdownMenuItem onClick={disableBackgroundFilter}>
          Disable Filter
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-dark-1" />
        <DropdownMenuItem onClick={() => applyBackgroundBlurFilter('high')}>
          <div className="flex items-center gap-2">
            <img src="/icons/blur.svg" alt="Blur" className="h-4 w-4" />
            High Blur
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyBackgroundBlurFilter('medium')}>
          <div className="flex items-center gap-2">
            <img src="/icons/blur.svg" alt="Blur" className="h-4 w-4" />
            Medium Blur
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyBackgroundBlurFilter('low')}>
          <div className="flex items-center gap-2">
            <img src="/icons/blur.svg" alt="Blur" className="h-4 w-4" />
            Low Blur
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-dark-1" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};