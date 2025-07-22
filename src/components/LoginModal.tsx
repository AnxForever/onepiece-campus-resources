import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  VStack,
  InputGroup,
  InputRightElement,
  Icon
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { login } from '../api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // 状态管理
  const { setAdmin } = useStore();
  const toast = useToast();
  
  // 表单状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  
  // 表单验证
  const validateForm = () => {
    const newErrors = {
      username: '',
      password: ''
    };
    
    let isValid = true;
    
    if (!username.trim()) {
      newErrors.username = '请输入用户名';
      isValid = false;
    }
    
    if (!password.trim()) {
      newErrors.password = '请输入密码';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少为6位';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await login(username, password);
      
      if (response.success) {
        // 登录成功
        setAdmin({
          isAdminMode: true,
          token: response.data.token,
          username: response.data.username
        });
        
        toast({
          title: '登录成功',
          description: `欢迎回来，${response.data.username}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        
        // 关闭模态框
        handleClose();
      } else {
        // 登录失败
        toast({
          title: '登录失败',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      // 处理错误
      toast({
        title: '登录失败',
        description: '网络错误，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      console.error('登录错误:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理关闭模态框
  const handleClose = () => {
    // 重置表单
    setUsername('');
    setPassword('');
    setErrors({
      username: '',
      password: ''
    });
    setShowPassword(false);
    
    // 关闭模态框
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader>管理员登录</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>用户名</FormLabel>
              <Input
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>密码</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon as={showPassword ? FaEyeSlash : FaEye} />
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose}>
            取消
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText="登录中"
          >
            登录
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
