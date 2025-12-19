import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getGoals, createGoal, updateGoal, deleteGoal, getGoalStats } from '../services/goalService';
import { format } from 'date-fns';

const GoalsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: 'weight',
    startValue: '',
    targetValue: '',
    unit: 'kg',
    targetDate: '',
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      console.log('🔄 [Goals] Fetching data with filter:', filter);
      setLoading(true);
      setError(null);
      const [goalsRes, statsRes] = await Promise.all([
        getGoals({ status: filter !== 'all' ? filter : undefined }),
        getGoalStats(),
      ]);
      
      console.log('📦 [Goals] Full Response:', goalsRes);
      console.log('📦 [Goals] Response.data:', goalsRes.data);
      console.log('📦 [Goals] Response.data.data:', goalsRes.data?.data);
      
      // Extract data correctly from service response
      const goalsData = Array.isArray(goalsRes.data?.data) ? goalsRes.data.data : (Array.isArray(goalsRes.data) ? goalsRes.data : []);
      const statsData = statsRes.data?.data || statsRes.data || null;
      
      console.log('📊 Goals Data (final):', goalsData);
      console.log('📊 Stats Data (final):', statsData);
      console.log('📊 Goals count:', goalsData.length);
      
      setGoals(goalsData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching goals:', error);
      console.error('❌ Error response:', error.response);
      setError(error.response?.data?.message || 'Không thể tải dữ liệu mục tiêu. Vui lòng đăng nhập lại.');
      setGoals([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        startValue: parseFloat(formData.startValue) || 0,
        targetValue: parseFloat(formData.targetValue),
        targetDate: new Date(formData.targetDate).toISOString(),
      };

      if (editingGoal) {
        const response = await updateGoal(editingGoal._id, goalData);
        console.log('✅ Update goal response:', response);
        alert('Cập nhật mục tiêu thành công!');
      } else {
        const response = await createGoal(goalData);
        console.log('✅ Create goal response:', response);
        alert('Tạo mục tiêu thành công!');
      }

      setShowModal(false);
      setEditingGoal(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('❌ Error saving goal:', error);
      console.error('Error details:', error.response?.data);
      alert(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể lưu mục tiêu'}`);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      goalType: goal.goalType,
      startValue: goal.startValue?.toString() || '',
      targetValue: goal.targetValue.toString(),
      unit: goal.unit,
      targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd'),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
      try {
        await deleteGoal(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goalType: 'weight',
      startValue: '',
      targetValue: '',
      unit: 'kg',
      targetDate: '',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-blue-500/20 text-blue-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
    };
    return badges[status] || badges.active;
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
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
                Mục tiêu của tôi
              </h1>
              <p className="text-gray-600 dark:text-[#9db9ab] text-base mt-2">
                Đặt mục tiêu và theo dõi tiến độ của bạn
              </p>
            </div>
            <button
              onClick={() => {
                setEditingGoal(null);
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">add</span>
              Thêm mục tiêu
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">Tổng số</p>
                <p className="text-black dark:text-white text-3xl font-bold">{stats.total || 0}</p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">Đang thực hiện</p>
                <p className="text-blue-500 text-3xl font-bold">{stats.active || 0}</p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">Hoàn thành</p>
                <p className="text-green-500 text-3xl font-bold">{stats.completed || 0}</p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6">
                <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-2">Tiến độ TB</p>
                <p className="text-primary text-3xl font-bold">{(stats.averageProgress || 0).toFixed(0)}%</p>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-white/10">
            {['all', 'active', 'completed', 'failed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  filter === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-[#9db9ab] hover:text-black dark:hover:text-white'
                }`}
              >
                {tab === 'all' ? 'Tất cả' : tab === 'active' ? 'Đang thực hiện' : tab === 'completed' ? 'Hoàn thành' : 'Thất bại'}
              </button>
            ))}
          </div>

          {/* Goals List */}
          {!Array.isArray(goals) || goals.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                flag
              </span>
              <p className="text-gray-600 dark:text-[#9db9ab] text-lg">
                Chưa có mục tiêu nào. Hãy tạo mục tiêu đầu tiên!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal._id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-black dark:text-white text-xl font-bold mb-1">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-gray-600 dark:text-[#9db9ab] text-sm">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-[#9db9ab]">Tiến độ</span>
                      <span className="text-black dark:text-white font-semibold">
                        {(goal.progress || 0).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(goal.progress || 0)} transition-all duration-500`}
                        style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Hiện tại</p>
                      <p className="text-black dark:text-white font-semibold">
                        {goal.currentValue} {goal.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Mục tiêu</p>
                      <p className="text-black dark:text-white font-semibold">
                        {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Bắt đầu</p>
                      <p className="text-black dark:text-white text-sm">
                        {format(new Date(goal.startDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-[#9db9ab] text-xs mb-1">Kết thúc</p>
                      <p className="text-black dark:text-white text-sm">
                        {format(new Date(goal.targetDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111814] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">
                {editingGoal ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu mới'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGoal(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Tiêu đề mục tiêu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ví dụ: Giảm 5kg trong 2 tháng"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                  placeholder="Thêm mô tả chi tiết..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Loại mục tiêu *
                  </label>
                  <select
                    required
                    value={formData.goalType}
                    onChange={(e) => {
                      const type = e.target.value;
                      let unit = 'kg';
                      if (type === 'bmi') unit = 'kg/m²';
                      else if (type === 'bloodPressure') unit = 'mmHg';
                      else if (type === 'heartRate') unit = 'nhịp/phút';
                      else if (type === 'sleep') unit = 'giờ';
                      else if (type === 'steps') unit = 'bước';
                      else if (type === 'exercise') unit = 'phút';
                      else if (type === 'calories') unit = 'kcal';
                      else if (type === 'water') unit = 'lít';
                      
                      setFormData({ ...formData, goalType: type, unit });
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="weight">Cân nặng</option>
                    <option value="bmi">BMI</option>
                    <option value="bloodPressure">Huyết áp</option>
                    <option value="heartRate">Nhịp tim</option>
                    <option value="sleep">Giấc ngủ</option>
                    <option value="steps">Số bước</option>
                    <option value="exercise">Tập luyện</option>
                    <option value="calories">Calories</option>
                    <option value="water">Nước uống</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Giá trị hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={formData.startValue}
                        onChange={(e) => setFormData({ ...formData, startValue: e.target.value })}
                        className="w-full px-4 py-3 pr-16 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                        {formData.unit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Giá trị mục tiêu *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                        className="w-full px-4 py-3 pr-16 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                        {formData.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Ngày kết thúc *
                </label>
                <input
                  type="date"
                  required
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg bg-[#1c2721] border border-[#3b5447] text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingGoal(null);
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
                  {editingGoal ? 'Cập nhật' : 'Tạo mục tiêu'}
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

export default GoalsPage;
