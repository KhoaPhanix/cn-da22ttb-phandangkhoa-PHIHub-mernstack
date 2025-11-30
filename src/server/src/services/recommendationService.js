const { Engine } = require('json-rules-engine');
const HealthMetric = require('../models/HealthMetric');

// Khởi tạo Rule Engine
const createHealthEngine = () => {
  const engine = new Engine();

  // Rule 1: Giấc ngủ không đủ
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageSleep',
          operator: 'lessThan',
          value: 7,
        },
      ],
    },
    event: {
      type: 'sleep_insufficient',
      params: {
        message: 'Giấc ngủ của bạn dưới mức khuyến nghị (< 7 giờ/ngày). Hãy cố gắng ngủ đủ giấc để cải thiện sức khỏe.',
        priority: 'high',
        category: 'sleep',
      },
    },
  });

  // Rule 2: Cân nặng giảm đột ngột
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'weightChange',
          operator: 'lessThan',
          value: -2, // Giảm hơn 2kg trong tuần
        },
      ],
    },
    event: {
      type: 'weight_loss_rapid',
      params: {
        message: 'Cân nặng của bạn giảm đột ngột. Hãy đảm bảo bạn ăn đủ chất và tham khảo ý kiến bác sĩ nếu cần.',
        priority: 'medium',
        category: 'weight',
      },
    },
  });

  // Rule 3: Thiếu hoạt động thể chất
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageExercise',
          operator: 'lessThan',
          value: 20, // < 20 phút/ngày
        },
      ],
    },
    event: {
      type: 'exercise_insufficient',
      params: {
        message: 'Bạn đang thiếu hoạt động thể chất. Cố gắng tập ít nhất 30 phút mỗi ngày để cải thiện sức khỏe tim mạch.',
        priority: 'medium',
        category: 'exercise',
      },
    },
  });

  // Rule 4: Tiêu thụ quá nhiều calo
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageCalories',
          operator: 'greaterThan',
          value: 2500,
        },
      ],
    },
    event: {
      type: 'calories_excessive',
      params: {
        message: 'Lượng calo tiêu thụ của bạn cao hơn mức trung bình. Hãy cân nhắc điều chỉnh chế độ ăn.',
        priority: 'low',
        category: 'nutrition',
      },
    },
  });

  // Rule 5: Giấc ngủ tốt
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageSleep',
          operator: 'greaterThanInclusive',
          value: 7,
        },
        {
          fact: 'averageSleep',
          operator: 'lessThanInclusive',
          value: 9,
        },
      ],
    },
    event: {
      type: 'sleep_good',
      params: {
        message: 'Giấc ngủ của bạn đang rất tốt! Hãy tiếp tục duy trì thói quen này.',
        priority: 'positive',
        category: 'sleep',
      },
    },
  });

  // Rule 6: Nhịp tim cao
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageHeartRate',
          operator: 'greaterThan',
          value: 100,
        },
      ],
    },
    event: {
      type: 'heart_rate_high',
      params: {
        message: 'Nhịp tim trung bình của bạn cao hơn bình thường. Hãy giảm stress và tham khảo ý kiến bác sĩ.',
        priority: 'high',
        category: 'heartRate',
      },
    },
  });

  // Rule 7: Số bước chân không đủ
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageSteps',
          operator: 'lessThan',
          value: 6000,
        },
      ],
    },
    event: {
      type: 'steps_insufficient',
      params: {
        message: 'Số bước chân của bạn chưa đạt mục tiêu. Cố gắng đi bộ ít nhất 8,000 bước mỗi ngày.',
        priority: 'medium',
        category: 'steps',
      },
    },
  });

  // Rule 8: Hoạt động tốt
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageSteps',
          operator: 'greaterThanInclusive',
          value: 10000,
        },
      ],
    },
    event: {
      type: 'activity_excellent',
      params: {
        message: 'Tuyệt vời! Bạn đã hoàn thành mục tiêu 10,000 bước mỗi ngày. Tiếp tục phát huy!',
        priority: 'positive',
        category: 'steps',
      },
    },
  });

  // Rule 9: BMI thấp (gầy)
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'latestBMI',
          operator: 'lessThan',
          value: 18.5,
        },
      ],
    },
    event: {
      type: 'bmi_underweight',
      params: {
        message: 'BMI của bạn thấp hơn mức bình thường (< 18.5). Hãy tăng cường dinh dưỡng và tham khảo ý kiến chuyên gia.',
        priority: 'high',
        category: 'bmi',
      },
    },
  });

  // Rule 10: BMI cao (thừa cân/béo phì)
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'latestBMI',
          operator: 'greaterThan',
          value: 24.9,
        },
      ],
    },
    event: {
      type: 'bmi_overweight',
      params: {
        message: 'BMI của bạn cao hơn mức bình thường (> 24.9). Hãy cân nhắc chế độ ăn kiêng và tăng cường vận động.',
        priority: 'high',
        category: 'bmi',
      },
    },
  });

  // Rule 11: BMI tốt
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'latestBMI',
          operator: 'greaterThanInclusive',
          value: 18.5,
        },
        {
          fact: 'latestBMI',
          operator: 'lessThanInclusive',
          value: 24.9,
        },
      ],
    },
    event: {
      type: 'bmi_normal',
      params: {
        message: 'BMI của bạn trong khoảng bình thường. Hãy duy trì chế độ ăn và sinh hoạt như hiện tại!',
        priority: 'positive',
        category: 'bmi',
      },
    },
  });

  // Rule 12: Huyết áp cao (Hypertension)
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageBloodPressure',
          operator: 'greaterThan',
          value: 130, // Systolic > 130 mmHg
        },
      ],
    },
    event: {
      type: 'blood_pressure_high',
      params: {
        message: 'Huyết áp của bạn cao hơn bình thường (> 130/80). Hãy giảm muối, tăng vận động và kiểm tra sức khỏe định kỳ.',
        priority: 'high',
        category: 'bloodPressure',
      },
    },
  });

  // Rule 13: Huyết áp thấp
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageBloodPressure',
          operator: 'lessThan',
          value: 90, // Systolic < 90 mmHg
        },
      ],
    },
    event: {
      type: 'blood_pressure_low',
      params: {
        message: 'Huyết áp của bạn thấp hơn bình thường (< 90/60). Hãy ăn đủ muối, uống đủ nước và tham khảo bác sĩ nếu có triệu chứng.',
        priority: 'medium',
        category: 'bloodPressure',
      },
    },
  });

  // Rule 14: Thiếu nước
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageWater',
          operator: 'lessThan',
          value: 2000, // < 2 lít/ngày
        },
      ],
    },
    event: {
      type: 'water_insufficient',
      params: {
        message: 'Bạn uống chưa đủ nước (< 2 lít/ngày). Hãy tăng lượng nước uống để cải thiện sức khỏe.',
        priority: 'medium',
        category: 'water',
      },
    },
  });

  // Rule 15: Uống đủ nước
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'averageWater',
          operator: 'greaterThanInclusive',
          value: 2000,
        },
      ],
    },
    event: {
      type: 'water_sufficient',
      params: {
        message: 'Bạn đang uống đủ nước! Hãy duy trì thói quen tốt này.',
        priority: 'positive',
        category: 'water',
      },
    },
  });

  return engine;
};

