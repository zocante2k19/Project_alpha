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

const veiculosColumns = [
  { key: 'id', label: '#' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'placa', label: 'Placa' },
  { key: 'cliente_id', label: 'Cliente ID' },
];

export default function Veiculos() {
  const { user } = useAuth();
  const router = useRouter();
  const [veiculos, setVeiculos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ modelo: '', placa: '', cliente_id: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin') {
      router.push('/');
    } else {
      fetchVeiculos();
    }
  }, [user, router]);

  const fetchVeiculos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/veiculos');
      const data = await response.json();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/veiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newVeiculo = await response.json();
      setVeiculos([...veiculos, newVeiculo]);
      setIsOpen(false);
      setFormData({ modelo: '', placa: '', cliente_id: '' });
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/veiculos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedVeiculo = await response.json();
      setVeiculos(veiculos.map(v => v.id === updatedVeiculo.id ? updatedVeiculo : v));
      setIsOpen(false);
      setFormData({ modelo: '', placa: '', cliente_id: '' });
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/veiculos/${id}`, { method: 'DELETE' });
      setVeiculos(veiculos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
    }
  };

  const openModal = (veiculo = null) => {
    setFormData(veiculo || { modelo: '', placa: '', cliente_id: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Modelo', type: 'text', name: 'modelo' },
    { label: 'Placa', type: 'text', name: 'placa' },
    { label: 'Cliente ID', type: 'number', name: 'cliente_id' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Veículos</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search veículos" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Veículo
          </Button>
        </Flex>
        <TableComponent
          columns={veiculosColumns}
          data={veiculos}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Veículo"
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