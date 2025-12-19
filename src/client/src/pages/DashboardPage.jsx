import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';
import Footer from '../components/Footer';
import { getMetrics, getMetricStats } from '../services/metricsService';
import { getRecommendations } from '../services/recommendationService';
import { getGoals } from '../services/goalService';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [weightData, setWeightData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [bmiData, setBmiData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [bloodPressureData, setBloodPressureData] = useState([]);
  const [stats, setStats] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Helper function to safely format metric data
  const formatMetricData = (dataArray, dateFormat = 'dd/MM/yyyy') => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }
    
    return dataArray
      .map((item) => {
        if (!item || !item.timestamp) return null;
        return {
          date: format(new Date(item.timestamp), dateFormat),
          value: item.value || 0,
        };
      })
      .filter(item => item !== null)
      .reverse();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const startDate = subDays(new Date(), 60).toISOString();
      
      // Weight Data
      try {
        console.log('📊 Fetching weight data...');
        const weightResponse = await getMetrics({
          metricType: 'weight',
          startDate,
          limit: 60,
        });
        
        console.log('🔍 Weight Response:', weightResponse);
        const weightDataArray = Array.isArray(weightResponse.data) ? weightResponse.data : [];
        console.log('🔍 Weight Data Length:', weightDataArray.length);
        setWeightData(formatMetricData(weightDataArray, 'dd/MM'));
      } catch (error) {
        console.error('❌ Error fetching weight:', error);
        setWeightData([]);
      }

      const sleepStartDate = subDays(new Date(), 7).toISOString();

      // Sleep Data
      try {
        console.log('📊 Fetching sleep data...');
        const sleepResponse = await getMetrics({
          metricType: 'sleep',
          startDate: sleepStartDate,
          limit: 7,
        });
        
        const sleepDataArray = Array.isArray(sleepResponse.data) ? sleepResponse.data : [];
        setSleepData(formatMetricData(sleepDataArray, 'dd/MM'));
      } catch (error) {
        console.error('❌ Error fetching sleep:', error);
        setSleepData([]);
      }

      // BMI Data
      try {
        console.log('📊 Fetching BMI data...');
        const bmiResponse = await getMetrics({
          metricType: 'bmi',
          startDate,
          limit: 60,
        });
        
        const bmiDataArray = Array.isArray(bmiResponse.data) ? bmiResponse.data : [];
        setBmiData(formatMetricData(bmiDataArray, 'dd/MM'));
      } catch (error) {
        console.error('❌ Error fetching BMI:', error);
        setBmiData([]);
      }

      // Water Data
      try {
        console.log('📊 Fetching water data...');
        const waterResponse = await getMetrics({
          metricType: 'water',
          startDate: sleepStartDate,
          limit: 7,
        });
        
        const waterDataArray = Array.isArray(waterResponse.data) ? waterResponse.data : [];
        setWaterData(formatMetricData(waterDataArray, 'dd/MM'));
      } catch (error) {
        console.error('❌ Error fetching water:', error);
        setWaterData([]);
      }

      // Blood Pressure Data
      try {
        console.log('📊 Fetching blood pressure data...');
        const bpResponse = await getMetrics({
          metricType: 'bloodPressure',
          startDate,
          limit: 60,
        });
        
        const bpDataArray = Array.isArray(bpResponse.data) ? bpResponse.data : [];
        const formattedBPData = bpDataArray
          .map((item) => {
            if (!item || !item.timestamp) return null;
            return {
              date: format(new Date(item.timestamp), 'dd/MM'),
              systolic: item.value || 0,
              diastolic: item.metadata?.diastolic || 80,
            };
          })
          .filter(item => item !== null)
          .reverse();
        
        setBloodPressureData(formattedBPData);
      } catch (error) {
        console.error('❌ Error fetching blood pressure:', error);
        setBloodPressureData([]);
      }

      // Stats Data
      try {
        console.log('📊 Fetching stats...');
        const [weightStats, sleepStats, caloriesStats, exerciseStats, bmiStats, bloodPressureStats, heartRateStats, stepsStats, waterStats] = await Promise.all([
        getMetricStats('weight', 30),
        getMetricStats('sleep', 7),
        getMetricStats('calories', 7),
        getMetricStats('exercise', 7),
        getMetricStats('bmi', 30),
        getMetricStats('bloodPressure', 7),
        getMetricStats('heartRate', 7),
        getMetricStats('steps', 7),
        getMetricStats('water', 7),
      ]);

      setStats({
        weight: weightStats.data || {},
        sleep: sleepStats.data || {},
        calories: caloriesStats.data || {},
        exercise: exerciseStats.data || {},
        bmi: bmiStats.data || {},
        bloodPressure: bloodPressureStats.data || {},
        heartRate: heartRateStats.data || {},
        steps: stepsStats.data || {},
        water: waterStats.data || {},
      });
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
        setStats({
          weight: {},
          sleep: {},
          calories: {},
          exercise: {},
          bmi: {},
          bloodPressure: {},
          heartRate: {},
          steps: {},
          water: {},
        });
      }

      // Recommendations
      try {
        console.log('📊 Fetching recommendations...');
        const recsResponse = await getRecommendations();
        setRecommendations(Array.isArray(recsResponse.data) ? recsResponse.data : []);
      } catch (error) {
        console.error('❌ Error fetching recommendations:', error);
        setRecommendations([]);
      }

      // Active Goals
      try {
        console.log('📊 Fetching active goals...');
        const goalsResponse = await getGoals({ status: 'active' });
        const goalsData = Array.isArray(goalsResponse.data) ? goalsResponse.data : [];
        setActiveGoals(goalsData.slice(0, 3)); // Show top 3 goals
      } catch (error) {
        console.error('❌ Error fetching active goals:', error);
        setActiveGoals([]);
      }

      console.log('✅ Dashboard data loaded successfully!');

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Set empty data to prevent rendering errors
      setWeightData([]);
      setSleepData([]);
      setBmiData([]);
      setWaterData([]);
      setBloodPressureData([]);
      setStats({});
      setRecommendations([]);
      setActiveGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'buổi sáng';
    if (hour < 18) return 'buổi chiều';
    return 'buổi tối';
  };

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
      
      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between items-start gap-4 p-4 sm:p-6 md:p-8">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Chào {getTimeGreeting()}, {user?.name || 'bạn'}!
              </p>
              <div className="flex items-center gap-3 text-gray-600 dark:text-[#9db9ab]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <span className="text-base font-medium">
                    {format(currentTime, 'EEEE, dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span className="text-base font-medium">
                    {format(currentTime, 'HH:mm')}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                Nhìn chung, sức khỏe của bạn đang ổn định. Hãy tiếp tục duy trì nhé!
              </p>
            </div>
            <button 
              onClick={() => navigate('/metrics')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark gap-2 pl-3 text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-background-dark">add</span>
              <span className="truncate">Thêm chỉ số mới</span>
            </button>
          </div>

          {/* Alert Banner */}
          <div className="px-4 sm:px-6 md:px-8">
            <AlertBanner />
          </div>

          {/* Active Goals Section */}
          {activeGoals.length > 0 && (
            <div className="px-4 sm:px-6 md:px-8 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-black dark:text-white text-xl font-bold">
                  Mục tiêu của tôi
                </h3>
                <button
                  onClick={() => navigate('/goals')}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeGoals.map((goal) => (
                  <div
                    key={goal._id}
                    className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/goals')}
                  >
                    <h4 className="text-black dark:text-white font-bold mb-2">{goal.title}</h4>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-[#9db9ab]">Tiến độ</span>
                      <span className="text-black dark:text-white font-semibold">
                        {goal.progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-gray-600 dark:text-[#9db9ab]">
                      <span>{goal.currentValue} {goal.unit}</span>
                      <span>→ {goal.targetValue} {goal.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 md:px-8">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Cân nặng</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.weight?.latest?.toFixed(1) || '--'} kg
              </p>
              <p className={`text-base font-medium leading-normal ${
                stats.weight?.change >= 0 ? 'text-green-500 dark:text-[#0bda46]' : 'text-red-500 dark:text-[#fa5538]'
              }`}>
                {stats.weight?.change >= 0 ? '+' : ''}{stats.weight?.change?.toFixed(1) || '0'}kg
              </p>
            </div>

            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">BMI</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.bmi?.latest?.toFixed(1) || '--'}
              </p>
              <p className={`text-base font-medium leading-normal ${
                (stats.bmi?.latest >= 18.5 && stats.bmi?.latest <= 24.9) 
                  ? 'text-green-500 dark:text-[#0bda46]' 
                  : 'text-orange-500 dark:text-[#ff9500]'
              }`}>
                {(stats.bmi?.latest >= 18.5 && stats.bmi?.latest <= 24.9) ? 'Bình thường' : 'Cần chú ý'}
              </p>
            </div>
            
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Huyết áp</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.bloodPressure?.latest?.toFixed(0) || '--'}/80
              </p>
              <p className={`text-base font-medium leading-normal ${
                (stats.bloodPressure?.latest >= 90 && stats.bloodPressure?.latest <= 130)
                  ? 'text-green-500 dark:text-[#0bda46]'
                  : 'text-red-500 dark:text-[#fa5538]'
              }`}>
                {(stats.bloodPressure?.latest >= 90 && stats.bloodPressure?.latest <= 130) ? 'Bình thường' : 'Cần kiểm tra'}
              </p>
            </div>

            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Nhịp tim</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.heartRate?.latest?.toFixed(0) || '--'} bpm
              </p>
              <p className={`text-base font-medium leading-normal ${
                (stats.heartRate?.latest >= 60 && stats.heartRate?.latest <= 100)
                  ? 'text-green-500 dark:text-[#0bda46]'
                  : 'text-orange-500 dark:text-[#ff9500]'
              }`}>
                {(stats.heartRate?.latest >= 60 && stats.heartRate?.latest <= 100) ? 'Bình thường' : 'Bất thường'}
              </p>
            </div>
            
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Giấc ngủ</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.sleep?.average?.toFixed(1) || '--'} giờ
              </p>
              <p className="text-green-500 dark:text-[#0bda46] text-base font-medium leading-normal">
                {stats.sleep?.average >= 7 ? 'Đủ giấc' : 'Cần cải thiện'}
              </p>
            </div>

            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Số bước</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.steps?.average?.toFixed(0) || '--'}
              </p>
              <p className={`text-base font-medium leading-normal ${
                stats.steps?.average >= 8000 ? 'text-green-500 dark:text-[#0bda46]' : 'text-orange-500 dark:text-[#ff9500]'
              }`}>
                {stats.steps?.average >= 8000 ? 'Tốt' : 'Cần tăng'}
              </p>
            </div>
            
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Calo tiêu thụ</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {stats.calories?.average?.toFixed(0) || '--'} kcal
              </p>
              <p className="text-green-500 dark:text-[#0bda46] text-base font-medium leading-normal">
                Ổn định
              </p>
            </div>
            
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447]">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Nước uống</p>
              <p className="text-black dark:text-white tracking-light text-2xl font-bold leading-tight">
                {((stats.water?.average || 0) / 1000).toFixed(1) || '--'} L
              </p>
              <p className={`text-base font-medium leading-normal ${
                stats.water?.average >= 2000 ? 'text-green-500 dark:text-[#0bda46]' : 'text-orange-500 dark:text-[#ff9500]'
              }`}>
                {stats.water?.average >= 2000 ? 'Đủ nước' : 'Cần uống thêm'}
              </p>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="flex items-start gap-4 rounded-xl p-6 bg-primary/20 dark:bg-[#1c3d2e] mx-4 sm:mx-6 md:mx-8 my-6">
              <div className="text-primary mt-1">
                <span className="material-symbols-outlined text-3xl">lightbulb</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-black dark:text-white text-lg font-bold">Khuyến nghị thông minh</h3>
                <div className="text-gray-700 dark:text-[#9db9ab] text-base font-normal">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <p key={index} className="mb-2"> {rec.message}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 sm:px-6 md:px-8 pb-8">
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447] p-6">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">
                Biến động Cân nặng (30 ngày qua)
              </p>
              <p className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                {stats.weight?.latest?.toFixed(1) || '--'} kg
              </p>
              <div className="flex gap-1">
                <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                  30 ngày qua
                </p>
                <p className={`text-base font-medium leading-normal ${
                  stats.weight?.change >= 0 ? 'text-red-500 dark:text-[#fa5538]' : 'text-green-500 dark:text-[#0bda46]'
                }`}>
                  {stats.weight?.change >= 0 ? '+' : ''}{stats.weight?.change?.toFixed(1) || '0'}kg
                </p>
              </div>
              <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weightData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#13ec80" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#13ec80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b5447" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c3d2e', 
                        border: '1px solid #3b5447',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#13ec80" 
                      strokeWidth={3}
                      fill="url(#colorWeight)"
                      dot={{ fill: '#13ec80', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447] p-6">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">
                Thời gian ngủ trung bình (tuần qua)
              </p>
              <p className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                {stats.sleep?.average?.toFixed(1) || '--'} giờ
              </p>
              <div className="flex gap-1">
                <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                  7 ngày qua
                </p>
                <p className={`text-base font-medium leading-normal ${
                  stats.sleep?.average >= 7 ? 'text-green-500 dark:text-[#0bda46]' : 'text-orange-500 dark:text-[#ff9500]'
                }`}>
                  {stats.sleep?.average >= 7 ? 'Đủ giấc' : 'Cần cải thiện'}
                </p>
              </div>
              <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b5447" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 12 }}
                      domain={[0, 10]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c3d2e', 
                        border: '1px solid #3b5447',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${value} giờ`, 'Giấc ngủ']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#13ec80"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: BMI Chart & Water Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 sm:px-6 md:px-8 pb-8">
            {/* BMI Chart */}
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447] p-6">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">
                Chỉ số BMI (30 ngày qua)
              </p>
              <p className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                {stats.bmi?.latest?.toFixed(1) || '--'}
              </p>
              <div className="flex gap-1">
                <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                  30 ngày qua
                </p>
                <p className={`text-base font-medium leading-normal ${
                  (stats.bmi?.latest >= 18.5 && stats.bmi?.latest <= 24.9) 
                    ? 'text-green-500 dark:text-[#0bda46]' 
                    : 'text-orange-500 dark:text-[#ff9500]'
                }`}>
                  {(stats.bmi?.latest >= 18.5 && stats.bmi?.latest <= 24.9) ? 'Bình thường' : 'Cần chú ý'}
                </p>
              </div>
              <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={bmiData}>
                    <defs>
                      <linearGradient id="colorBMI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9500" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff9500" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b5447" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 12 }}
                      domain={[15, 30]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c3d2e', 
                        border: '1px solid #3b5447',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ff9500" 
                      strokeWidth={3}
                      fill="url(#colorBMI)"
                      dot={{ fill: '#ff9500', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Water Intake Chart */}
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447] p-6">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">
                Lượng nước uống (7 ngày qua)
              </p>
              <p className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                {((stats.water?.average || 0) / 1000).toFixed(1) || '--'} L
              </p>
              <div className="flex gap-1">
                <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                  Trung bình/ngày
                </p>
                <p className={`text-base font-medium leading-normal ${
                  stats.water?.average >= 2000 ? 'text-green-500 dark:text-[#0bda46]' : 'text-orange-500 dark:text-[#ff9500]'
                }`}>
                  {stats.water?.average >= 2000 ? 'Đủ nước' : 'Cần uống thêm'}
                </p>
              </div>
              <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={waterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b5447" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 12 }}
                      domain={[0, 3000]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c3d2e', 
                        border: '1px solid #3b5447',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${(value / 1000).toFixed(1)} L`, 'Nước uống']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#00bfff"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: Blood Pressure Chart (Full Width) */}
          <div className="px-4 sm:px-6 md:px-8 pb-8">
            <div className="flex min-w-72 flex-col gap-2 rounded-lg border bg-white dark:bg-transparent border-gray-200 dark:border-[#3b5447] p-6">
              <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">
                Huyết áp (7 ngày qua)
              </p>
              <p className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                {stats.bloodPressure?.latest?.toFixed(0) || '--'}/80 mmHg
              </p>
              <div className="flex gap-1">
                <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                  7 ngày qua
                </p>
                <p className={`text-base font-medium leading-normal ${
                  (stats.bloodPressure?.latest >= 90 && stats.bloodPressure?.latest <= 130)
                    ? 'text-green-500 dark:text-[#0bda46]'
                    : 'text-red-500 dark:text-[#fa5538]'
                }`}>
                  {(stats.bloodPressure?.latest >= 90 && stats.bloodPressure?.latest <= 130) ? 'Bình thường' : 'Cần kiểm tra'}
                </p>
              </div>
              <div className="flex min-h-[200px] flex-1 flex-col gap-8 py-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={bloodPressureData}>
                    <defs>
                      <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fa5538" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fa5538" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0bda46" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0bda46" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b5447" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#9db9ab" 
                      tick={{ fill: '#9db9ab', fontSize: 12 }}
                      domain={[50, 150]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c3d2e', 
                        border: '1px solid #3b5447',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="#fa5538" 
                      strokeWidth={3}
                      name="Tâm thu"
                      dot={{ fill: '#fa5538', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="#0bda46" 
                      strokeWidth={3}
                      name="Tâm trương"
                      dot={{ fill: '#0bda46', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;