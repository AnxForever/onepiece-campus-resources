import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorMode,
  useColorModeValue,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaGraduationCap } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  // 颜色模式
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // 登录模态框
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 管理员状态
  const { admin, logout } = useStore();
  
  return (
    <>
      <Box
        bg={bgColor}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow="sm"
      >
        <Container maxW={'container.xl'}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            {/* Logo */}
            <Flex alignItems={'center'}>
              <FaGraduationCap size={24} />
              <Text
                fontWeight="bold"
                fontSize="xl"
                ml={2}
              >
                校园资料共享平台
              </Text>
            </Flex>
            
            {/* 右侧按钮组 */}
            <Flex alignItems={'center'}>
              <Stack direction={'row'} spacing={4} alignItems={'center'}>
                {/* 切换颜色模式按钮 */}
                <IconButton
                  aria-label="Toggle color mode"
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  colorScheme="blue"
                />
                
                {/* 管理员登录/菜单 */}
                {admin.isAdminMode ? (
                  // 已登录状态：显示管理员菜单
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                    >
                      <Avatar
                        size={'sm'}
                        name={admin.username || 'Admin'}
                        bg="blue.500"
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem fontWeight="bold" isDisabled>
                        {admin.username || 'Admin'}
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem onClick={() => logout()}>退出登录</MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  // 未登录状态：显示登录按钮
                  <Button
                    variant={'outline'}
                    colorScheme={'blue'}
                    size={'sm'}
                    onClick={onOpen}
                  >
                    管理员登录
                  </Button>
                )}
              </Stack>
            </Flex>
          </Flex>
        </Container>
      </Box>
      
      {/* 登录模态框 */}
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Navbar;
