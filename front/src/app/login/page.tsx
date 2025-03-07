"use client";

import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      console.log('Response:', response); // Adicionar log
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user); // Atualizar o contexto
        toast({
          title: 'Login bem-sucedido',
          description: `Bem-vindo, ${data.user.nome}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/');
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: data.error || 'Credenciais inválidas',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao conectar ao servidor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4} p={8} bg="white" boxShadow="md" borderRadius="md" w="400px">
        <Text fontSize="2xl" fontWeight="bold">Login - Alpha Project</Text>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={handleLogin}
          isLoading={isLoading}
          w="100%"
        >
          Entrar
        </Button>
      </VStack>
    </Box>
  );
}