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

const meusAgendamentosColumns = [
  { key: 'id', label: '#' },
  { key: 'cliente_id', label: 'Cliente ID' },
  { key: 'veiculo_id', label: 'Veículo ID' },
  { key: 'data_hora', label: 'Data/Hora' },
  { key: 'status_id', label: 'Status ID' },
];

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'Tecnico') {
      router.push('/');
    } else {
      fetchMeusAgendamentos();
    }
  }, [user, router]);

  const fetchMeusAgendamentos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/agendamentos?tecnico_id=${user.id}`);
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar meus agendamentos:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tecnico_id: user.id }),
      });
      const newAgendamento = await response.json();
      setAgendamentos([...agendamentos, newAgendamento]);
      setIsOpen(false);
      setFormData({ cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '' });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedAgendamento = await response.json();
      setAgendamentos(agendamentos.map(a => a.id === updatedAgendamento.id ? updatedAgendamento : a));
      setIsOpen(false);
      setFormData({ cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '' });
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/agendamentos/${id}`, { method: 'DELETE' });
      setAgendamentos(agendamentos.filter(a => a.id !== id));
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
    }
  };

  const openModal = (agendamento = null) => {
    setFormData(agendamento || { cliente_id: '', veiculo_id: '', tecnico_id: user.id, telefonista_id: '', data_hora: '', status_id: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Cliente ID', type: 'number', name: 'cliente_id' },
    { label: 'Veículo ID', type: 'number', name: 'veiculo_id' },
    { label: 'Técnico ID', type: 'number', name: 'tecnico_id', value: user.id, disabled: true },
    { label: 'Telefonista ID', type: 'number', name: 'telefonista_id' },
    { label: 'Data/Hora', type: 'datetime-local', name: 'data_hora' },
    { label: 'Status ID', type: 'number', name: 'status_id' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Meus Agendamentos</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search meus agendamentos" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Agendamento
          </Button>
        </Flex>
        <TableComponent
          columns={meusAgendamentosColumns}
          data={agendamentos}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Agendamento"
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