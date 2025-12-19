// Database món ăn phổ biến tại Việt Nam
export const commonFoods = {
  // Cơm và món chính
  rice: [
    { name: 'Cơm trắng', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: '100g', defaultQuantity: 200 },
    { name: 'Cơm gạo lứt', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, unit: '100g', defaultQuantity: 200 },
    { name: 'Xôi trắng', calories: 116, protein: 2.4, carbs: 24.9, fats: 0.2, unit: '100g', defaultQuantity: 150 },
  ],
  protein: [
    { name: 'Thịt gà luộc (phi lê)', calories: 165, protein: 31, carbs: 0, fats: 3.6, unit: '100g', defaultQuantity: 150 },
    { name: 'Thịt gà chiên', calories: 246, protein: 27, carbs: 8, fats: 12, unit: '100g', defaultQuantity: 150 },
    { name: 'Thịt heo luộc', calories: 242, protein: 27, carbs: 0, fats: 14, unit: '100g', defaultQuantity: 100 },
    { name: 'Thịt bò xào', calories: 250, protein: 26, carbs: 3, fats: 15, unit: '100g', defaultQuantity: 100 },
    { name: 'Cá hồi nướng', calories: 206, protein: 22, carbs: 0, fats: 13, unit: '100g', defaultQuantity: 150 },
    { name: 'Cá thu rim', calories: 190, protein: 23, carbs: 5, fats: 9, unit: '100g', defaultQuantity: 100 },
    { name: 'Trứng gà luộc', calories: 155, protein: 13, carbs: 1.1, fats: 11, unit: 'quả', defaultQuantity: 2 },
    { name: 'Trứng chiên', calories: 196, protein: 13.6, carbs: 0.8, fats: 15, unit: 'quả', defaultQuantity: 2 },
    { name: 'Đậu hũ chiên', calories: 271, protein: 17, carbs: 10, fats: 20, unit: '100g', defaultQuantity: 100 },
    { name: 'Tôm luộc', calories: 99, protein: 24, carbs: 0.2, fats: 0.3, unit: '100g', defaultQuantity: 100 },
  ],
  vegetables: [
    { name: 'Rau cải luộc', calories: 13, protein: 1.5, carbs: 2.2, fats: 0.2, unit: '100g', defaultQuantity: 100 },
    { name: 'Súp lơ xanh', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, unit: '100g', defaultQuantity: 100 },
    { name: 'Cà rót xào', calories: 35, protein: 1.2, carbs: 8.6, fats: 0.2, unit: '100g', defaultQuantity: 100 },
    { name: 'Dưa chuột', calories: 16, protein: 0.7, carbs: 3.6, fats: 0.1, unit: '100g', defaultQuantity: 100 },
    { name: 'Cà chua', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, unit: '100g', defaultQuantity: 100 },
    { name: 'Canh chua', calories: 45, protein: 3, carbs: 8, fats: 0.5, unit: '100ml', defaultQuantity: 200 },
    { name: 'Canh rau', calories: 25, protein: 1.5, carbs: 5, fats: 0.3, unit: '100ml', defaultQuantity: 200 },
  ],
  snacks: [
    { name: 'Chuối', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, unit: 'quả', defaultQuantity: 1 },
    { name: 'Táo', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, unit: 'quả', defaultQuantity: 1 },
    { name: 'Cam', calories: 47, protein: 0.9, carbs: 12, fats: 0.1, unit: 'quả', defaultQuantity: 1 },
    { name: 'Sữa chua không đường', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, unit: 'hộp 100ml', defaultQuantity: 1 },
    { name: 'Hạt hạnh nhân', calories: 579, protein: 21, carbs: 22, fats: 50, unit: '100g', defaultQuantity: 30 },
    { name: 'Bánh mì nguyên cám', calories: 247, protein: 13, carbs: 41, fats: 4, unit: '100g', defaultQuantity: 50 },
  ],
  drinks: [
    { name: 'Nước lọc', calories: 0, protein: 0, carbs: 0, fats: 0, unit: 'ml', defaultQuantity: 250 },
    { name: 'Trà xanh không đường', calories: 2, protein: 0, carbs: 0, fats: 0, unit: 'ml', defaultQuantity: 250 },
    { name: 'Cà phê đen', calories: 2, protein: 0.3, carbs: 0, fats: 0, unit: 'ml', defaultQuantity: 200 },
    { name: 'Sữa tươi không đường', calories: 42, protein: 3.4, carbs: 5, fats: 1, unit: '100ml', defaultQuantity: 200 },
    { name: 'Nước cam ép', calories: 45, protein: 0.7, carbs: 10, fats: 0.2, unit: '100ml', defaultQuantity: 200 },
  ]
};

