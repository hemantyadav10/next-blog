'use client';

import TagsInput from '@/components/TagsInput';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryListItem } from '@/types/category.types';
import { Controller, useFormContext } from 'react-hook-form';

function EditorSidebar({ categories }: { categories: CategoryListItem[] }) {
  const { control } = useFormContext();

  return (
    <div className="px-4 py-8 lg:px-8">
      <FieldSet>
        <FieldLegend className="hidden text-2xl lg:block">
          Post Settings
        </FieldLegend>
        <FieldSeparator className="hidden lg:block" />
        <FieldGroup>
          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                    placeholder="Summarize your post in a few sentences..."
                    {...field}
                    rows={3}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  A short summary for previews and blog cards (300-500
                  characters).
                </FieldDescription>
              </Field>
            )}
          />

          {/* Meta Description */}
          <Controller
            name="metaDescription"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  SEO Description (Optional)
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Write a short description for search engines..."
                    {...field}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  Optional. Used by search engines (150-160 chars). If left
                  empty, we&apos;ll reuse your post description.
                </FieldDescription>
              </Field>
            )}
          />

          {/* Category */}
          <Controller
            name="categoryId"
            control={control}
            render={({
              field: { name, value, onChange, onBlur, ref, disabled },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>Category</FieldLabel>
                <Select name={name} value={value} onValueChange={onChange}>
                  <SelectTrigger
                    id={name}
                    aria-invalid={fieldState.invalid}
                    onBlur={onBlur}
                    ref={ref}
                    disabled={disabled}
                  >
                    <SelectValue placeholder="Choose a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  Select the main category for your post.
                </FieldDescription>
              </Field>
            )}
          />

          {/* Tags */}
          <TagsInput />

          {/* Status */}
          <Controller
            control={control}
            name="status"
            render={({
              field: { name, value, onChange, onBlur, ref, disabled },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>Status</FieldLabel>
                <Select name={name} value={value} onValueChange={onChange}>
                  <SelectTrigger
                    id={name}
                    aria-invalid={fieldState.invalid}
                    onBlur={onBlur}
                    ref={ref}
                    disabled={disabled}
                  >
                    <SelectValue placeholder="Select post status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  Select the status of your post.
                </FieldDescription>
              </Field>
            )}
          />

          {/* Allow comments */}
          <Controller
            name="isCommentsEnabled"
            control={control}
            render={({
              field: { name, value, onChange, onBlur, ref, disabled },
              fieldState,
            }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  id={name}
                  name={name}
                  checked={value}
                  onCheckedChange={onChange}
                  aria-invalid={fieldState.invalid}
                  ref={ref}
                  onBlur={onBlur}
                  disabled={disabled}
                />
                <FieldContent>
                  <FieldLabel htmlFor={name} className="font-normal">
                    Allow comments
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Readers can share their thoughts below your post.
                  </FieldDescription>
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </div>
  );
}

export default EditorSidebar;
