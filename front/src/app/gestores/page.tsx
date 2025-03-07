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

const gestoresColumns = [
  { key: 'id', label: '#' },
  { key: 'nome', label: 'Nome' },
  { key: 'concessionaria_id', label: 'Concessionária ID' },
];

export default function Gestores() {
  const { user } = useAuth();
  const router = useRouter();
  const [gestores, setGestores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', concessionaria_id: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin' && user.role !== 'Gestor') {
      router.push('/');
    } else {
      fetchGestores();
    }
  }, [user, router]);

  const fetchGestores = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/gestores');
      const data = await response.json();
      setGestores(data);
    } catch (error) {
      console.error('Erro ao buscar gestores:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/gestores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newGestor = await response.json();
      setGestores([...gestores, newGestor]);
      setIsOpen(false);
      setFormData({ nome: '', concessionaria_id: '' });
    } catch (error) {
      console.error('Erro ao criar gestor:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/gestores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedGestor = await response.json();
      setGestores(gestores.map(g => g.id === updatedGestor.id ? updatedGestor : g));
      setIsOpen(false);
      setFormData({ nome: '', concessionaria_id: '' });
    } catch (error) {
      console.error('Erro ao atualizar gestor:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/gestores/${id}`, { method: 'DELETE' });
      setGestores(gestores.filter(g => g.id !== id));
    } catch (error) {
      console.error('Erro ao deletar gestor:', error);
    }
  };

  const openModal = (gestor = null) => {
    setFormData(gestor || { nome: '', concessionaria_id: '' });
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
        <h1>Gestores</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search gestores" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Gestor
          </Button>
        </Flex>
        <TableComponent
          columns={gestoresColumns}
          data={gestores}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Gestor"
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