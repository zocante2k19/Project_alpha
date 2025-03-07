"use client";

import { Box, Button, Flex, InputGroup, Input, InputLeftElement, Select } from '@chakra-ui/react';
import TableComponent from '../../components/TableComponent';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import FormModal from '../../components/FormModal';
import { RiAddLine, RiSearchLine, RiFileDownloadLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const relatoriosColumns = [
  { key: 'id', label: '#' },
  { key: 'titulo', label: 'Título' },
  { key: 'data_geracao', label: 'Data de Geração' },
  { key: 'usuario_id', label: 'Usuário ID' },
];

export default function Relatorios() {
  const { user } = useAuth();
  const router = useRouter();
  const [relatorios, setRelatorios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', data_inicio: '', data_fim: '', usuario_id: '' });
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchRelatorios();
    }
  }, [user, router]);

  const fetchRelatorios = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/relatorios');
      const data = await response.json();
      setRelatorios(data);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/relatorios?filtro=${filtro}`);
      const data = await response.json();
      setRelatorios(data);
    } catch (error) {
      console.error('Erro ao filtrar relatórios:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/relatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newRelatorio = await response.json();
      setRelatorios([...relatorios, newRelatorio]);
      setIsOpen(false);
      setFormData({ titulo: '', data_inicio: '', data_fim: '', usuario_id: '' });
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/relatorios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedRelatorio = await response.json();
      setRelatorios(relatorios.map(r => r.id === updatedRelatorio.id ? updatedRelatorio : r));
      setIsOpen(false);
      setFormData({ titulo: '', data_inicio: '', data_fim: '', usuario_id: '' });
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/relatorios/${id}`, { method: 'DELETE' });
      setRelatorios(relatorios.filter(r => r.id !== id));
    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
    }
  };

  const openModal = (relatorio = null) => {
    setFormData(relatorio || { titulo: '', data_inicio: '', data_fim: '', usuario_id: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Título', type: 'text', name: 'titulo' },
    { label: 'Data Início', type: 'date', name: 'data_inicio' },
    { label: 'Data Fim', type: 'date', name: 'data_fim' },
    { label: 'Usuário ID', type: 'number', name: 'usuario_id' },
  ];

  const handleDownload = () => {
    console.log('Download relatório');
  };

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Relatórios</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search relatórios" w="300px" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiSearchLine />} colorScheme="teal" onClick={handleFilter} mr={2}>
            Filtrar
          </Button>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()} mr={2}>
            Criar Relatório
          </Button>
          <Button leftIcon={<RiFileDownloadLine />} colorScheme="green" onClick={handleDownload}>
            Download
          </Button>
        </Flex>
        <TableComponent
          columns={relatoriosColumns}
          data={relatorios}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Relatório"
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