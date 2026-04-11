import { useState } from "react";
import { validateEmail } from "@/lib/vigoConfig";

export function useFormField(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const validate = (type = "text") => {
    if (!value.trim()) {
      setError("This field is required");
      return false;
    }
    if (type === "email" && !validateEmail(value)) {
      setError("Invalid email address");
      return false;
    }
    setError("");
    return true;
  };

  return { value, setValue, error, validate };
}

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateAll = (schema) => {
    const newErrors = {};
    Object.keys(schema).forEach((field) => {
      const rule = schema[field];
      const value = values[field];

      if (rule.required && !value?.toString().trim()) {
        newErrors[field] = `${rule.label || field} is required`;
      } else if (rule.type === "email" && value && !validateEmail(value)) {
        newErrors[field] = "Invalid email address";
      } else if (rule.minLength && value?.toString().length < rule.minLength) {
        newErrors[field] = `Minimum ${rule.minLength} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validateAll };
}