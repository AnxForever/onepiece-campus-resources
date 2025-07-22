import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Select,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Flex,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  VStack,
  Divider,
  useToast,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import MaterialCard from '../components/MaterialCard';
import { Material, MaterialFormData, CourseType, ProgrammingLanguage } from '../types';
import { uploadMaterial, updateMaterial } from '../api';

const Home: React.FC = () => {
  // 状态管理
  const {
    materials,
    fetchMaterials,
    admin,
    filter,
    setFilter,
    resetFilter,
    sort,
    setSort,
    searchQuery,
    setSearchQuery,
    isUploadModalOpen,
    setUploadModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    currentEditingMaterial,
    setCurrentEditingMaterial
  } = useStore();
  
  // 本地状态
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    description: '',
    materialType: 'exam',
    courseType: 'dataStructure'
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MaterialFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const toast = useToast();
  
  // 初始化加载资料
  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      await fetchMaterials();
      setIsLoading(false);
    };
    
    loadMaterials();
  }, [fetchMaterials]);
  
  // 当编辑模态框打开时，初始化表单数据
  useEffect(() => {
    if (isEditModalOpen && currentEditingMaterial) {
      setFormData({
        title: currentEditingMaterial.title,
        description: currentEditingMaterial.description,
        materialType: currentEditingMaterial.materialType,
        courseType: currentEditingMaterial.courseType,
        teacher: currentEditingMaterial.teacher,
        year: currentEditingMaterial.year,
        semester: currentEditingMaterial.semester,
        programmingLanguage: currentEditingMaterial.programmingLanguage,
        repoUrl: currentEditingMaterial.repoUrl
      });
    }
  }, [isEditModalOpen, currentEditingMaterial]);
  
  // 当上传模态框打开时，重置表单数据
  useEffect(() => {
    if (isUploadModalOpen) {
      setFormData({
        title: '',
        description: '',
        materialType: 'exam',
        courseType: 'dataStructure'
      });
      setFormErrors({});
    }
  }, [isUploadModalOpen]);
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应的错误
    if (formErrors[name as keyof MaterialFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const errors: Partial<Record<keyof MaterialFormData, string>> = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      errors.title = '请输入标题';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      errors.description = '请输入描述';
      isValid = false;
    }
    
    if (formData.materialType === 'code' && !formData.programmingLanguage) {
      errors.programmingLanguage = '请选择编程语言';
      isValid = false;
    }
    
    if (formData.materialType === 'code' && !formData.repoUrl) {
      errors.repoUrl = '请输入代码仓库链接';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // 处理上传资料
  const handleUpload = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await uploadMaterial(formData);
      
      if (response.success) {
        toast({
          title: '上传成功',
          description: '资料已成功上传',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        
        // 关闭模态框
        setUploadModalOpen(false);
        
        // 重新获取资料列表
        await fetchMaterials();
      } else {
        toast({
          title: '上传失败',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      toast({
        title: '上传失败',
        description: '网络错误，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      console.error('上传错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 处理更新资料
  const handleUpdate = async () => {
    if (!validateForm() || !currentEditingMaterial) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await updateMaterial(currentEditingMaterial.id, formData);
      
      if (response.success) {
        toast({
          title: '更新成功',
          description: '资料已成功更新',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        
        // 关闭模态框
        setEditModalOpen(false);
        setCurrentEditingMaterial(null);
        
        // 重新获取资料列表
        await fetchMaterials();
      } else {
        toast({
          title: '更新失败',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      toast({
        title: '更新失败',
        description: '网络错误，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      console.error('更新错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 关闭上传模态框
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };
  
  // 关闭编辑模态框
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentEditingMaterial(null);
  };
  
  // 筛选资料
  const filteredMaterials = materials.filter(material => {
    // 搜索筛选
    if (searchQuery && !material.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !material.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 资料类型筛选
    if (filter.materialType && material.materialType !== filter.materialType) {
      return false;
    }
    
    // 课程类型筛选
    if (filter.courseType && material.courseType !== filter.courseType) {
      return false;
    }
    
    // 编程语言筛选
    if (filter.programmingLanguage && material.programmingLanguage !== filter.programmingLanguage) {
      return false;
    }
    
    // 年份筛选
    if (filter.year && material.year !== filter.year) {
      return false;
    }
    
    // 学期筛选
    if (filter.semester && material.semester !== filter.semester) {
      return false;
    }
    
    // 教师筛选
    if (filter.teacher && (!material.teacher || !material.teacher.includes(filter.teacher))) {
      return false;
    }
    
    return true;
  });
  
  // 排序资料
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    const { option, direction } = sort;
    
    if (direction === 'asc') {
      return a[option] > b[option] ? 1 : -1;
    } else {
      return a[option] < b[option] ? 1 : -1;
    }
  });
  
  // 获取唯一的年份列表
  const years = [...new Set(materials.map(material => material.year).filter(Boolean))];
  
  // 获取唯一的教师列表
  const teachers = [...new Set(materials.map(material => material.teacher).filter(Boolean))];
  
  return (
    <Container maxW="container.xl" py={8}>
      {/* 管理员提示 */}
      {admin.isAdminMode && showAlert && (
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>管理员模式已启用</AlertTitle>
          <AlertDescription>您现在可以上传、编辑和删除资料。</AlertDescription>
          <Spacer />
          <CloseButton onClick={() => setShowAlert(false)} />
        </Alert>
      )}
      
      {/* 标题 */}
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        校园资料共享平台
      </Heading>
      
      {/* 搜索和筛选栏 */}
      <Box mb={6} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
        <VStack spacing={4}>
          {/* 搜索框 */}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="搜索资料..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          
          {/* 筛选选项 */}
          <HStack spacing={4} width="100%" flexWrap="wrap">
            {/* 资料类型筛选 */}
            <Select
              placeholder="资料类型"
              value={filter.materialType || ''}
              onChange={(e) => setFilter({ materialType: e.target.value || null })}
            >
              <option value="exam">考试</option>
              <option value="code">代码</option>
              <option value="note">笔记</option>
              <option value="other">其他</option>
            </Select>
            
            {/* 课程类型筛选 */}
            <Select
              placeholder="课程类型"
              value={filter.courseType || ''}
              onChange={(e) => setFilter({ courseType: e.target.value || null })}
            >
              <option value="dataStructure">数据结构</option>
              <option value="algorithms">算法</option>
              <option value="computerNetworks">计算机网络</option>
              <option value="operatingSystems">操作系统</option>
              <option value="databaseSystems">数据库系统</option>
              <option value="compilers">编译原理</option>
              <option value="computerArchitecture">计算机体系结构</option>
              <option value="softwareEngineering">软件工程</option>
              <option value="artificialIntelligence">人工智能</option>
              <option value="machineLearning">机器学习</option>
              <option value="distributedSystems">分布式系统</option>
              <option value="computerGraphics">计算机图形学</option>
              <option value="other">其他</option>
            </Select>
            
            {/* 编程语言筛选（仅当资料类型为代码时显示） */}
            {filter.materialType === 'code' && (
              <Select
                placeholder="编程语言"
                value={filter.programmingLanguage || ''}
                onChange={(e) => setFilter({ programmingLanguage: e.target.value || null })}
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="other">其他</option>
              </Select>
            )}
            
            {/* 年份筛选 */}
            <Select
              placeholder="年份"
              value={filter.year || ''}
              onChange={(e) => setFilter({ year: e.target.value || null })}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
            
            {/* 学期筛选 */}
            <Select
              placeholder="学期"
              value={filter.semester || ''}
              onChange={(e) => setFilter({ semester: e.target.value || null })}
            >
              <option value="spring">春季</option>
              <option value="fall">秋季</option>
              <option value="summer">夏季</option>
              <option value="winter">冬季</option>
            </Select>
            
            {/* 教师筛选 */}
            <Select
              placeholder="教师"
              value={filter.teacher || ''}
              onChange={(e) => setFilter({ teacher: e.target.value || null })}
            >
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </Select>
          </HStack>
          
          {/* 操作按钮 */}
          <HStack spacing={4} width="100%" justifyContent="space-between">
            {/* 重置筛选按钮 */}
            <Button
              variant="outline"
              onClick={() => {
                resetFilter();
                setSearchQuery('');
              }}
            >
              重置筛选
            </Button>
            
            {/* 排序选项 */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                排序: {getSortOptionName(sort.option)}
                {sort.direction === 'asc' ? <FaSortAmountUp style={{ display: 'inline', marginLeft: '5px' }} /> : <FaSortAmountDown style={{ display: 'inline', marginLeft: '5px' }} />}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setSort('uploadDate', sort.option === 'uploadDate' ? (sort.direction === 'desc' ? 'asc' : 'desc') : 'desc')}>
                  上传日期 {sort.option === 'uploadDate' && (sort.direction === 'desc' ? '↓' : '↑')}
                </MenuItem>
                <MenuItem onClick={() => setSort('views', sort.option === 'views' ? (sort.direction === 'desc' ? 'asc' : 'desc') : 'desc')}>
                  浏览量 {sort.option === 'views' && (sort.direction === 'desc' ? '↓' : '↑')}
                </MenuItem>
                <MenuItem onClick={() => setSort('downloads', sort.option === 'downloads' ? (sort.direction === 'desc' ? 'asc' : 'desc') : 'desc')}>
                  下载量 {sort.option === 'downloads' && (sort.direction === 'desc' ? '↓' : '↑')}
                </MenuItem>
                <MenuItem onClick={() => setSort('favorites', sort.option === 'favorites' ? (sort.direction === 'desc' ? 'asc' : 'desc') : 'desc')}>
                  收藏数 {sort.option === 'favorites' && (sort.direction === 'desc' ? '↓' : '↑')}
                </MenuItem>
                <MenuItem onClick={() => setSort('rating', sort.option === 'rating' ? (sort.direction === 'desc' ? 'asc' : 'desc') : 'desc')}>
                  评分 {sort.option === 'rating' && (sort.direction === 'desc' ? '↓' : '↑')}
                </MenuItem>
              </MenuList>
            </Menu>
            
            {/* 管理员上传按钮 */}
            {admin.isAdminMode && (
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={() => setUploadModalOpen(true)}
              >
                上传资料
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
      
      {/* 资料列表 */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height="300px" borderRadius="md" />
          ))}
        </SimpleGrid>
      ) : sortedMaterials.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sortedMaterials.map(material => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Heading as="h3" size="lg" mb={3}>
            没有找到资料
          </Heading>
          <Text color="gray.500">
            尝试调整筛选条件或搜索关键词
          </Text>
        </Box>
      )}
      
      {/* 上传资料模态框 */}
      <Modal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>上传资料</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              {/* 标题 */}
              <FormControl isInvalid={!!formErrors.title}>
                <FormLabel>标题</FormLabel>
                <Input
                  name="title"
                  placeholder="请输入资料标题"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{formErrors.title}</FormErrorMessage>
              </FormControl>
              
              {/* 描述 */}
              <FormControl isInvalid={!!formErrors.description}>
                <FormLabel>描述</FormLabel>
                <Textarea
                  name="description"
                  placeholder="请输入资料描述"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
                <FormErrorMessage>{formErrors.description}</FormErrorMessage>
              </FormControl>
              
              {/* 资料类型 */}
              <FormControl>
                <FormLabel>资料类型</FormLabel>
                <Select
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleInputChange}
                >
                  <option value="exam">考试</option>
                  <option value="code">代码</option>
                  <option value="note">笔记</option>
                  <option value="other">其他</option>
                </Select>
              </FormControl>
              
              {/* 课程类型 */}
              <FormControl>
                <FormLabel>课程类型</FormLabel>
                <Select
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleInputChange}
                >
                  <option value="dataStructure">数据结构</option>
                  <option value="algorithms">算法</option>
                  <option value="computerNetworks">计算机网络</option>
                  <option value="operatingSystems">操作系统</option>
                  <option value="databaseSystems">数据库系统</option>
                  <option value="compilers">编译原理</option>
                  <option value="computerArchitecture">计算机体系结构</option>
                  <option value="softwareEngineering">软件工程</option>
                  <option value="artificialIntelligence">人工智能</option>
                  <option value="machineLearning">机器学习</option>
                  <option value="distributedSystems">分布式系统</option>
                  <option value="computerGraphics">计算机图形学</option>
                  <option value="other">其他</option>
                </Select>
              </FormControl>
              
              {/* 教师 */}
              <FormControl>
                <FormLabel>教师</FormLabel>
                <Input
                  name="teacher"
                  placeholder="请输入教师姓名（可选）"
                  value={formData.teacher || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              {/* 年份 */}
              <FormControl>
                <FormLabel>年份</FormLabel>
                <Input
                  name="year"
                  placeholder="请输入年份（可选）"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              {/* 学期 */}
              <FormControl>
                <FormLabel>学期</FormLabel>
                <Select
                  name="semester"
                  value={formData.semester || ''}
                  onChange={handleInputChange}
                >
                  <option value="">请选择（可选）</option>
                  <option value="spring">春季</option>
                  <option value="fall">秋季</option>
                  <option value="summer">夏季</option>
                  <option value="winter">冬季</option>
                </Select>
              </FormControl>
              
              {/* 编程语言（仅当资料类型为代码时显示） */}
              {formData.materialType === 'code' && (
                <FormControl isInvalid={!!formErrors.programmingLanguage}>
                  <FormLabel>编程语言</FormLabel>
                  <Select
                    name="programmingLanguage"
                    value={formData.programmingLanguage || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">请选择</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="other">其他</option>
                  </Select>
                  <FormErrorMessage>{formErrors.programmingLanguage}</FormErrorMessage>
                </FormControl>
              )}
              
              {/* 代码仓库链接（仅当资料类型为代码时显示） */}
              {formData.materialType === 'code' && (
                <FormControl isInvalid={!!formErrors.repoUrl}>
                  <FormLabel>代码仓库链接</FormLabel>
                  <Input
                    name="repoUrl"
                    placeholder="请输入代码仓库链接"
                    value={formData.repoUrl || ''}
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.repoUrl}</FormErrorMessage>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleCloseUploadModal}>
              取消
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={isSubmitting}
              loadingText="上传中"
            >
              上传
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* 编辑资料模态框 */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>编辑资料</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              {/* 标题 */}
              <FormControl isInvalid={!!formErrors.title}>
                <FormLabel>标题</FormLabel>
                <Input
                  name="title"
                  placeholder="请输入资料标题"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{formErrors.title}</FormErrorMessage>
              </FormControl>
              
              {/* 描述 */}
              <FormControl isInvalid={!!formErrors.description}>
                <FormLabel>描述</FormLabel>
                <Textarea
                  name="description"
                  placeholder="请输入资料描述"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
                <FormErrorMessage>{formErrors.description}</FormErrorMessage>
              </FormControl>
              
              {/* 资料类型 */}
              <FormControl>
                <FormLabel>资料类型</FormLabel>
                <Select
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleInputChange}
                >
                  <option value="exam">考试</option>
                  <option value="code">代码</option>
                  <option value="note">笔记</option>
                  <option value="other">其他</option>
                </Select>
              </FormControl>
              
              {/* 课程类型 */}
              <FormControl>
                <FormLabel>课程类型</FormLabel>
                <Select
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleInputChange}
                >
                  <option value="dataStructure">数据结构</option>
                  <option value="algorithms">算法</option>
                  <option value="computerNetworks">计算机网络</option>
                  <option value="operatingSystems">操作系统</option>
                  <option value="databaseSystems">数据库系统</option>
                  <option value="compilers">编译原理</option>
                  <option value="computerArchitecture">计算机体系结构</option>
                  <option value="softwareEngineering">软件工程</option>
                  <option value="artificialIntelligence">人工智能</option>
                  <option value="machineLearning">机器学习</option>
                  <option value="distributedSystems">分布式系统</option>
                  <option value="computerGraphics">计算机图形学</option>
                  <option value="other">其他</option>
                </Select>
              </FormControl>
              
              {/* 教师 */}
              <FormControl>
                <FormLabel>教师</FormLabel>
                <Input
                  name="teacher"
                  placeholder="请输入教师姓名（可选）"
                  value={formData.teacher || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              {/* 年份 */}
              <FormControl>
                <FormLabel>年份</FormLabel>
                <Input
                  name="year"
                  placeholder="请输入年份（可选）"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              {/* 学期 */}
              <FormControl>
                <FormLabel>学期</FormLabel>
                <Select
                  name="semester"
                  value={formData.semester || ''}
                  onChange={handleInputChange}
                >
                  <option value="">请选择（可选）</option>
                  <option value="spring">春季</option>
                  <option value="fall">秋季</option>
                  <option value="summer">夏季</option>
                  <option value="winter">冬季</option>
                </Select>
              </FormControl>
              
              {/* 编程语言（仅当资料类型为代码时显示） */}
              {formData.materialType === 'code' && (
                <FormControl isInvalid={!!formErrors.programmingLanguage}>
                  <FormLabel>编程语言</FormLabel>
                  <Select
                    name="programmingLanguage"
                    value={formData.programmingLanguage || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">请选择</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="other">其他</option>
                  </Select>
                  <FormErrorMessage>{formErrors.programmingLanguage}</FormErrorMessage>
                </FormControl>
              )}
              
              {/* 代码仓库链接（仅当资料类型为代码时显示） */}
              {formData.materialType === 'code' && (
                <FormControl isInvalid={!!formErrors.repoUrl}>
                  <FormLabel>代码仓库链接</FormLabel>
                  <Input
                    name="repoUrl"
                    placeholder="请输入代码仓库链接"
                    value={formData.repoUrl || ''}
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.repoUrl}</FormErrorMessage>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleCloseEditModal}>
              取消
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isLoading={isSubmitting}
              loadingText="更新中"
            >
              更新
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

// 获取排序选项名称
const getSortOptionName = (option: string) => {
  switch (option) {
    case 'uploadDate':
      return '上传日期';
    case 'views':
      return '浏览量';
    case 'downloads':
      return '下载量';
    case 'favorites':
      return '收藏数';
    case 'rating':
      return '评分';
    default:
      return '上传日期';
  }
};

export default Home;
