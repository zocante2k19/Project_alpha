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

const tecnicosColumns = [
  { key: 'id', label: '#' },
  { key: 'nome', label: 'Nome' },
  { key: 'concessionaria_id', label: 'Concessionária ID' },
  { key: 'especialidade', label: 'Especialidade' },
];

export default function Tecnicos() {
  const { user } = useAuth();
  const router = useRouter();
  const [tecnicos, setTecnicos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', concessionaria_id: '', especialidade: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin' && user.role !== 'Gestor' && user.role !== 'Telefonista Supervisora') {
      router.push('/');
    } else {
      fetchTecnicos();
    }
  }, [user, router]);

  const fetchTecnicos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tecnicos');
      const data = await response.json();
      setTecnicos(data);
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tecnicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newTecnico = await response.json();
      setTecnicos([...tecnicos, newTecnico]);
      setIsOpen(false);
      setFormData({ nome: '', concessionaria_id: '', especialidade: '' });
    } catch (error) {
      console.error('Erro ao criar técnico:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tecnicos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedTecnico = await response.json();
      setTecnicos(tecnicos.map(t => t.id === updatedTecnico.id ? updatedTecnico : t));
      setIsOpen(false);
      setFormData({ nome: '', concessionaria_id: '', especialidade: '' });
    } catch (error) {
      console.error('Erro ao atualizar técnico:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/tecnicos/${id}`, { method: 'DELETE' });
      setTecnicos(tecnicos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar técnico:', error);
    }
  };

  const openModal = (tecnico = null) => {
    setFormData(tecnico || { nome: '', concessionaria_id: '', especialidade: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Nome', type: 'text', name: 'nome' },
    { label: 'Concessionária ID', type: 'number', name: 'concessionaria_id' },
    { label: 'Especialidade', type: 'text', name: 'especialidade' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Técnicos</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search técnicos" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Técnico
          </Button>
        </Flex>
        <TableComponent
          columns={tecnicosColumns}
          data={tecnicos}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Técnico"
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