// Template bữa ăn mẫu
export const mealTemplates = [
  {
    id: 'breakfast_1',
    name: 'Bữa sáng giảm cân',
    mealType: 'breakfast',
    description: 'Bữa sáng lành mạnh, ít calo',
    totalCalories: 350,
    foodItems: [
      { name: 'Bánh mì nguyên cám', quantity: 50, unit: 'g', calories: 124, protein: 6.5, carbs: 20.5, fats: 2 },
      { name: 'Trứng gà luộc', quantity: 2, unit: 'quả', calories: 155, protein: 13, carbs: 1.1, fats: 11 },
      { name: 'Cà chua', quantity: 100, unit: 'g', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2 },
      { name: 'Sữa tươi không đường', quantity: 200, unit: 'ml', calories: 84, protein: 6.8, carbs: 10, fats: 2 },
    ]
  },
  {
    id: 'breakfast_2',
    name: 'Bữa sáng Việt Nam',
    mealType: 'breakfast',
    description: 'Bữa sáng truyền thống',
    totalCalories: 420,
    foodItems: [
      { name: 'Xôi trắng', quantity: 150, unit: 'g', calories: 174, protein: 3.6, carbs: 37.3, fats: 0.3 },
      { name: 'Thịt gà luộc (phi lê)', quantity: 100, unit: 'g', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
      { name: 'Dưa chuột', quantity: 50, unit: 'g', calories: 8, protein: 0.35, carbs: 1.8, fats: 0.05 },
      { name: 'Trà xanh không đường', quantity: 250, unit: 'ml', calories: 2, protein: 0, carbs: 0, fats: 0 },
    ]
  },
  {
    id: 'lunch_1',
    name: 'Cơm gà trưa',
    mealType: 'lunch',
    description: 'Suất cơm gà đầy đủ dinh dưỡng',
    totalCalories: 620,
    foodItems: [
      { name: 'Cơm trắng', quantity: 200, unit: 'g', calories: 260, protein: 5.4, carbs: 56, fats: 0.6 },
      { name: 'Thịt gà luộc (phi lê)', quantity: 150, unit: 'g', calories: 248, protein: 46.5, carbs: 0, fats: 5.4 },
      { name: 'Rau cải luộc', quantity: 100, unit: 'g', calories: 13, protein: 1.5, carbs: 2.2, fats: 0.2 },
      { name: 'Canh rau', quantity: 200, unit: 'ml', calories: 50, protein: 3, carbs: 10, fats: 0.6 },
      { name: 'Cam', quantity: 1, unit: 'quả', calories: 47, protein: 0.9, carbs: 12, fats: 0.1 },
    ]
  },
  {
    id: 'lunch_2',
    name: 'Cơm văn phòng',
    mealType: 'lunch',
    description: 'Bữa trưa cho dân văn phòng',
    totalCalories: 680,
    foodItems: [
      { name: 'Cơm trắng', quantity: 200, unit: 'g', calories: 260, protein: 5.4, carbs: 56, fats: 0.6 },
      { name: 'Thịt heo luộc', quantity: 100, unit: 'g', calories: 242, protein: 27, carbs: 0, fats: 14 },
      { name: 'Đậu hũ chiên', quantity: 50, unit: 'g', calories: 136, protein: 8.5, carbs: 5, fats: 10 },
      { name: 'Canh chua', quantity: 200, unit: 'ml', calories: 90, protein: 6, carbs: 16, fats: 1 },
    ]
  },
  {
    id: 'dinner_1',
    name: 'Bữa tối giảm cân',
    mealType: 'dinner',
    description: 'Ít tinh bột, nhiều protein',
    totalCalories: 450,
    foodItems: [
      { name: 'Cơm gạo lứt', quantity: 150, unit: 'g', calories: 167, protein: 3.9, carbs: 34.5, fats: 1.4 },
      { name: 'Cá hồi nướng', quantity: 150, unit: 'g', calories: 309, protein: 33, carbs: 0, fats: 19.5 },
      { name: 'Súp lơ xanh', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
      { name: 'Canh rau', quantity: 150, unit: 'ml', calories: 38, protein: 2.25, carbs: 7.5, fats: 0.45 },
    ]
  },
  {
    id: 'dinner_2',
    name: 'Bữa tối cân bằng',
    mealType: 'dinner',
    description: 'Cân bằng đầy đủ chất',
    totalCalories: 580,
    foodItems: [
      { name: 'Cơm trắng', quantity: 180, unit: 'g', calories: 234, protein: 4.9, carbs: 50.4, fats: 0.54 },
      { name: 'Thịt bò xào', quantity: 100, unit: 'g', calories: 250, protein: 26, carbs: 3, fats: 15 },
      { name: 'Cà rót xào', quantity: 100, unit: 'g', calories: 35, protein: 1.2, carbs: 8.6, fats: 0.2 },
      { name: 'Canh chua', quantity: 200, unit: 'ml', calories: 90, protein: 6, carbs: 16, fats: 1 },
    ]
  },
  {
    id: 'snack_1',
    name: 'Ăn vặt lành mạnh',
    mealType: 'snack',
    description: 'Bổ sung năng lượng giữa bữa',
    totalCalories: 220,
    foodItems: [
      { name: 'Chuối', quantity: 1, unit: 'quả', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
      { name: 'Sữa chua không đường', quantity: 1, unit: 'hộp 100ml', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
      { name: 'Hạt hạnh nhân', quantity: 30, unit: 'g', calories: 174, protein: 6.3, carbs: 6.6, fats: 15 },
    ]
  },
  {
    id: 'snack_2',
    name: 'Ăn vặt protein',
    mealType: 'snack',
    description: 'Nhiều protein, ít carb',
    totalCalories: 180,
    foodItems: [
      { name: 'Trứng gà luộc', quantity: 1, unit: 'quả', calories: 78, protein: 6.5, carbs: 0.6, fats: 5.5 },
      { name: 'Sữa tươi không đường', quantity: 200, unit: 'ml', calories: 84, protein: 6.8, carbs: 10, fats: 2 },
      { name: 'Táo', quantity: 1, unit: 'quả', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
    ]
  },
];

// Danh sách món ăn đầy đủ cho tìm kiếm
export const allFoods = [
  ...commonFoods.rice,
  ...commonFoods.protein,
  ...commonFoods.vegetables,
  ...commonFoods.snacks,
  ...commonFoods.drinks,
].sort((a, b) => a.name.localeCompare(b.name, 'vi'));

// Hàm tìm kiếm món ăn
export const searchFoods = (query) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

// Hàm lấy template theo mealType
export const getTemplatesByMealType = (mealType) => {
  return mealTemplates.filter(template => template.mealType === mealType);
};

// Hàm tính toán tự động macros từ calories (công thức đơn giản)
export const estimateMacros = (calories, type = 'balanced') => {
  // Công thức phân bổ macros theo loại món ăn
  const ratios = {
    balanced: { protein: 0.3, carbs: 0.4, fats: 0.3 },    // Cân bằng
    lowCarb: { protein: 0.4, carbs: 0.2, fats: 0.4 },     // Ít carb
    highProtein: { protein: 0.5, carbs: 0.3, fats: 0.2 }, // Nhiều protein
  };
  
  const ratio = ratios[type] || ratios.balanced;
  
  // 1g protein = 4 cal, 1g carbs = 4 cal, 1g fats = 9 cal
  return {
    protein: Math.round((calories * ratio.protein) / 4),
    carbs: Math.round((calories * ratio.carbs) / 4),
    fats: Math.round((calories * ratio.fats) / 9),
  };
};
