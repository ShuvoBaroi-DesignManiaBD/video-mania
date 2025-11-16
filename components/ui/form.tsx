"use client";

import * as React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(
  undefined
);

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const formContext = useFormContext();

  const name = fieldContext?.name;
  const fieldState = name
    ? formContext.getFieldState(name, formContext.formState)
    : { invalid: false };

  const id = name ? `${name}` : undefined;

  return {
    id,
    name,
    formItemId: id ? `${id}-form-item` : undefined,
    formMessageId: id ? `${id}-form-message` : undefined,
    fieldState,
  };
}

// Wraps react-hook-form provider so you can do: <Form {...form}> ... </Form>
export const Form = FormProvider;

interface FormFieldProps<TFieldValues extends Record<string, any>> {
  control: any;
  name: string;
  render: (props: any) => React.ReactNode;
}

export function FormField<TFieldValues extends Record<string, any>>(
  props: FormFieldProps<TFieldValues>
) {
  const { control, name, render } = props as any;
  return (
    <Controller
      control={control}
      name={name}
      render={(fieldProps) => (
        <FormFieldContext.Provider value={{ name }}>
          {render(fieldProps)}
        </FormFieldContext.Provider>
      )}
    />
  );
}

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
);
FormItem.displayName = "FormItem";

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
));
FormLabel.displayName = "FormLabel";

export const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
FormControl.displayName = "FormControl";

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { fieldState, formMessageId } = useFormField();
  const message = (fieldState as any)?.error?.message as string | undefined;
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm text-red-500", className)}
      {...props}
    >
      {children ?? message}
    </p>
  );
});
FormMessage.displayName = "FormMessage";
     