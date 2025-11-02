"use client";

import { useEffect, useRef } from "react";
import { useToast } from "./toast-provider";

function getFieldLabel(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  // Try to get label from associated label element
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      return label.textContent?.trim() || '';
    }
  }

  // Try to get from name attribute
  if (input.name) {
    return input.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
  }

  // Try to get from placeholder
  if (input.getAttribute('placeholder')) {
    return input.getAttribute('placeholder') || '';
  }

  // Try to get from id
  if (input.id) {
    return input.id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
  }

  return 'This field';
}

function getErrorMessage(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  if (input.validity.valueMissing) {
    const fieldName = getFieldLabel(input);
    return `${fieldName} is required`;
  } else if (input.validity.typeMismatch) {
    if (input.type === 'email') {
      return "Please enter a valid email address";
    } else if (input.type === 'url') {
      return "Please enter a valid URL";
    }
    return "Please enter a valid value";
  } else if (input.validity.patternMismatch) {
    return input.title || input.getAttribute('data-pattern-error') || "Please match the required format";
  } else if (input.validity.tooShort) {
    const minLength = (input as HTMLInputElement | HTMLTextAreaElement).minLength ?? 0;
    return `Please enter at least ${minLength} characters`;
  } else if (input.validity.tooLong) {
    const maxLength = (input as HTMLInputElement | HTMLTextAreaElement).maxLength ?? 0;
    return `Please enter no more than ${maxLength} characters`;
  } else if (input.validity.rangeUnderflow) {
    const min = (input as HTMLInputElement).min ?? '';
    return `Value must be at least ${min}`;
  } else if (input.validity.rangeOverflow) {
    const max = (input as HTMLInputElement).max ?? '';
    return `Value must be at most ${max}`;
  } else if (input.validity.stepMismatch) {
    return `Please enter a valid step value`;
  } else if (input.validity.badInput) {
    return "Please enter a valid value";
  }

  return input.validationMessage || "Please fill this field";
}

export function FormValidationHandler() {
  const { showError } = useToast();
  const lastValidationRef = useRef<{ inputId: string; timestamp: number } | null>(null);
  const isProcessingRef = useRef(false);
  const formSubmissionInProgress = useRef(false);

  useEffect(() => {
    // Prevent browser default validation UI on all forms
    const disableBrowserValidation = () => {
      document.querySelectorAll('form').forEach((form) => {
        form.setAttribute('novalidate', 'novalidate');
      });
    };

    // Initial setup
    disableBrowserValidation();

    // Watch for new forms added dynamically
    const observer = new MutationObserver(() => {
      disableBrowserValidation();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Handle form submission with event delegation
    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (form.tagName !== 'FORM') return;

      // Prevent browser default validation
      form.setAttribute('novalidate', 'novalidate');

      // Prevent multiple simultaneous validations
      if (isProcessingRef.current || formSubmissionInProgress.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        
        isProcessingRef.current = true;
        formSubmissionInProgress.current = true;

        // Temporarily remove invalid event listener to prevent duplicate alerts
        const invalidHandler = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        };
        document.addEventListener('invalid', invalidHandler, true);

        // Find the first invalid input
        const invalidInput = form.querySelector(':invalid') as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

        if (invalidInput) {
          // Create unique ID for this input
          const inputId = invalidInput.id || invalidInput.name || `${form.id || 'form'}-input-${Date.now()}`;
          const now = Date.now();
          
          // Check if we've already shown an error for this exact input recently (within 1000ms)
          if (
            lastValidationRef.current &&
            lastValidationRef.current.inputId === inputId &&
            now - lastValidationRef.current.timestamp < 1000
          ) {
            // Remove temporary invalid handler
            setTimeout(() => {
              document.removeEventListener('invalid', invalidHandler, true);
              isProcessingRef.current = false;
              formSubmissionInProgress.current = false;
            }, 100);
            return;
          }

          // Update last validation
          lastValidationRef.current = {
            inputId: inputId,
            timestamp: now,
          };

          // Focus and scroll to invalid input
          invalidInput.focus();
          invalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Get error message
          const errorMessage = getErrorMessage(invalidInput);

          // Show error toast (only once)
          showError(
            "Please try again",
            errorMessage
          );

          // Remove temporary invalid handler and reset flags
          setTimeout(() => {
            document.removeEventListener('invalid', invalidHandler, true);
            isProcessingRef.current = false;
            formSubmissionInProgress.current = false;
          }, 500);
        } else {
          isProcessingRef.current = false;
          formSubmissionInProgress.current = false;
        }
      } else {
        isProcessingRef.current = false;
        formSubmissionInProgress.current = false;
      }
    };

    // Completely ignore invalid events - only handle form submissions
    // This prevents the triple-alert issue
    const handleInvalid = (e: Event) => {
      // Only prevent default if not processing a form submission
      if (!formSubmissionInProgress.current) {
        e.preventDefault();
      }
      // Don't show toast here - let form submission handle it
    };

    // Use event delegation for better coverage
    document.addEventListener('submit', handleFormSubmit, true);
    // Still prevent default browser validation, but don't show our toast
    document.addEventListener('invalid', handleInvalid, true);

    // Cleanup
    return () => {
      observer.disconnect();
      document.removeEventListener('submit', handleFormSubmit, true);
      document.removeEventListener('invalid', handleInvalid, true);
    };
  }, [showError]);

  return null;
}

