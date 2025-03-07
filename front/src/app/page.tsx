import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';
import AlertBox from '../components/AlertBox';

export default function Home({ userRole = 'SuperAdmin' }: { userRole?: string }) {
  return (
    <Box>
      <Sidebar userRole={userRole} />
      <TopBar />
      <Box ml="200px" mt="60px" p={4}>
        <h1>Bem-vindo ao Alpha Project!</h1>
        <Flex mt={4} gap={4}>
          <ProgressBar value={75} label="75%" />
          <AlertBox status="info" title="Informação" description="Sistema em desenvolvimento." />
        </Flex>
      </Box>
    </Box>
  );
}