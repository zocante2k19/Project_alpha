"use client";

import { Box, Button, Flex, InputGroup, Input, InputLeftElement } from '@chakra-ui/react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import FormModal from '../../components/FormModal';
import TableComponent from '../../components/TableComponent';
import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const clientesColumns = [
  { key: 'id', label: '#' },
  { key: 'nome', label: 'Nome' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'Email' },
];

export default function Clientes() {
  const { user } = useAuth();
  const router = useRouter();
  const [clientes, setClientes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin') {
      router.push('/');
    } else {
      fetchClientes();
    }
  }, [user, router]);

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newCliente = await response.json();
      setClientes([...clientes, newCliente]);
      setIsOpen(false);
      setFormData({ nome: '', telefone: '', email: '' });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedCliente = await response.json();
      setClientes(clientes.map(c => c.id === updatedCliente.id ? updatedCliente : c));
      setIsOpen(false);
      setFormData({ nome: '', telefone: '', email: '' });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/clientes/${id}`, { method: 'DELETE' });
      setClientes(clientes.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const openModal = (cliente = null) => {
    setFormData(cliente || { nome: '', telefone: '', email: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Nome', type: 'text', name: 'nome' },
    { label: 'Telefone', type: 'text', name: 'telefone' },
    { label: 'Email', type: 'email', name: 'email' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Clientes</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search clientes" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Cliente
          </Button>
        </Flex>
        <TableComponent
          columns={clientesColumns}
          data={clientes}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Cliente"
          fields={formFields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onUpdate={handleUpdate}
        />
      </Box>
    </Box>
  );
}