'use client';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { getTags } from '@/lib/api/tags';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Kbd } from './ui/kbd';

const MAX_TAGS = 5;

function TagsInput() {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debouncedValue = useDebounce(value, 300);
  const { control } = useFormContext<CreateBlogInput>();

  const {
    data: suggestedTags,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['tags', debouncedValue],
    queryFn: () => getTags(debouncedValue),
    staleTime: 1 * 60 * 1000,
    enabled: !!debouncedValue,
  });

  return (
    <>
      <Controller
        name="tags"
        control={control}
        render={({ field, fieldState }) => {
          const tags = field.value;

          const handleRemoveTag = (tagToRemove: string) => {
            const filteredTags = tags.filter((tag) => tag !== tagToRemove);
            field.onChange(filteredTags);
          };

          const handleAddTag = (newTag: string) => {
            if (!tags.includes(newTag) && tags.length < MAX_TAGS) {
              field.onChange([...tags, newTag]);
              setValue('');
            }
          };
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="tags"
                onClick={() => {
                  inputRef.current?.focus();
                }}
                className="peer flex flex-wrap items-center justify-between gap-2"
              >
                Tags
                {tags.length > 0 && (
                  <Button
                    type="button"
                    variant={'ghost'}
                    size={'sm'}
                    className="text-foreground h-auto rounded px-2 text-xs font-normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange([]);
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </FieldLabel>
              <div
                tabIndex={-1}
                onFocus={() => inputRef.current?.focus()}
                aria-invalid={fieldState.invalid}
                className={cn(
                  'border-input dark:bg-input/30 hover:border-ring/70 peer-hover:border-ring/70 flex min-h-9 cursor-text flex-wrap items-start gap-2 rounded-md border bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow]',
                  'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[2px]',
                  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                )}
              >
                {tags.map((tag, index) => (
                  <Button
                    key={`${tag}-${index}`}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    size={'sm'}
                    className="h-6 rounded text-xs"
                  >
                    {tag}
                    <X />
                  </Button>
                ))}
                {tags.length !== 5 && (
                  <Command
                    shouldFilter={false}
                    defaultValue="-"
                    onKeyDown={(e) => {
                      // Backspace: Remove last tag if input is empty
                      if (
                        e.key === 'Backspace' &&
                        value === '' &&
                        tags.length > 0
                      ) {
                        e.preventDefault();
                        field.onChange(tags.slice(0, -1));
                        return;
                      }

                      // Enter: Check if user navigated to a suggestion
                      if (e.key === 'Enter' && value.trim() !== '') {
                        // Check if a real suggestion item is selected (not the hidden one)
                        const selectedItem = e.currentTarget.querySelector(
                          '[cmdk-item][aria-selected="true"]:not([data-value="-"])',
                        );

                        // If NO suggestion is selected, add the typed value
                        if (!selectedItem) {
                          e.preventDefault();
                          const normalizedValue = value.trim().toLowerCase();

                          if (
                            !tags.includes(normalizedValue) &&
                            tags.length < MAX_TAGS
                          ) {
                            handleAddTag(normalizedValue);
                          }
                        }
                        // If a suggestion IS selected, let cmdk's onSelect handle it
                      }

                      // Spacebar: prevent the default behaviour
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    loop
                    className="min-w-40 flex-1 rounded-none bg-transparent"
                  >
                    <CommandInput
                      id="tags"
                      name={field.name}
                      ref={(el) => {
                        inputRef.current = el;
                        field.ref(el);
                      }}
                      value={value}
                      onValueChange={setValue}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      showIcon={false}
                      wrapperClassName="border-none h-6 p-0"
                      placeholder="+ tag"
                      loading={isFetching}
                      className="lowercase"
                    />
                    <CommandList>
                      {/* Hidden item prevents auto-selection of first suggestion */}
                      <CommandItem value="-" className="hidden" />
                      {value.trim() !== '' &&
                        suggestedTags &&
                        suggestedTags.length > 0 && (
                          <CommandGroup className="border-input my-1 rounded-md border p-0">
                            {suggestedTags.map((tag) => (
                              <CommandItem
                                key={tag._id}
                                value={tag.name}
                                onSelect={(selectedValue) =>
                                  handleAddTag(selectedValue)
                                }
                                className="border-input rounded-none border-b font-medium last:border-none"
                              >
                                {tag.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                    </CommandList>
                  </Command>
                )}
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={
                    Array.isArray(fieldState.error)
                      ? fieldState.error
                      : [fieldState.error]
                  }
                />
              )}
              {isError && <FieldError>{error.message}</FieldError>}
              <FieldDescription>
                Type to search or add a tag. Press <Kbd>Enter</Kbd> to add your
                tag, or use <Kbd>↓</Kbd> to select from suggestions.{' '}
                {tags.length}/{MAX_TAGS} tags used
                {tags.length === MAX_TAGS && ' (Maximum reached)'}.
              </FieldDescription>
            </Field>
          );
        }}
      />
    </>
  );
}

export default TagsInput;
