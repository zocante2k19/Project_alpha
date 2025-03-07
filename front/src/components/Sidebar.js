"use client";

import { Box, Flex, IconButton, Text, Stack, useColorModeValue, Link, Icon } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiHome2Line, RiUser3Line, RiCalendar2Line, RiFileTextLine } from 'react-icons/ri';

const Sidebar = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const router = useRouter();

  const menuItems = {
    SuperAdmin: [
      { name: 'Home', icon: RiHome2Line, path: '/' },
      { name: 'Super Admins', icon: RiUser3Line, path: '/superadmin' },
      { name: 'Concessionárias', icon: RiUser3Line, path: '/concessionarias' },
      { name: 'Gestores', icon: RiUser3Line, path: '/gestores' },
      { name: 'Telefonistas', icon: RiUser3Line, path: '/telefonistas' },
      { name: 'Técnicos', icon: RiUser3Line, path: '/tecnicos' },
      { name: 'Clientes', icon: RiUser3Line, path: '/clientes' },
      { name: 'Veículos', icon: RiUser3Line, path: '/veiculos' },
      { name: 'Agendamentos', icon: RiCalendar2Line, path: '/agendamentos' },
      { name: 'Relatórios', icon: RiFileTextLine, path: '/relatorios' },
    ],
    Gestor: [
      { name: 'Home', icon: RiHome2Line, path: '/' },
      { name: 'Telefonistas', icon: RiUser3Line, path: '/telefonistas' },
      { name: 'Técnicos', icon: RiUser3Line, path: '/tecnicos' },
      { name: 'Agendamentos', icon: RiCalendar2Line, path: '/agendamentos' },
      { name: 'Relatórios', icon: RiFileTextLine, path: '/relatorios' },
    ],
    Telefonista: [
      { name: 'Home', icon: RiHome2Line, path: '/' },
      { name: 'Agendamentos', icon: RiCalendar2Line, path: '/agendamentos' },
      { name: 'Relatórios', icon: RiFileTextLine, path: '/relatorios' },
    ],
    'Telefonista Supervisora': [
      { name: 'Home', icon: RiHome2Line, path: '/' },
      { name: 'Agendamentos', icon: RiCalendar2Line, path: '/agendamentos' },
      { name: 'Telefonistas', icon: RiUser3Line, path: '/telefonistas' },
      { name: 'Técnicos', icon: RiUser3Line, path: '/tecnicos' },
      { name: 'Relatórios', icon: RiFileTextLine, path: '/relatorios' },
    ],
    Tecnico: [
      { name: 'Home', icon: RiHome2Line, path: '/' },
      { name: 'Meus Agendamentos', icon: RiCalendar2Line, path: '/meus-agendamentos' },
      { name: 'Relatórios', icon: RiFileTextLine, path: '/relatorios' },
    ],
  };

  const items = menuItems[userRole] || [];

  useEffect(() => {
    // Forçar re-renderização se userRole mudar
  }, [userRole]);

  return (
    <Box
      w={{ base: isOpen ? '200px' : '60px', md: isOpen ? '200px' : '60px' }}
      h="100vh"
      bg={bgColor}
      boxShadow="md"
      position="fixed"
      transition="width 0.3s"
    >
      <Flex align="center" p={2} borderBottom="1px" borderColor="gray.200">
        <IconButton
          icon={<HamburgerIcon />}
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          aria-label="Toggle Sidebar"
          size="sm"
        />
        {isOpen && <Text ml={2} fontWeight="bold" fontSize="lg">Alpha Project</Text>}
      </Flex>
      <Stack spacing={2} p={2}>
        {items.map((item, index) => (
          <Link
            key={index}
            color={textColor}
            fontSize="sm"
            cursor="pointer"
            _hover={{ color: 'blue.500' }}
            onClick={() => router.push(item.path)}
            display="flex"
            alignItems="center"
            p={2}
            borderRadius={4}
            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
          >
            <Icon as={item.icon} mr={isOpen ? 2 : 0} boxSize={6} />
            {isOpen && <Text>{item.name}</Text>}
          </Link>
        ))}
      </Stack>
    </Box>
  );
};

export default Sidebar;