"use client";

import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

export default function ProgressBar({ value, label }) {
  return (
    <CircularProgress value={value} color="blue.400" size="100px">
      <CircularProgressLabel>{label}</CircularProgressLabel>
    </CircularProgress>
  );
}