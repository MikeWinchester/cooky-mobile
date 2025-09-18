import { useLocalSearchParams } from 'expo-router';
import MyListDetail from '@/pages/shoppingList/MyListDetail';

export default function ListDetailPage() {
  const { id } = useLocalSearchParams();
  console.log('ListDetailPage - id from params:', id);
  
  return <MyListDetail />;
}