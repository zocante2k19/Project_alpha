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

const concessionariasColumns = [
  { key: 'id', label: '#' },
  { key: 'nome', label: 'Nome' },
  { key: 'cnpj', label: 'CNPJ' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'responsavel_id', label: 'Responsável ID' },
];

export default function Concessionarias() {
  const { user } = useAuth();
  const router = useRouter();
  const [concessionarias, setConcessionarias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', endereco: '', numero: '', cidade: '', estado: '', cep: '', cnpj: '', telefone: '', email: '', responsavel_id: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin') {
      router.push('/'); // Redireciona se não for SuperAdmin
    } else {
      fetchConcessionarias();
    }
  }, [user, router]);

  const fetchConcessionarias = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/concessionarias');
      const data = await response.json();
      setConcessionarias(data);
    } catch (error) {
      console.error('Erro ao buscar concessionarias:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/concessionarias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newConcessionaria = await response.json();
      setConcessionarias([...concessionarias, newConcessionaria]);
      setIsOpen(false);
      setFormData({ nome: '', endereco: '', numero: '', cidade: '', estado: '', cep: '', cnpj: '', telefone: '', email: '', responsavel_id: '' });
    } catch (error) {
      console.error('Erro ao criar concessionaria:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/concessionarias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedConcessionaria = await response.json();
      setConcessionarias(concessionarias.map(c => c.id === updatedConcessionaria.id ? updatedConcessionaria : c));
      setIsOpen(false);
      setFormData({ nome: '', endereco: '', numero: '', cidade: '', estado: '', cep: '', cnpj: '', telefone: '', email: '', responsavel_id: '' });
    } catch (error) {
      console.error('Erro ao atualizar concessionaria:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/concessionarias/${id}`, { method: 'DELETE' });
      setConcessionarias(concessionarias.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao deletar concessionaria:', error);
    }
  };

  const openModal = (concessionaria = null) => {
    setFormData(concessionaria || { nome: '', endereco: '', numero: '', cidade: '', estado: '', cep: '', cnpj: '', telefone: '', email: '', responsavel_id: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Nome', type: 'text', name: 'nome' },
    { label: 'Endereço', type: 'text', name: 'endereco' },
    { label: 'Número', type: 'text', name: 'numero' },
    { label: 'Cidade', type: 'text', name: 'cidade' },
    { label: 'Estado', type: 'text', name: 'estado' },
    { label: 'CEP', type: 'text', name: 'cep' },
    { label: 'CNPJ', type: 'text', name: 'cnpj' },
    { label: 'Telefone', type: 'text', name: 'telefone' },
    { label: 'Email', type: 'email', name: 'email' },
    { label: 'Responsável ID', type: 'number', name: 'responsavel_id' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Concessionárias</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search concessionarias" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Concessionária
          </Button>
        </Flex>
        <TableComponent
          columns={concessionariasColumns}
          data={concessionarias}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Concessionária"
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