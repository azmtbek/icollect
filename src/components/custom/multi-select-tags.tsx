import * as React from 'react';
import { cn } from '@/lib/utils';

import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export type OptionType = {
  [id: number]: {
    label: string;
    value: string;
    id: number;
  };
};

interface MultiSelectProps {
  options: OptionType;
  selected: number[];
  onChange: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}

// const selectMapper = (id,) => {

// };

function MultiSelectTags({
  options,
  selected,
  onChange,
  className,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: number) => {
    onChange(selected.filter((i) => i !== item));
    // setNewTags(newTags.filter((i) => i !== item));
  };
  // const select;

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${selected.length > 1 ? 'h-full' : 'h-10'
            }`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.map((item) => (
              <Badge
                variant="secondary"
                key={item}
                className="mr-1 mb-1 ring-1 ring-gray-400"
                onClick={() => handleUnselect(item)}
              >
                {options?.[item]?.value}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandList>
            <CommandInput placeholder="Search ..." />
            <CommandEmpty>No tag found. Create a tag in the next field.</CommandEmpty>
            {
              <CommandGroup className="max-h-64 overflow-auto">
                {Object.values(options).map((opt) => {
                  // const opt = Object.values(option)[0];
                  if (!opt) return;
                  return <CommandItem
                    key={opt.id}
                    onSelect={() => {
                      onChange(
                        selected.includes(opt.id)
                          ? selected.filter((item) => item !== opt.id)
                          : [...selected, opt.id]
                      );
                      setOpen(true);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.includes(opt.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {opt.label}
                  </CommandItem>;

                })}
              </CommandGroup>
            }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelectTags };
