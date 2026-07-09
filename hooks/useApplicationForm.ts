// hooks/useApplicationForm.ts

import { useState, useCallback, useMemo, useRef } from "react";
import type { JobApplication, ApplicationStatus, WorkType } from "@/types/job";
import { isValidUrl, isPastOrToday, isValidDate } from "@/lib/utils";

type FormValues = {
  company: string;
  role: string;
  location: string;
  workType: WorkType;
  salary: string;
  status: ApplicationStatus;
  appliedDate: string;
  url: string;
  contactName: string;
  contactEmail: string;
  notes: string;
  tags: string; // comma-separated string in the form
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface UseApplicationFormReturn {
  values: FormValues;
  errors: FormErrors;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  setFieldValue: (field: keyof FormValues, value: string) => void;
  handleSubmit: (
    onSubmit: (data: FormValues) => void
  ) => (e: React.FormEvent) => void;
  reset: () => void;
  isDirty: boolean;
}

function getDefaultValues(): FormValues {
  return {
    company: "",
    role: "",
    location: "",
    workType: "remote",
    salary: "",
    status: "saved",
    appliedDate: "",
    url: "",
    contactName: "",
    contactEmail: "",
    notes: "",
    tags: "",
  };
}

function applicationToFormValues(
  app: Partial<JobApplication>
): FormValues {
  return {
    company: app.company ?? "",
    role: app.role ?? "",
    location: app.location ?? "",
    workType: app.workType ?? "remote",
    salary: app.salary ?? "",
    status: app.status ?? "saved",
    appliedDate: app.appliedDate ?? "",
    url: app.url ?? "",
    contactName: app.contactName ?? "",
    contactEmail: app.contactEmail ?? "",
    notes: app.notes ?? "",
    tags: app.tags?.join(", ") ?? "",
  };
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.company.trim()) {
    errors.company = "Company name is required";
  } else if (values.company.trim().length < 2) {
    errors.company = "Company name must be at least 2 characters";
  }

  if (!values.role.trim()) {
    errors.role = "Role is required";
  } else if (values.role.trim().length < 2) {
    errors.role = "Role must be at least 2 characters";
  }

  if (values.url && !isValidUrl(values.url)) {
    errors.url = "Must be a valid URL (e.g. https://example.com)";
  }

  if (values.appliedDate) {
    if (!isValidDate(values.appliedDate)) {
      errors.appliedDate = "Must be a valid date";
    } else if (!isPastOrToday(values.appliedDate)) {
      errors.appliedDate = "Applied date cannot be in the future";
    }
  }

  const validStatuses: ApplicationStatus[] = [
    "saved",
    "applied",
    "phone-screen",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ];
  if (!validStatuses.includes(values.status)) {
    errors.status = "Invalid status";
  }

  return errors;
}

export function useApplicationForm(
  initialValues?: Partial<JobApplication>
): UseApplicationFormReturn {
  const initialRef = useRef(
    initialValues
      ? applicationToFormValues(initialValues)
      : getDefaultValues()
  );
  const defaultValues = initialRef.current;

  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const isDirty = useMemo(() => {
    return (Object.keys(values) as (keyof FormValues)[]).some(
      (key) => values[key] !== defaultValues[key]
    );
  }, [values, defaultValues]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear field error on change
      if (errors[name as keyof FormValues]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const setFieldValue = useCallback(
    (field: keyof FormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    (onSubmit: (data: FormValues) => void) =>
      (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm(values);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
        onSubmit(values);
      },
    [values]
  );

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
  }, [defaultValues]);

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    handleSubmit,
    reset,
    isDirty,
  };
}
