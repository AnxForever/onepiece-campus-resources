import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  useColorModeValue,
  HStack,
  Icon,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast
} from '@chakra-ui/react';
import { 
  FaDownload, 
  FaStar, 
  FaRegStar, 
  FaHeart, 
  FaRegHeart, 
  FaEye, 
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaCode,
  FaFileAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { Material } from '../types';
import { useStore } from '../store/useStore';
import { deleteMaterial, downloadMaterial, updateMaterialStats } from '../api';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  // 颜色
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // 状态管理
  const { admin, toggleFavorite, toggleStar, setCurrentEditingMaterial, setEditModalOpen } = useStore();
  const toast = useToast();
  
  // 删除确认对话框
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  // 处理下载
  const handleDownload = async () => {
    try {
      const response = await downloadMaterial(material.id);
      if (response.success) {
        // 更新下载统计
        await updateMaterialStats(material.id, 'downloads');
        
        // 创建下载链接
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${material.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: '下载成功',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      } else {
        toast({
          title: '下载失败',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      toast({
        title: '下载失败',
        description: '网络错误，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      console.error('下载错误:', error);
    }
  };
  
  // 处理删除
  const handleDelete = async () => {
    try {
      const response = await deleteMaterial(material.id);
      if (response.success) {
        toast({
          title: '删除成功',
          description: '资料已成功删除',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        onClose();
      } else {
        toast({
          title: '删除失败',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (error) {
      toast({
        title: '删除失败',
        description: '网络错误，请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      console.error('删除错误:', error);
    }
  };
  
  // 处理编辑
  const handleEdit = () => {
    setCurrentEditingMaterial(material);
    setEditModalOpen(true);
  };
  
  // 处理收藏
  const handleFavorite = async () => {
    toggleFavorite(material.id);
    await updateMaterialStats(material.id, 'favorites');
  };
  
  // 处理标星
  const handleStar = () => {
    toggleStar(material.id);
  };
  
  // 处理查看
  const handleView = async () => {
    await updateMaterialStats(material.id, 'views');
  };
  
  // 获取资料类型图标
  const getMaterialTypeIcon = () => {
    switch (material.materialType) {
      case 'exam':
        return FaFileAlt;
      case 'code':
        return FaCode;
      case 'note':
        return FaGraduationCap;
      default:
        return FaFileAlt;
    }
  };
  
  // 获取资料类型名称
  const getMaterialTypeName = () => {
    switch (material.materialType) {
      case 'exam':
        return '考试';
      case 'code':
        return '代码';
      case 'note':
        return '笔记';
      default:
        return '其他';
    }
  };
  
  // 获取课程类型名称
  const getCourseTypeName = () => {
    switch (material.courseType) {
      case 'dataStructure':
        return '数据结构';
      case 'algorithms':
        return '算法';
      case 'computerNetworks':
        return '计算机网络';
      case 'operatingSystems':
        return '操作系统';
      case 'databaseSystems':
        return '数据库系统';
      case 'compilers':
        return '编译原理';
      case 'computerArchitecture':
        return '计算机体系结构';
      case 'softwareEngineering':
        return '软件工程';
      case 'artificialIntelligence':
        return '人工智能';
      case 'machineLearning':
        return '机器学习';
      case 'distributedSystems':
        return '分布式系统';
      case 'computerGraphics':
        return '计算机图形学';
      default:
        return '其他';
    }
  };
  
  // 获取学期名称
  const getSemesterName = () => {
    switch (material.semester) {
      case 'spring':
        return '春季';
      case 'fall':
        return '秋季';
      case 'summer':
        return '夏季';
      case 'winter':
        return '冬季';
      default:
        return '';
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Box
      maxW={'100%'}
      w={'100%'}
      bg={bgColor}
      boxShadow={'md'}
      rounded={'md'}
      p={6}
      overflow={'hidden'}
      borderWidth={1}
      borderColor={borderColor}
      position="relative"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
      onClick={handleView}
    >
      {/* 标星按钮 */}
      <IconButton
        aria-label="Star material"
        icon={material.isStarred ? <Icon as={FaStar} color="yellow.400" /> : <Icon as={FaRegStar} />}
        size="sm"
        position="absolute"
        top={2}
        right={2}
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleStar();
        }}
      />
      
      {/* 资料类型徽章 */}
      <Badge
        colorScheme={material.materialType === 'exam' ? 'red' : material.materialType === 'code' ? 'green' : 'blue'}
        position="absolute"
        top={2}
        left={2}
      >
        <HStack spacing={1}>
          <Icon as={getMaterialTypeIcon()} />
          <Text>{getMaterialTypeName()}</Text>
        </HStack>
      </Badge>
      
      {/* 标题 */}
      <Stack mt={8} mb={4}>
        <Heading
          color={useColorModeValue('gray.700', 'white')}
          fontSize={'xl'}
          fontFamily={'body'}
          noOfLines={2}
        >
          {material.title}
        </Heading>
      </Stack>
      
      {/* 描述 */}
      <Text color={'gray.500'} noOfLines={3} mb={4}>
        {material.description}
      </Text>
      
      {/* 课程信息 */}
      <HStack spacing={2} mb={2}>
        <Icon as={FaChalkboardTeacher} color="blue.500" />
        <Text fontSize="sm">{getCourseTypeName()}</Text>
      </HStack>
      
      {/* 教师信息 */}
      {material.teacher && (
        <HStack spacing={2} mb={2}>
          <Icon as={FaChalkboardTeacher} color="purple.500" />
          <Text fontSize="sm">{material.teacher}</Text>
        </HStack>
      )}
      
      {/* 年份学期信息 */}
      {(material.year || material.semester) && (
        <HStack spacing={2} mb={2}>
          <Icon as={FaCalendarAlt} color="orange.500" />
          <Text fontSize="sm">
            {material.year}{material.year && material.semester ? ' ' : ''}
            {material.semester ? getSemesterName() : ''}
          </Text>
        </HStack>
      )}
      
      {/* 上传日期 */}
      <Text fontSize="xs" color="gray.500" mb={4}>
        上传于 {formatDate(material.uploadDate)}
      </Text>
      
      {/* 统计信息 */}
      <HStack spacing={4} mt={4}>
        <Tooltip label="浏览量">
          <HStack spacing={1}>
            <Icon as={FaEye} color="gray.500" />
            <Text fontSize="sm">{material.views}</Text>
          </HStack>
        </Tooltip>
        
        <Tooltip label="下载量">
          <HStack spacing={1}>
            <Icon as={FaDownload} color="gray.500" />
            <Text fontSize="sm">{material.downloads}</Text>
          </HStack>
        </Tooltip>
        
        <Tooltip label="收藏数">
          <HStack spacing={1}>
            <Icon as={FaHeart} color="red.400" />
            <Text fontSize="sm">{material.favorites}</Text>
          </HStack>
        </Tooltip>
      </HStack>
      
      {/* 操作按钮 */}
      <HStack spacing={2} mt={4} justifyContent="space-between">
        {/* 下载按钮 */}
        <Button
          leftIcon={<FaDownload />}
          colorScheme="blue"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          下载
        </Button>
        
        {/* 收藏按钮 */}
        <Button
          leftIcon={material.isFavorited ? <FaHeart /> : <FaRegHeart />}
          colorScheme={material.isFavorited ? 'red' : 'gray'}
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite();
          }}
        >
          {material.isFavorited ? '已收藏' : '收藏'}
        </Button>
        
        {/* 管理员操作菜单 */}
        {admin.isAdminMode && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaEllipsisV />}
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList onClick={(e) => e.stopPropagation()}>
              <MenuItem icon={<FaEdit />} onClick={handleEdit}>
                编辑
              </MenuItem>
              <MenuItem icon={<FaTrash />} color="red.500" onClick={onOpen}>
                删除
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
      
      {/* 删除确认对话框 */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              删除资料
            </AlertDialogHeader>

            <AlertDialogBody>
              确定要删除 "{material.title}" 吗？此操作无法撤销。
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                取消
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MaterialCard;
