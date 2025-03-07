"use client";

import { Box, Button, Flex, InputGroup, Input, InputLeftElement, Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel } from '@chakra-ui/react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import TableComponent from '../../components/TableComponent';
import CalendarComponent from '../../components/CalendarComponent';
import FormModal from '../../components/FormModal';
import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const agendamentosColumns = [
  { key: 'id', label: '#' },
  { key: 'cliente_id', label: 'Cliente ID' },
  { key: 'veiculo_id', label: 'Veículo ID' },
  { key: 'data_hora', label: 'Data/Hora' },
  { key: 'status_id', label: 'Status ID' },
];

const mockAgendamentosEvents = [
  { title: 'Carlos Almeida - Onix LTZ', start: new Date('2025-03-07T14:00:00'), end: new Date('2025-03-07T15:00:00') },
  { title: 'Ana Costa - Civic EX', start: new Date('2025-03-08T10:00:00'), end: new Date('2025-03-08T11:00:00') },
  { title: 'João Silva - Corolla XEi', start: new Date('2025-03-09T09:00:00'), end: new Date('2025-03-09T10:00:00') },
];

export default function Agendamentos() {
  const { user } = useAuth();
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [formData, setFormData] = useState({ cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '', servico_id: '', local_id: '', tipo_agendamento_id: '', observacoes: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin' && user.role !== 'Gestor' && user.role !== 'Telefonista' && user.role !== 'Telefonista Supervisora') {
      router.push('/');
    } else {
      fetchAgendamentos();
    }
  }, [user, router]);

  const fetchAgendamentos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agendamentos');
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newAgendamento = await response.json();
      setAgendamentos([...agendamentos, newAgendamento]);
      onClose();
      setFormData({ cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '', servico_id: '', local_id: '', tipo_agendamento_id: '', observacoes: '' });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/agendamentos/${selectedAgendamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedAgendamento = await response.json();
      setAgendamentos(agendamentos.map(ag => ag.id === updatedAgendamento.id ? updatedAgendamento : ag));
      onClose();
      setFormData({ cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '', servico_id: '', local_id: '', tipo_agendamento_id: '', observacoes: '' });
      setSelectedAgendamento(null);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/agendamentos/${id}`, { method: 'DELETE' });
      setAgendamentos(agendamentos.filter(ag => ag.id !== id));
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
    }
  };

  const openModal = (agendamento = null) => {
    setSelectedAgendamento(agendamento);
    setFormData(agendamento || { cliente_id: '', veiculo_id: '', tecnico_id: '', telefonista_id: '', data_hora: '', status_id: '', servico_id: '', local_id: '', tipo_agendamento_id: '', observacoes: '' });
    onOpen();
  };

  const formFields = [
    { label: 'Cliente ID', type: 'number', name: 'cliente_id' },
    { label: 'Veículo ID', type: 'number', name: 'veiculo_id' },
    { label: 'Técnico ID', type: 'number', name: 'tecnico_id' },
    { label: 'Telefonista ID', type: 'number', name: 'telefonista_id' },
    { label: 'Data/Hora', type: 'datetime-local', name: 'data_hora' },
    { label: 'Status ID', type: 'number', name: 'status_id' },
    { label: 'Serviço ID', type: 'number', name: 'servico_id' },
    { label: 'Local ID', type: 'number', name: 'local_id' },
    { label: 'Tipo Agendamento ID', type: 'number', name: 'tipo_agendamento_id' },
    { label: 'Observações', type: 'text', name: 'observacoes' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Agendamentos</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search agendamentos" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Agendamento
          </Button>
        </Flex>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Tabela</Tab>
            <Tab>Calendário</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TableComponent
                columns={agendamentosColumns}
                data={agendamentos}
                itemsPerPage={5}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel>
              <CalendarComponent events={mockAgendamentosEvents} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <FormModal
          isOpen={isOpen}
          onClose={onClose}
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