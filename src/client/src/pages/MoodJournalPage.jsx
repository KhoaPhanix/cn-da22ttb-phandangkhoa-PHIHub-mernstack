import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMoodLogs, createMoodLog, getMoodStats } from '../services/moodService';
import { format } from 'date-fns';

const MoodJournalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    mood: 'okay',
    moodScore: 5,
    energy: 'medium',
    energyScore: 5,
    stress: 'medium',
    stressScore: 5,
    anxiety: 0,
    activities: [],
    emotions: [],
    journal: '',
    gratitude: ['', '', ''],
    sleepQuality: 5,
    productivity: 5,
  });

  const moodOptions = [
    { key: 'excellent', emoji: '😄', label: 'Tuyệt vời', color: 'bg-green-500', score: 10 },
    { key: 'good', emoji: '🙂', label: 'Tốt', color: 'bg-blue-500', score: 8 },
    { key: 'okay', emoji: '😐', label: 'Bình thường', color: 'bg-yellow-500', score: 5 },
    { key: 'bad', emoji: '😟', label: 'Tệ', color: 'bg-orange-500', score: 3 },
    { key: 'terrible', emoji: '😢', label: 'Rất tệ', color: 'bg-red-500', score: 1 },
  ];

  const moodEmojis = {
    excellent: '😄',
    good: '🙂',
    okay: '😐',
    bad: '😟',
    terrible: '😢',
  };

  const moodLabels = {
    excellent: 'Tuyệt vời',
    good: 'Tốt',
    okay: 'Bình thường',
    bad: 'Tệ',
    terrible: 'Rất tệ',
  };

  const emotionsList = [
    { key: 'happy', label: 'Vui vẻ', icon: '😊', color: 'bg-yellow-500' },
    { key: 'sad', label: 'Buồn', icon: '😢', color: 'bg-blue-500' },
    { key: 'angry', label: 'Tức giận', icon: '😠', color: 'bg-red-500' },
    { key: 'anxious', label: 'Lo lắng', icon: '😰', color: 'bg-purple-500' },
    { key: 'excited', label: 'Phấn khích', icon: '🤩', color: 'bg-pink-500' },
    { key: 'tired', label: 'Mệt mỏi', icon: '😴', color: 'bg-gray-500' },
    { key: 'motivated', label: 'Động lực', icon: '💪', color: 'bg-green-500' },
    { key: 'grateful', label: 'Biết ơn', icon: '🙏', color: 'bg-teal-500' },
    { key: 'frustrated', label: 'Thất vọng', icon: '😤', color: 'bg-orange-500' },
    { key: 'peaceful', label: 'Bình yên', icon: '😌', color: 'bg-cyan-500' },
  ];

  const activitiesList = [
    { key: 'work', label: 'Làm việc', icon: '💼', color: 'bg-blue-500' },
    { key: 'exercise', label: 'Tập luyện', icon: '🏃', color: 'bg-green-500' },
    { key: 'social', label: 'Giao lưu', icon: '👥', color: 'bg-purple-500' },
    { key: 'family', label: 'Gia đình', icon: '👨‍👩‍👧', color: 'bg-pink-500' },
    { key: 'hobby', label: 'Sở thích', icon: '🎨', color: 'bg-yellow-500' },
    { key: 'meditation', label: 'Thiền định', icon: '🧘', color: 'bg-indigo-500' },
    { key: 'relaxation', label: 'Thư giãn', icon: '😌', color: 'bg-teal-500' },
    { key: 'other', label: 'Khác', icon: '📝', color: 'bg-gray-500' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 [Mood] Fetching data...');
      setLoading(true);
      setError(null);
      const [logsRes, statsRes] = await Promise.all([
        getMoodLogs({ days: 30 }),
        getMoodStats({ days: 30 }),
      ]);
      
      console.log('📦 [Mood] Logs Full Response:', logsRes);
      console.log('📦 [Mood] Logs Response.data:', logsRes.data);
      console.log('📦 [Mood] Stats Response:', statsRes);
      
      // Extract data correctly from service response
      const logsData = Array.isArray(logsRes.data?.data) ? logsRes.data.data : (Array.isArray(logsRes.data) ? logsRes.data : []);
      const statsData = statsRes.data?.data || statsRes.data || null;
      
      console.log('📊 [Mood] Logs Data (final):', logsData);
      console.log('📊 [Mood] Logs count:', logsData.length);
      console.log('📊 [Mood] Stats Data (final):', statsData);
      
      setLogs(logsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ [Mood] Error fetching data:', error);
      console.error('❌ [Mood] Error response:', error.response);
      setError(error.response?.data?.message || 'Không thể tải dữ liệu tâm trạng. Vui lòng đăng nhập lại.');
      setLogs([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const moodData = {
        ...formData,
        gratitude: formData.gratitude.filter(g => g.trim() !== ''),
      };
      console.log('📤 Sending mood data:', moodData);
      const response = await createMoodLog(moodData);
      console.log('✅ Mood response:', response);
      alert('Lưu nhật ký tâm trạng thành công!');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('❌ Error saving mood log:', error);
      console.error('Error details:', error.response?.data);
      alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể lưu nhật ký'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      mood: 'okay',
      moodScore: 5,
      energy: 'medium',
      energyScore: 5,
      stress: 'medium',
      stressScore: 5,
      anxiety: 0,
      activities: [],
      emotions: [],
      journal: '',
      gratitude: ['', '', ''],
      sleepQuality: 5,
      productivity: 5,
    });
  };

  const toggleArrayItem = (array, item) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const chartData = Array.isArray(logs) && logs.length > 0
    ? logs.map(log => ({
        date: format(new Date(log.date), 'dd/MM/yyyy'),
        mood: log.moodScore,
        energy: log.energyScore,
        stress: log.stressScore,
      })).reverse()
    : [];

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
                Nhật Ký Tâm Trạng
              </h1>
              <p className="text-gray-600 dark:text-[#9db9ab] text-base mt-2">
                Theo dõi tâm trạng và sức khỏe tinh thần
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">add</span>
              Ghi Nhật Ký
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">TB Tâm trạng</p>
                <p className="text-black dark:text-white text-3xl font-bold">
                  {stats?.averageMood?.toFixed(1) || 0}/10
                </p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">TB Năng lượng</p>
                <p className="text-blue-500 text-3xl font-bold">
                  {stats?.averageEnergy?.toFixed(1) || 0}/10
                </p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">TB Stress</p>
                <p className="text-orange-500 text-3xl font-bold">
                  {stats?.averageStress?.toFixed(1) || 0}/10
                </p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">Xu hướng</p>
                <p className={`text-3xl font-bold ${
                  stats?.trend === 'improving' ? 'text-green-500' : 
                  stats?.trend === 'declining' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {stats?.trend === 'improving' ? '📈' : stats?.trend === 'declining' ? '📉' : '➡️'}
                </p>
              </div>
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-black dark:text-white text-xl font-bold mb-4">
                Xu hướng 30 ngày qua
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b5447" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#9db9ab" />
                  <YAxis stroke="#9db9ab" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c3d2e',
                      border: '1px solid #3b5447',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="#13ec80" strokeWidth={2} name="Tâm trạng" />
                  <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} name="Năng lượng" />
                  <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Mood Logs */}
          <h3 className="text-black dark:text-white text-2xl font-bold mb-4">Nhật ký gần đây</h3>
          {!Array.isArray(logs) || logs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                mood
              </span>
              <p className="text-gray-600 dark:text-[#9db9ab] text-lg">
                Chưa có nhật ký nào. Hãy ghi nhật ký đầu tiên!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{moodEmojis[log.mood]}</div>
                      <div>
                        <h4 className="text-black dark:text-white text-xl font-bold">
                          {moodLabels[log.mood] || log.mood}
                        </h4>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-sm">
                          {format(new Date(log.date), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-black dark:text-white font-bold text-3xl">
                        {log.moodScore}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">/ 10</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Năng lượng</p>
                      <p className="text-blue-500 font-semibold">{log.energyScore}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Stress</p>
                      <p className="text-orange-500 font-semibold">{log.stressScore}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Lo âu</p>
                      <p className="text-red-500 font-semibold">{log.anxiety}/10</p>
                    </div>
                  </div>

                  {/* Emotions & Activities */}
                  {(log.emotions?.length > 0 || log.activities?.length > 0) && (
                    <div className="mb-4">
                      {log.emotions?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-600 dark:text-[#9db9ab] text-sm font-medium mb-2">🎭 Cảm xúc:</p>
                          <div className="flex flex-wrap gap-2">
                            {log.emotions.map((emotion, idx) => {
                              const emotionObj = emotionsList.find(e => e.key === emotion);
                              return (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-purple-500/20 text-purple-300 dark:text-purple-400 rounded-lg text-sm font-medium flex items-center gap-1"
                                >
                                  {emotionObj?.icon} {emotionObj?.label || emotion}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {log.activities?.length > 0 && (
                        <div>
                          <p className="text-gray-600 dark:text-[#9db9ab] text-sm font-medium mb-2">📋 Hoạt động:</p>
                          <div className="flex flex-wrap gap-2">
                            {log.activities.map((activity, idx) => {
                              const activityObj = activitiesList.find(a => a.key === activity);
                              return (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-blue-500/20 text-blue-300 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center gap-1"
                                >
                                  {activityObj?.icon} {activityObj?.label || activity}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Journal */}
                  {log.journal && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <p className="text-black dark:text-white whitespace-pre-wrap">{log.journal}</p>
                    </div>
                  )}

                  {/* Gratitude */}
                  {log.gratitude?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">Biết ơn về:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {log.gratitude.map((item, idx) => (
                          <li key={idx} className="text-black dark:text-white text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
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
          <div className="bg-white dark:bg-[#111814] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Ghi Nhật Ký Tâm Trạng</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Selector */}
              <div>
                <label className="text-white text-base font-semibold mb-4 block flex items-center gap-2">
                  <span className="text-2xl">😊</span>
                  Tâm trạng hôm nay của bạn thế nào? *
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.key}
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        mood: mood.key,
                        moodScore: mood.score
                      })}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        formData.mood === mood.key
                          ? 'border-primary bg-primary/20 shadow-lg'
                          : 'border-[#3b5447] bg-[#1c2721] hover:border-primary/50'
                      }`}
                    >
                      <div className="text-5xl mb-2">{mood.emoji}</div>
                      <div className="text-white text-sm font-medium">{mood.label}</div>
                      <div className="text-gray-400 text-xs mt-1">{mood.score}/10</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="bg-[#1c2721] border border-[#3b5447] rounded-xl p-5">
                <h3 className="text-white text-base font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Đánh giá chi tiết
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-white text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        Năng lượng
                      </label>
                      <span className="text-primary font-bold text-lg">{formData.energyScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.energyScore}
                      onChange={(e) => setFormData({ ...formData, energyScore: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-white text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">😰</span>
                        Mức độ Stress
                      </label>
                      <span className="text-orange-400 font-bold text-lg">{formData.stressScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.stressScore}
                      onChange={(e) => setFormData({ ...formData, stressScore: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-white text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">😟</span>
                        Lo lắng / Âu lo
                      </label>
                      <span className="text-red-400 font-bold text-lg">{formData.anxiety}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.anxiety}
                      onChange={(e) => setFormData({ ...formData, anxiety: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-white text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">😴</span>
                        Chất lượng giấc ngủ
                      </label>
                      <span className="text-purple-400 font-bold text-lg">{formData.sleepQuality}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.sleepQuality}
                      onChange={(e) => setFormData({ ...formData, sleepQuality: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emotions */}
              <div>
                <label className="text-white text-base font-semibold mb-4 block flex items-center gap-2">
                  <span className="text-2xl">🎭</span>
                  Bạn đang cảm thấy thế nào?
                </label>
                <div className="flex flex-wrap gap-3">
                  {emotionsList.map((emotion) => (
                    <button
                      key={emotion.key}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        emotions: toggleArrayItem(formData.emotions, emotion.key),
                      })}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        formData.emotions.includes(emotion.key)
                          ? `${emotion.color} text-white shadow-md transform scale-105`
                          : 'bg-[#1c2721] text-white border border-[#3b5447] hover:border-white/30'
                      }`}
                    >
                      <span className="text-lg">{emotion.icon}</span>
                      {emotion.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <label className="text-white text-base font-semibold mb-4 block flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Bạn đã làm gì hôm nay?
                </label>
                <div className="flex flex-wrap gap-3">
                  {activitiesList.map((activity) => (
                    <button
                      key={activity.key}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        activities: toggleArrayItem(formData.activities, activity.key),
                      })}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        formData.activities.includes(activity.key)
                          ? `${activity.color} text-white shadow-md transform scale-105`
                          : 'bg-[#1c2721] text-white border border-[#3b5447] hover:border-white/30'
                      }`}
                    >
                      <span className="text-lg">{activity.icon}</span>
                      {activity.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal */}
              <div>
                <label className="text-white text-base font-semibold mb-3 block flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Hôm nay của bạn thế nào?
                </label>
                <textarea
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                  rows="6"
                  placeholder="Viết về những suy nghĩ, cảm xúc, hoặc sự kiện đáng nhớ trong ngày hôm nay..."
                />
              </div>

              {/* Gratitude */}
              <div className="bg-[#1c2721] border border-[#3b5447] rounded-xl p-5">
                <label className="text-white text-base font-semibold mb-4 block flex items-center gap-2">
                  <span className="text-2xl">🙏</span>
                  Ba điều bạn biết ơn hôm nay
                </label>
                <div className="space-y-3">
                  {formData.gratitude.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-primary font-bold text-lg">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newGratitude = [...formData.gratitude];
                          newGratitude[idx] = e.target.value;
                          setFormData({ ...formData, gratitude: newGratitude });
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[#111814] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                        placeholder={`Điều thứ ${idx + 1} bạn biết ơn...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Lưu nhật ký
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

export default MoodJournalPage;
