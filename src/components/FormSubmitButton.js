"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import LoadingButton from "./LoadingButton";

function FormSubmitButton(props) {
  const { pending } = useFormStatus();
  return <LoadingButton {...props} type="submit" loading={pending} />;
}

export default FormSubmitButton;