// Lấy dữ liệu health metrics để phân tích
const getHealthFacts = async (userId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Lấy tất cả metrics trong khoảng thời gian
  const metrics = await HealthMetric.find({
    userId,
    timestamp: { $gte: startDate },
  });

  // Tính toán các facts
  const facts = {
    averageSleep: 0,
    averageExercise: 0,
    averageCalories: 0,
    averageHeartRate: 0,
    averageSteps: 0,
    averageBloodPressure: 0,
    averageWater: 0,
    latestBMI: 0,
    weightChange: 0,
  };

  // Tính trung bình sleep
  const sleepMetrics = metrics.filter((m) => m.metricType === 'sleep');
  if (sleepMetrics.length > 0) {
    facts.averageSleep =
      sleepMetrics.reduce((sum, m) => sum + m.value, 0) / sleepMetrics.length;
  }

  // Tính trung bình exercise
  const exerciseMetrics = metrics.filter((m) => m.metricType === 'exercise');
  if (exerciseMetrics.length > 0) {
    facts.averageExercise =
      exerciseMetrics.reduce((sum, m) => sum + m.value, 0) /
      exerciseMetrics.length;
  }

  // Tính trung bình calories
  const caloriesMetrics = metrics.filter((m) => m.metricType === 'calories');
  if (caloriesMetrics.length > 0) {
    facts.averageCalories =
      caloriesMetrics.reduce((sum, m) => sum + m.value, 0) /
      caloriesMetrics.length;
  }

  // Tính trung bình heart rate
  const heartRateMetrics = metrics.filter((m) => m.metricType === 'heartRate');
  if (heartRateMetrics.length > 0) {
    facts.averageHeartRate =
      heartRateMetrics.reduce((sum, m) => sum + m.value, 0) /
      heartRateMetrics.length;
  }

  // Tính trung bình steps
  const stepsMetrics = metrics.filter((m) => m.metricType === 'steps');
  if (stepsMetrics.length > 0) {
    facts.averageSteps =
      stepsMetrics.reduce((sum, m) => sum + m.value, 0) / stepsMetrics.length;
  }

  // Tính weightChange (cân nặng hiện tại - cân nặng đầu tuần)
  const weightMetrics = metrics
    .filter((m) => m.metricType === 'weight')
    .sort((a, b) => a.timestamp - b.timestamp);

  if (weightMetrics.length >= 2) {
    facts.weightChange =
      weightMetrics[weightMetrics.length - 1].value - weightMetrics[0].value;
  }

  // Tính trung bình blood pressure (systolic)
  const bloodPressureMetrics = metrics.filter((m) => m.metricType === 'bloodPressure');
  if (bloodPressureMetrics.length > 0) {
    facts.averageBloodPressure =
      bloodPressureMetrics.reduce((sum, m) => sum + m.value, 0) /
      bloodPressureMetrics.length;
  }

  // Tính trung bình water intake
  const waterMetrics = metrics.filter((m) => m.metricType === 'water');
  if (waterMetrics.length > 0) {
    facts.averageWater =
      waterMetrics.reduce((sum, m) => sum + m.value, 0) / waterMetrics.length;
  }

  // Lấy BMI mới nhất
  const bmiMetrics = metrics
    .filter((m) => m.metricType === 'bmi')
    .sort((a, b) => b.timestamp - a.timestamp);
  
  if (bmiMetrics.length > 0) {
    facts.latestBMI = bmiMetrics[0].value;
  }

  return facts;
};

// Generate recommendations
const generateRecommendations = async (userId) => {
  try {
    const engine = createHealthEngine();
    const facts = await getHealthFacts(userId);

    const { events } = await engine.run(facts);

    // Format recommendations
    const recommendations = events.map((event) => ({
      type: event.type,
      message: event.params.message,
      priority: event.params.priority,
      category: event.params.category,
    }));

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

module.exports = { generateRecommendations };
