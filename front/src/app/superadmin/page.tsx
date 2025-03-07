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

const superadminColumns = [
  { key: 'id', label: '#' },
  { key: 'nome', label: 'Nome' },
  { key: 'login', label: 'Login' },
];

export default function SuperAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const [superadmins, setSuperadmins] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', login: '', senha: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'SuperAdmin') {
      router.push('/');
    } else {
      fetchSuperadmins();
    }
  }, [user, router]);

  const fetchSuperadmins = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/superadmin');
      const data = await response.json();
      setSuperadmins(data);
    } catch (error) {
      console.error('Erro ao buscar superadmins:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newSuperadmin = await response.json();
      setSuperadmins([...superadmins, newSuperadmin]);
      setIsOpen(false);
      setFormData({ nome: '', login: '', senha: '' });
    } catch (error) {
      console.error('Erro ao criar superadmin:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/superadmin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedSuperadmin = await response.json();
      setSuperadmins(superadmins.map(s => s.id === updatedSuperadmin.id ? updatedSuperadmin : s));
      setIsOpen(false);
      setFormData({ nome: '', login: '', senha: '' });
    } catch (error) {
      console.error('Erro ao atualizar superadmin:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/superadmin/${id}`, { method: 'DELETE' });
      setSuperadmins(superadmins.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erro ao deletar superadmin:', error);
    }
  };

  const openModal = (superadmin = null) => {
    setFormData(superadmin || { nome: '', login: '', senha: '' });
    setIsOpen(true);
  };

  const formFields = [
    { label: 'Nome', type: 'text', name: 'nome' },
    { label: 'Login', type: 'text', name: 'login' },
    { label: 'Senha', type: 'password', name: 'senha' },
  ];

  return (
    <Box>
      <Sidebar userRole={user?.role} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Super Admins</h1>
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup>
            <Input placeholder="Search superadmins" w="300px" />
            <InputLeftElement pointerEvents="none">
              <RiSearchLine />
            </InputLeftElement>
          </InputGroup>
          <Button leftIcon={<RiAddLine />} colorScheme="blue" onClick={() => openModal()}>
            Criar Super Admin
          </Button>
        </Flex>
        <TableComponent
          columns={superadminColumns}
          data={superadmins}
          itemsPerPage={5}
          onEdit={openModal}
          onDelete={handleDelete}
        />
        <FormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Cadastrar/Editar Super Admin"
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