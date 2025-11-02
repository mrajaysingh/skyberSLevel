"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GetStartedFormSimpleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GetStartedFormSimple({ open, onOpenChange }: GetStartedFormSimpleProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    budget: "",
    name: "",
    email: "",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onOpenChange(false);
    setCurrentStep(1);
    setFormData({ service: "", budget: "", name: "", email: "" });
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="service">Service Required</Label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a service</option>
          <option value="cybersecurity">Cybersecurity</option>
          <option value="app-development">App Development</option>
          <option value="ui-ux">UI/UX Design</option>
          <option value="web-development">Web Development</option>
          <option value="tech-consultancy">Tech Consultancy</option>
          <option value="custom-software">Custom Software</option>
        </select>
      </div>

      <div>
        <Label htmlFor="budget">Project Budget</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 font-semibold">
            ₹
          </span>
          <Input
            id="budget"
            placeholder="Enter budget amount"
            className="pl-8 text-green-600 font-semibold"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Your Information</h3>
      <div className="bg-gray-50 p-4 rounded">
        <p><strong>Service:</strong> {formData.service}</p>
        <p><strong>Budget:</strong> ₹{formData.budget}</p>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Get Started with Your Project
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-center">
            Step {currentStep} of 3
          </h3>
        </div>

        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#17D492] hover:bg-[#17D492]/90"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-[#17D492] hover:bg-[#17D492]/90"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

