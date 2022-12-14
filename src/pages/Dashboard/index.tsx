import { useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useState } from 'react';


export interface IFood {
  id: number;
  name: string;
  description: string;
  price: string;
  available?: boolean;
  image: string;
}

const Dashboard = () => {
  
  const [foods, setFoods] = useState<Array<IFood>>([])
  const [editingFood, setEditingFood] = useState<IFood>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    const getFoods = async () => {
      const response = await api.get('/foods');
      setFoods(response.data)
    }
    getFoods();
  }, [])



  const handleAddFood = async ( food : IFood) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });


      setFoods([...foods, response.data ]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async ( food: IFood ) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered)
  }


  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = ( food : IFood) => {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood as IFood}
        handleUpdateFood={handleUpdateFood}
      />
      <Header openModal={toggleModal} />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
