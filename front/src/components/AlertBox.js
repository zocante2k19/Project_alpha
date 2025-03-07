"use client";

import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

export default function AlertBox({ status, title, description }) {
  return (
    <Alert status={status}>
      <AlertIcon />
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}