'use client';

import TagsInput from '@/components/TagsInput';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { generateSlug } from '@/lib/utils';
import { CategoryListItem } from '@/types/category.types';
import { AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useBlogData } from './BlogForm';

function EditorSidebar({ categories }: { categories: CategoryListItem[] }) {
  const { control } = useFormContext<CreateBlogInput>();
  const blogData = useBlogData();

  const isSlugLocked = !!blogData?.publishedAt;

  return (
    <div className="px-4 py-4 xl:py-0">
      <FieldSet>
        <FieldLegend className="hidden text-2xl xl:block">
          Post Settings
        </FieldLegend>
        <FieldSeparator className="hidden xl:block" />
        <FieldGroup>
          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
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
              <Field>
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
              <Field>
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

          {/* Slug */}
          <Controller
            name="slug"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  URL slug{' '}
                  {isSlugLocked && (
                    <Badge variant={'secondary'} className="rounded">
                      locked
                    </Badge>
                  )}
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                    {...field}
                    onBlur={(e) => {
                      const slugified = generateSlug(e.target.value);
                      field.onChange(slugified);
                      field.onBlur();
                    }}
                    placeholder="your-post-slug"
                    autoComplete="off"
                    readOnly={isSlugLocked}
                    className={isSlugLocked ? 'cursor-not-allowed' : ''}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  Generated from your title. A unique suffix will be appended if
                  this slug is already in use.
                </FieldDescription>

                <Alert variant={isSlugLocked ? 'info' : 'warning'}>
                  {isSlugLocked ? <InfoIcon /> : <AlertTriangleIcon />}
                  <AlertTitle className="text-sm font-normal">
                    {isSlugLocked
                      ? 'This post has already been published — the slug is now locked to preserve existing links.'
                      : 'The slug is generated from your title. Once published, it will be locked to keep links stable.'}
                  </AlertTitle>
                </Alert>
              </Field>
            )}
          />

          {/* Status */}
          <Controller
            control={control}
            name="status"
            render={({
              field: { name, value, onChange, onBlur, ref, disabled },
              fieldState,
            }) => (
              <Field>
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
                    <SelectItem value="draft">Save as Draft</SelectItem>
                    <SelectItem value="published">Publish</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldDescription>
                  Choose whether to save as a draft or publish your post.
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
              <Field orientation="horizontal">
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
