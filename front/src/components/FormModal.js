"use client";

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useState } from 'react';

export default function FormModal({ isOpen, onClose, title, fields, formData, setFormData, onSubmit, onUpdate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (formData.id && onUpdate) {
      onUpdate(formData.id);
    } else {
      onSubmit();
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {fields.map((field) => (
            <FormControl key={field.name} mb={4}>
              <FormLabel>{field.label}</FormLabel>
              {field.type === 'select' ? (
                <Select name={field.name} value={formData[field.name] || ''} onChange={handleChange} placeholder={field.placeholder}>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )}
            </FormControl>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isSubmitting}>
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};