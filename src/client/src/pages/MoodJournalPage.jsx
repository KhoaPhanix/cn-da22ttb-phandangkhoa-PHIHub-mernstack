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

  const moodEmojis = {
    excellent: '😄',
    good: '🙂',
    okay: '😐',
    bad: '😟',
    terrible: '😢',
  };

  const emotionsList = [
    'happy', 'sad', 'angry', 'anxious', 'excited', 
    'tired', 'motivated', 'grateful', 'frustrated', 'peaceful'
  ];

  const activitiesList = [
    'work', 'exercise', 'social', 'family', 
    'hobby', 'meditation', 'relaxation', 'other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [logsRes, statsRes] = await Promise.all([
        getMoodLogs({ days: 30 }),
        getMoodStats({ days: 30 }),
      ]);
      
      // Extract data correctly from service response
      const logsData = Array.isArray(logsRes.data) ? logsRes.data : [];
      const statsData = statsRes.data || null;
      
      console.log('📊 Mood Logs Response:', logsRes);
      console.log('📊 Logs Data:', logsData);
      console.log('📊 Stats Data:', statsData);
      
      setLogs(logsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching mood data:', error);
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
      await createMoodLog(moodData);
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving mood log:', error);
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
        date: format(new Date(log.date), 'dd/MM'),
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
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{moodEmojis[log.mood]}</span>
                      <div>
                        <h4 className="text-black dark:text-white text-lg font-bold capitalize">
                          {log.mood}
                        </h4>
                        <p className="text-gray-600 dark:text-[#9db9ab] text-sm">
                          {format(new Date(log.date), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-black dark:text-white font-bold text-2xl">
                        {log.moodScore}/10
                      </p>
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
                        <div className="mb-2">
                          <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-2">Cảm xúc:</p>
                          <div className="flex flex-wrap gap-2">
                            {log.emotions.map((emotion, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                              >
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {log.activities?.length > 0 && (
                        <div>
                          <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-2">Hoạt động:</p>
                          <div className="flex flex-wrap gap-2">
                            {log.activities.map((activity, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs"
                              >
                                {activity}
                              </span>
                            ))}
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
                <label className="text-white text-sm font-medium mb-3 block">
                  Tâm trạng hôm nay *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([key, emoji]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        mood: key,
                        moodScore: key === 'excellent' ? 10 : key === 'good' ? 8 : key === 'okay' ? 5 : key === 'bad' ? 3 : 1
                      })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.mood === key
                          ? 'border-primary bg-primary/20'
                          : 'border-[#3b5447] bg-[#1c2721] hover:border-primary/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{emoji}</div>
                      <div className="text-white text-xs capitalize">{key}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Năng lượng: {formData.energyScore}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyScore}
                    onChange={(e) => setFormData({ ...formData, energyScore: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Stress: {formData.stressScore}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stressScore}
                    onChange={(e) => setFormData({ ...formData, stressScore: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Lo âu: {formData.anxiety}/10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.anxiety}
                    onChange={(e) => setFormData({ ...formData, anxiety: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Chất lượng ngủ: {formData.sleepQuality}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleepQuality}
                    onChange={(e) => setFormData({ ...formData, sleepQuality: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Emotions */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Cảm xúc</label>
                <div className="flex flex-wrap gap-2">
                  {emotionsList.map((emotion) => (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        emotions: toggleArrayItem(formData.emotions, emotion),
                      })}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.emotions.includes(emotion)
                          ? 'bg-purple-500 text-white'
                          : 'bg-[#1c2721] text-white border border-[#3b5447] hover:border-purple-500'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Hoạt động</label>
                <div className="flex flex-wrap gap-2">
                  {activitiesList.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        activities: toggleArrayItem(formData.activities, activity),
                      })}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.activities.includes(activity)
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#1c2721] text-white border border-[#3b5447] hover:border-blue-500'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Nhật ký</label>
                <textarea
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="5"
                  placeholder="Viết về ngày hôm nay của bạn..."
                />
              </div>

              {/* Gratitude */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  3 điều biết ơn hôm nay
                </label>
                {formData.gratitude.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newGratitude = [...formData.gratitude];
                      newGratitude[idx] = e.target.value;
                      setFormData({ ...formData, gratitude: newGratitude });
                    }}
                    className="w-full px-4 py-3 mb-2 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Điều ${idx + 1}...`}
                  />
                ))}
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
