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

const telefonistasColumns = [
  { key: 'id', label: '#' },
  { key: 'nome', label: 'Nome' },
  { key: 'concessionaria_id', label: 'Concessionária ID' },
];

export default function Telefonistas() {
  const { user } = useAuth();
  const router = useRouter();
  const [telefonistas, setTelefonistas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', concessionaria_id: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin' && user.role !== 'Gestor' && user.role !== 'Telefonista Supervisora') {
      router.push('/');
    } else {
      fetchTelefonistas();
    }
  }, [user, router]);

  const fetchTelefonistas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/telefonistas');
      const data = await response.json();
      setTelefonistas(data);
    } catch (error) {
      console.error('Erro ao buscar telefonistas:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/telefonistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newTelefonista = await response.json();
      setTelefonistas([...telefonistas, newTelefonista]);
      setIsOpen(false);
      setFormData({ nome: '', concessionaria_id: '' });
    } catch (error) {
      console.error('Erro ao criar telefonista:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/telefonistas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedTelefonista = await response.json();
      setTelefonistas(telefonistas.map(t => t.id === updatedTelefonista.id ? updatedTelefonista : t));
      setIsOpen(false);
      setFormData({ nome: '', concessionaria_id: '' });
    } catch (error) {
      console.error('Erro ao atualizar telefonista:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/telefonistas/${id}`, { method: 'DELETE' });
      setTelefonistas(telefonistas.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar telefonista:', error);
    }
  };

  const openModal = (telefonista = null) => {
    setFormData(telefonista || { nome: '', concessionaria_id: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Nome', type: 'text', name: 'nome' },
    { label: 'Concessionária ID', type: 'number', name: 'concessionaria_id' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Telefonistas</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search telefonistas" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Telefonista
          </Button>
        </Flex>
        <TableComponent
          columns={telefonistasColumns}
          data={telefonistas}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Telefonista"
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