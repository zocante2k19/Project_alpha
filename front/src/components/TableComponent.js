"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  VStack,
  Button,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react';
import { RiEdit2Line, RiDeleteBin2Line, RiEyeLine } from 'react-icons/ri';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'; // Adicionar RiEditLine se ainda não estiver presente
import { useState } from 'react';

export default function TableComponent({ columns, data, itemsPerPage = 5, onEdit, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    onOpen();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.key}>{column.label}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row) => (
              <Tr
                key={row.id}
                onClick={() => handleViewDetails(row)}
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
              >
                {columns.map((column) => (
                  <Td key={column.key}>
                    {column.key === 'status_id' ? (
                      <Badge
                        colorScheme={row.status_id === 2 ? 'green' : 'orange'} // Ajuste conforme os IDs de status
                      >
                        {row[column.key]}
                      </Badge>
                    ) : (
                      row[column.key]
                    )}
                  </Td>
                ))}
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="View"
                      icon={<RiEyeLine />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(row);
                      }}
                    />
                    <IconButton
                      aria-label="Edit"
                      icon={<RiEditLine />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<RiDeleteBinLine />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(row.id);
                      }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="center" mt={4}>
        <ButtonGroup>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              colorScheme={currentPage === index + 1 ? 'blue' : 'gray'}
            >
              {index + 1}
            </Button>
          ))}
        </ButtonGroup>
      </Flex>

      {selectedRow && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalhes</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="start">
                {columns.map((column) => (
                  <Text key={column.key}>
                    <strong>{column.label}:</strong> {selectedRow[column.key]}
                  </Text>
                ))}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}