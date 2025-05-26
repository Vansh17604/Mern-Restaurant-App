
import React from "react";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../components/ui/card";

// 1. CustomInput Component
const CustomInput = (props) => {
  const { type = "text", label, id, className, name, value, onChange, onBlur } = props;
  
  return (
    <div className="mt-4 space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        className={className}
        id={id}
        placeholder={label}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

// 2. CustomModal Component
const CustomModal = (props) => {
  const { open, hideModal, performAction, title, description } = props;
  
  return (
    <Dialog open={open} onOpenChange={hideModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>{title}</p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={hideModal}>Cancel</Button>
          <Button onClick={performAction}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 3. CustomCard Component
const CustomCard = (props) => {
  const { title, description, children, footer } = props;
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="flex justify-end gap-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

// Demo component that shows all three components in action
export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);
  const handleAction = () => {
    alert("Action performed!");
    hideModal();
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-2xl font-bold">Shadcn UI Custom Components</h1>
      
      <CustomCard 
        title="Input Example" 
        description="Try out our custom input component"
        footer={
          <>
            <Button variant="outline">Reset</Button>
            <Button onClick={showModal}>Submit</Button>
          </>
        }
      >
        <CustomInput
          type="text"
          label="Your Name"
          id="name-input"
          className="w-full"
          name="name"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => console.log("Input blurred")}
        />
        
        <CustomInput
          type="email"
          label="Your Email"
          id="email-input"
          className="w-full"
          name="email"
          value=""
          onChange={() => {}}
        />
      </CustomCard>
      
      <CustomModal
        open={isModalOpen}
        hideModal={hideModal}
        performAction={handleAction}
        title="Are you sure you want to submit this form?"
        description="This action cannot be undone."
      />
    </div>
  );
}

export { CustomCard, CustomModal, CustomInput };