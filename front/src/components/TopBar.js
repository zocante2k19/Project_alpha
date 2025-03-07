"use client";

import { Flex, Text, IconButton, Button, useColorMode, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const { user, logout } = useAuth();

  return (
    <Flex
      as="header"
      w="100%"
      p={4}
      bg={bgColor}
      position="fixed"
      top={0}
      zIndex={10}
      justify="space-between"
      align="center"
    >
      <Text fontSize="lg" fontWeight="bold">
        {user ? `Bem-vindo, ${user.nome}` : 'Alpha Project'}
      </Text>
      
      <Flex align="center">
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          mr={4}
        />
        {user && (
          <Menu>
            <MenuButton>
              <Avatar name={user.nome} src="https://bit.ly/broken-link" />
            </MenuButton>
            <MenuList>
              <MenuItem>Change Image</MenuItem>
              <MenuItem>Change Login/Senha</MenuItem>
              <MenuItem onClick={logout}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
}