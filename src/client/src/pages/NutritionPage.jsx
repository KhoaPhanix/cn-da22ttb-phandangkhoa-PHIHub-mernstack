import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDailyNutrition, createNutritionLog, deleteNutritionLog, getNutritionStats } from '../services/nutritionService';
import { format } from 'date-fns';
import { mealTemplates, searchFoods, estimateMacros } from '../data/foodDatabase';

const NutritionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState(null);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodItems: [{ name: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fats: '' }],
    notes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dailyRes, statsRes] = await Promise.all([
        getDailyNutrition(selectedDate),
        getNutritionStats({ days: 7 }),
      ]);
      
      const dailyResData = dailyRes.data?.data || dailyRes.data || null;
      const statsResData = statsRes.data?.data || statsRes.data || null;
      
      setDailyData(dailyResData);
      setStats(statsResData);
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể tải dữ liệu dinh dưỡng. Vui lòng đăng nhập lại.');
      setDailyData(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nutritionData = {
        date: new Date(selectedDate).toISOString(),
        mealType: formData.mealType,
        foodItems: formData.foodItems.map(item => ({
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          calories: parseFloat(item.calories),
          macros: {
            protein: parseFloat(item.protein) || 0,
            carbs: parseFloat(item.carbs) || 0,
            fats: parseFloat(item.fats) || 0,
          },
        })),
        notes: formData.notes,
      };

      const response = await createNutritionLog(nutritionData);
      alert('Lưu nhật ký dinh dưỡng thành công!');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể lưu nhật ký'}`);
    }
  };

  const handleDeleteMeal = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bữa ăn này?')) {
      try {
        await deleteNutritionLog(id);
        fetchData();
      } catch (error) {
        setError(error.response?.data?.message || 'Không thể xóa bữa ăn');
      }
    }
  };

  const addFoodItem = () => {
    setFormData({
      ...formData,
      foodItems: [...formData.foodItems, { name: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fats: '' }],
    });
  };

  const removeFoodItem = (index) => {
    setFormData({
      ...formData,
      foodItems: formData.foodItems.filter((_, i) => i !== index),
    });
  };

  const updateFoodItem = (index, field, value) => {
    const newItems = [...formData.foodItems];
    newItems[index][field] = value;
    
    // Tự động search khi nhập tên món
    if (field === 'name') {
      setActiveInputIndex(index);
      setSearchQuery(value);
      if (value.length > 0) {
        setSearchResults(searchFoods(value));
      } else {
        setSearchResults([]);
      }
    }
    
    // Tự động tính macros khi nhập calories
    if (field === 'calories' && value && !newItems[index].protein && !newItems[index].carbs && !newItems[index].fats) {
      const macros = estimateMacros(parseFloat(value));
      newItems[index].protein = macros.protein;
      newItems[index].carbs = macros.carbs;
      newItems[index].fats = macros.fats;
    }
    
    setFormData({ ...formData, foodItems: newItems });
  };
  
  const selectFood = (index, food) => {
    const newItems = [...formData.foodItems];
    newItems[index] = {
      name: food.name,
      quantity: food.defaultQuantity || 100,
      unit: food.unit,
      calories: Math.round((food.calories * (food.defaultQuantity || 100)) / 100),
      protein: Math.round((food.protein * (food.defaultQuantity || 100)) / 100 * 10) / 10,
      carbs: Math.round((food.carbs * (food.defaultQuantity || 100)) / 100 * 10) / 10,
      fats: Math.round((food.fats * (food.defaultQuantity || 100)) / 100 * 10) / 10,
    };
    setFormData({ ...formData, foodItems: newItems });
    setSearchResults([]);
    setSearchQuery('');
    setActiveInputIndex(null);
  };
  
  const loadTemplate = (template) => {
    setFormData({
      mealType: template.mealType,
      foodItems: template.foodItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
      })),
      notes: template.description,
    });
    setShowTemplates(false);
  };

  const resetForm = () => {
    setFormData({
      mealType: 'breakfast',
      foodItems: [{ name: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fats: '' }],
      notes: '',
    });
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: 'breakfast_dining',
      lunch: 'lunch_dining',
      dinner: 'dinner_dining',
      snack: 'cookie',
    };
    return icons[type] || 'restaurant';
  };

  const getMealName = (type) => {
    const names = {
      breakfast: 'Sáng',
      lunch: 'Trưa',
      dinner: 'Tối',
      snack: 'Ăn vặt',
    };
    return names[type] || type;
  };

  const macrosData = dailyData?.totalMacros ? [
    { name: 'Đạm', value: dailyData.totalMacros.protein || 0, color: '#ef4444' },
    { name: 'Tinh bột', value: dailyData.totalMacros.carbs || 0, color: '#3b82f6' },
    { name: 'Chất béo', value: dailyData.totalMacros.fats || 0, color: '#f59e0b' },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Navbar />
      
      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="material-symbols-outlined">error</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Nhật Ký Dinh Dưỡng
              </h1>
              <p className="text-gray-600 dark:text-[#9db9ab] text-base mt-2">
                Theo dõi bữa ăn và dinh dưỡng hàng ngày
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">add</span>
              Thêm Bữa Ăn
            </button>
          </div>

          {/* Date Picker */}
          <div className="mb-8">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-4 py-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Daily Summary */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
              <h3 className="text-black dark:text-white text-xl font-bold mb-4">Tổng kết hôm nay</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#9db9ab]">Tổng Calories</span>
                  <span className="text-black dark:text-white text-2xl font-bold">
                    {dailyData?.totalCalories || 0} kcal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#9db9ab]">Chất đạm (Protein)</span>
                  <span className="text-red-500 font-semibold">
                    {dailyData?.totalMacros?.protein?.toFixed(1) || 0}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#9db9ab]">Tinh bột (Carbs)</span>
                  <span className="text-blue-500 font-semibold">
                    {dailyData?.totalMacros?.carbs?.toFixed(1) || 0}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#9db9ab]">Chất béo (Fat)</span>
                  <span className="text-yellow-500 font-semibold">
                    {dailyData?.totalMacros?.fats?.toFixed(1) || 0}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#9db9ab]">Chất xơ (Fiber)</span>
                  <span className="text-green-500 font-semibold">
                    {dailyData?.totalMacros?.fiber?.toFixed(1) || 0}g
                  </span>
                </div>
              </div>
            </div>

            {/* Macros Chart */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
              <h3 className="text-black dark:text-white text-xl font-bold mb-4">Phân bố chất dinh dưỡng</h3>
              {macrosData.reduce((sum, item) => sum + item.value, 0) > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macrosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {macrosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-gray-500 dark:text-gray-600">Chưa có dữ liệu</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Stats */}
          {stats && (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-black dark:text-white text-xl font-bold mb-4">Thống kê 7 ngày qua</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-1">TB Calories/ngày</p>
                  <p className="text-black dark:text-white text-2xl font-bold">
                    {stats?.avgCaloriesPerDay?.toFixed(0) || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-1">TB Đạm/ngày</p>
                  <p className="text-red-500 text-2xl font-bold">
                    {((stats?.totalProtein || 0) / 7).toFixed(0)}g
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-1">TB Tinh bột/ngày</p>
                  <p className="text-blue-500 text-2xl font-bold">
                    {((stats?.totalCarbs || 0) / 7).toFixed(0)}g
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-1">TB Chất béo/ngày</p>
                  <p className="text-yellow-500 text-2xl font-bold">
                    {((stats?.totalFats || 0) / 7).toFixed(0)}g
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Meals List */}
          <h3 className="text-black dark:text-white text-2xl font-bold mb-4">Bữa ăn hôm nay</h3>
          {!dailyData || !dailyData.meals || dailyData.meals.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                restaurant
              </span>
              <p className="text-gray-600 dark:text-[#9db9ab] text-lg">
                Chưa có bữa ăn nào. Hãy thêm bữa ăn đầu tiên!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyData.meals.map((meal) => (
                <div
                  key={meal._id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        {getMealIcon(meal.mealType)}
                      </span>
                      <div>
                        <h4 className="text-black dark:text-white text-lg font-bold">
                          Bữa {getMealName(meal.mealType)}
                        </h4>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-sm">
                          {format(new Date(meal.date), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMeal(meal._id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  {/* Food Items */}
                  <div className="space-y-2 mb-4">
                    <div className="text-gray-400 text-xs font-medium mb-2">Chi tiết món ăn:</div>
                    {meal.foodItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm bg-[#1c2721]/30 rounded p-2">
                        <div className="flex-1">
                          <span className="text-black dark:text-white font-medium">
                            {item.name}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.quantity}{item.unit} · {item.calories} kcal
                            {item.macros && (
                              <span className="ml-2">
                                P: {item.macros.protein}g · C: {item.macros.carbs}g · F: {item.macros.fats}g
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meal Summary */}
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Calories</p>
                        <p className="text-black dark:text-white font-semibold">{meal.totalCalories || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Protein</p>
                        <p className="text-red-500 font-semibold">{meal.totalMacros?.protein?.toFixed(0) || 0}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Carbs</p>
                        <p className="text-blue-500 font-semibold">{meal.totalMacros?.carbs?.toFixed(0) || 0}g</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Fats</p>
                        <p className="text-yellow-500 font-semibold">{meal.totalMacros?.fats?.toFixed(0) || 0}g</p>
                      </div>
                    </div>
                  </div>

                  {meal.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-[#9db9ab] text-sm italic">{meal.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#111814] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Thêm Bữa Ăn</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setSearchResults([]);
                  setShowTemplates(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meal Type Selection */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Bữa ăn *</label>
                <select
                  required
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="breakfast">Bữa Sáng</option>
                  <option value="lunch">Bữa Trưa</option>
                  <option value="dinner">Bữa Tối</option>
                  <option value="snack">Ăn Vặt</option>
                </select>
              </div>

              {/* Template Suggestions */}
              <div className="bg-[#1c2721] border border-[#3b5447] rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center justify-between w-full text-white mb-3"
                >
                  <span className="font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined">restaurant_menu</span>
                    Chọn bữa ăn mẫu
                  </span>
                  <span className="material-symbols-outlined">
                    {showTemplates ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                
                {showTemplates && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mealTemplates
                      .filter(t => t.mealType === formData.mealType)
                      .map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => loadTemplate(template)}
                          className="text-left p-3 bg-[#111814] hover:bg-[#1c2721] border border-[#3b5447] rounded-lg transition-colors"
                        >
                          <div className="text-primary font-medium mb-1">{template.name}</div>
                          <div className="text-gray-400 text-xs mb-2">{template.description}</div>
                          <div className="text-white text-sm font-semibold">{template.totalCalories} kcal</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Food Items */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white text-sm font-medium">Món ăn *</label>
                  <button
                    type="button"
                    onClick={addFoodItem}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    + Thêm món
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.foodItems.map((item, idx) => (
                    <div key={idx} className="bg-[#1c2721] border border-[#3b5447] rounded-lg p-4 relative">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white text-sm font-medium">Món #{idx + 1}</span>
                        {formData.foodItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFoodItem(idx)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Tên món với search */}
                        <div className="col-span-2 relative">
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => updateFoodItem(idx, 'name', e.target.value)}
                            onFocus={() => setActiveInputIndex(idx)}
                            className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Tên món ăn (gõ để tìm kiếm)"
                          />
                          
                          {/* Search Results Dropdown */}
                          {activeInputIndex === idx && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-[#111814] border border-[#3b5447] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {searchResults.map((food, foodIdx) => (
                                <button
                                  key={foodIdx}
                                  type="button"
                                  onClick={() => selectFood(idx, food)}
                                  className="w-full text-left px-3 py-2 hover:bg-[#1c2721] text-white text-sm border-b border-[#3b5447] last:border-b-0"
                                >
                                  <div className="font-medium">{food.name}</div>
                                  <div className="text-xs text-gray-400">
                                    {food.calories} kcal / {food.unit} · P: {food.protein}g · C: {food.carbs}g · F: {food.fats}g
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="number"
                            step="0.1"
                            required
                            value={item.quantity}
                            onChange={(e) => updateFoodItem(idx, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Khối lượng"
                          />
                        </div>
                        <div>
                          <select
                            value={item.unit}
                            onChange={(e) => updateFoodItem(idx, 'unit', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="portion">phần</option>
                            <option value="piece">miếng</option>
                            <option value="quả">quả</option>
                            <option value="bát">bát</option>
                            <option value="hộp">hộp</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            step="0.1"
                            required
                            value={item.calories}
                            onChange={(e) => updateFoodItem(idx, 'calories', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Calories (tự động tính macros nếu để trống)"
                          />
                        </div>
                        
                        {/* Macros - optional */}
                        <div className="col-span-2">
                          <details className="text-sm">
                            <summary className="text-gray-400 cursor-pointer hover:text-white mb-2">
                              Chi tiết dinh dưỡng (tùy chọn)
                            </summary>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <input
                                type="number"
                                step="0.1"
                                value={item.protein}
                                onChange={(e) => updateFoodItem(idx, 'protein', e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Đạm (g)"
                              />
                              <input
                                type="number"
                                step="0.1"
                                value={item.carbs}
                                onChange={(e) => updateFoodItem(idx, 'carbs', e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Tinh bột (g)"
                              />
                              <input
                                type="number"
                                step="0.1"
                                value={item.fats}
                                onChange={(e) => updateFoodItem(idx, 'fats', e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#111814] border border-[#3b5447] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Chất béo (g)"
                              />
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                  placeholder="Thêm ghi chú..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setSearchResults([]);
                    setShowTemplates(false);
                  }}
                  className="flex-1 px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Thêm bữa ăn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default NutritionPage;
