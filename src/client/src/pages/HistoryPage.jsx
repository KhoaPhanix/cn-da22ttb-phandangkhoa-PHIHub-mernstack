import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getMetrics, getMetricStats, updateMetric, deleteMetric } from '../services/metricsService';

const HistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [heartRateData, setHeartRateData] = useState([]);
  const [stepsData, setStepsData] = useState([]);
  const [stats, setStats] = useState({});
  const [metricsTable, setMetricsTable] = useState([]);
  const [editingMetric, setEditingMetric] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    metricType: '',
    value: '',
    unit: '',
    timestamp: '',
    notes: '',
  });

  // Mapping tiếng Việt cho metricType
  const metricTypeLabels = {
    weight: 'Cân nặng',
    height: 'Chiều cao',
    bmi: 'BMI',
    bloodPressure: 'Huyết áp',
    heartRate: 'Nhịp tim',
    sleep: 'Giấc ngủ',
    sleepQuality: 'Chất lượng giấc ngủ',
    steps: 'Số bước chân',
    exercise: 'Tập luyện',
    calories: 'Calo',
    water: 'Nước uống',
    bloodSugar: 'Đường huyết',
  };

  useEffect(() => {
    fetchHistoryData();
  }, [selectedMetric, dateRange, viewMode]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      
      let startDate, endDate;
      const now = new Date();
      
      switch (dateRange) {
        case 'week':
          startDate = subDays(now, 7);
          endDate = now;
          break;
        case 'month':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case '3months':
          startDate = subDays(now, 90);
          endDate = now;
          break;
        default:
          startDate = startOfMonth(now);
          endDate = now;
      }

      // Fetch chart data based on selected metric
      if (selectedMetric === 'all' || selectedMetric === 'heartRate') {
        const heartRateResponse = await getMetrics({
          metricType: 'heartRate',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 30,
        });

        const heartRateDataArray = Array.isArray(heartRateResponse.data) ? heartRateResponse.data : (heartRateResponse.data.data || []);
        const formattedHeartRateData = heartRateDataArray.map((item) => ({
          date: format(new Date(item.timestamp), 'dd/MM/yyyy'),
          value: item.value,
        })).reverse();

        setHeartRateData(formattedHeartRateData);

        const heartRateStats = await getMetricStats('heartRate', dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90);
        const heartRateStatsData = heartRateStats.data || {};
        setStats(prev => ({ ...prev, heartRate: heartRateStatsData }));
      } else {
        setHeartRateData([]);
      }

      if (selectedMetric === 'all' || selectedMetric === 'steps') {
        const stepsResponse = await getMetrics({
          metricType: 'steps',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 30,
        });

        const stepsDataArray = stepsResponse.data || [];
        const formattedStepsData = stepsDataArray.map((item) => ({
          date: format(new Date(item.timestamp), 'dd/MM/yyyy', { locale: vi }),
          value: item.value,
        })).reverse();

        setStepsData(formattedStepsData);

        const stepsStats = await getMetricStats('steps', dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90);
        const stepsStatsData = stepsStats.data || {};
        setStats(prev => ({ ...prev, steps: stepsStatsData }));
      } else {
        setStepsData([]);
      }

      // Fetch table data if in table view
      if (viewMode === 'table') {
        const queryParams = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 1000,
        };
        
        // Add metric type filter if not 'all'
        if (selectedMetric !== 'all') {
          queryParams.metricType = selectedMetric;
        }

        const allMetricsResponse = await getMetrics(queryParams);
        const metricsArray = allMetricsResponse.data || [];
        setMetricsTable(metricsArray);
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Không thể tải dữ liệu lịch sử');
      setMetricsTable([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!metricsTable || metricsTable.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const csvData = metricsTable.map(metric => ({
      'Loại dữ liệu': metricTypeLabels[metric.metricType] || metric.metricType,
      'Giá trị': metric.value,
      'Đơn vị': metric.unit,
      'Thời gian': format(new Date(metric.timestamp), 'dd/MM/yyyy HH:mm'),
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `du-lieu-suc-khoe-${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
  };

  const handleEdit = (metric) => {
    setEditingMetric(metric);
    setEditFormData({
      metricType: metric.metricType,
      value: metric.value,
      unit: metric.unit,
      timestamp: format(new Date(metric.timestamp), "yyyy-MM-dd'T'HH:mm"),
      notes: metric.notes || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dữ liệu này?')) {
      return;
    }

    try {
      await deleteMetric(id);
      alert('Xóa dữ liệu thành công!');
      fetchHistoryData();
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa dữ liệu');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateMetric(editingMetric._id, {
        ...editFormData,
        timestamp: new Date(editFormData.timestamp).toISOString(),
      });
      alert('Cập nhật dữ liệu thành công!');
      setShowEditModal(false);
      setEditingMetric(null);
      fetchHistoryData();
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật dữ liệu');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingMetric(null);
    setEditFormData({
      metricType: '',
      value: '',
      unit: '',
      timestamp: '',
      notes: '',
    });
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
          <div className="flex flex-wrap justify-between gap-3 p-4 mt-8">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Lịch sử dữ liệu sức khỏe
              </p>
              <p className="text-gray-600 dark:text-[#9db9ab] text-base font-normal leading-normal">
                Xem lại và phân tích dữ liệu sức khỏe của bạn theo thời gian.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between gap-4 px-4 py-3 mt-4 border-y border-gray-200 dark:border-[#3b5447]">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-10 px-4 rounded-lg bg-white dark:bg-[#1c3d2e] text-gray-900 dark:text-white text-sm font-medium border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="3months">3 tháng qua</option>
              </select>

              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="h-10 px-4 rounded-lg bg-white dark:bg-[#1c3d2e] text-gray-900 dark:text-white text-sm font-medium border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Tất cả dữ liệu</option>
                <option value="weight">Cân nặng</option>
                <option value="bmi">BMI</option>
                <option value="bloodPressure">Huyết áp</option>
                <option value="heartRate">Nhịp tim</option>
                <option value="sleep">Giấc ngủ</option>
                <option value="steps">Số bước chân</option>
                <option value="exercise">Tập luyện</option>
                <option value="calories">Calo</option>
                <option value="water">Nước uống</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-10 items-center justify-center rounded-lg bg-white dark:bg-[#1c3d2e] p-1 border border-gray-300 dark:border-[#3b5447]">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center justify-center gap-2 px-3 h-8 rounded-md transition-colors ${
                    viewMode === 'chart'
                      ? 'bg-gray-100 dark:bg-[#283930] text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-[#9db9ab]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">bar_chart</span>
                  <span className="text-sm font-medium">Biểu đồ</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center justify-center gap-2 px-3 h-8 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-gray-100 dark:bg-[#283930] text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-[#9db9ab]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">table_rows</span>
                  <span className="text-sm font-medium">Bảng</span>
                </button>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-[#1c3d2e] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3b5447] hover:bg-gray-50 dark:hover:bg-[#283930]"
              >
                <span className="material-symbols-outlined text-xl">download</span>
              </button>
            </div>
          </div>

          {viewMode === 'chart' ? (
            <div className="flex flex-wrap gap-4 px-4 py-6">
              {(selectedMetric === 'all' || selectedMetric === 'heartRate') && heartRateData.length > 0 && (
                <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-gray-200 dark:border-[#3b5447] bg-white dark:bg-[#1c3d2e] p-6">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                    Nhịp tim trung bình
                  </p>
                  <p className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                    {stats.heartRate?.average?.toFixed(0) || '--'} bpm
                  </p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 dark:text-[#9db9ab] text-sm font-normal leading-normal">
                      {dateRange === 'week' ? 'Tuần này' : dateRange === 'month' ? 'Tháng này' : '3 tháng qua'}
                    </p>
                    <p className={`text-sm font-medium leading-normal ${
                      stats.heartRate?.change >= 0 ? 'text-primary' : 'text-red-500 dark:text-[#fa5538]'
                    }`}>
                      {stats.heartRate?.change >= 0 ? '+' : ''}{stats.heartRate?.change?.toFixed(0) || '0'}%
                    </p>
                  </div>
                  <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={heartRateData}>
                        <defs>
                          <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
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
                          fill="url(#colorHeartRate)"
                          dot={{ fill: '#13ec80', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {(selectedMetric === 'all' || selectedMetric === 'steps') && stepsData.length > 0 && (
                <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-gray-200 dark:border-[#3b5447] bg-white dark:bg-[#1c3d2e] p-6">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                    Số bước chân hàng ngày
                  </p>
                  <p className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                    {stats.steps?.average?.toFixed(0) || '--'}
                  </p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 dark:text-[#9db9ab] text-sm font-normal leading-normal">
                      7 ngày qua
                    </p>
                    <p className={`text-sm font-medium leading-normal ${
                      stats.steps?.change >= 0 ? 'text-primary' : 'text-red-500 dark:text-[#fa5538]'
                    }`}>
                      {stats.steps?.change >= 0 ? '+' : ''}{stats.steps?.change?.toFixed(0) || '0'}
                    </p>
                  </div>
                  <div className="grid min-h-[180px] grid-flow-col gap-2 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4">
                    {stepsData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center w-full gap-2">
                        <div 
                          className={`w-full ${
                            item.value >= 8000 ? 'bg-primary' : 'bg-primary/20 dark:bg-[#283930]'
                          } rounded-t-sm`}
                          style={{ height: `${(item.value / 12000) * 100}%` }}
                        />
                        <p className="text-gray-500 dark:text-[#9db9ab] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          {item.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-6">
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#3b5447]">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-[#1c3d2e]">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-white uppercase tracking-wider">
                        Loại dữ liệu
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-white uppercase tracking-wider">
                        Giá trị
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-white uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-white uppercase tracking-wider">
                        Ghi chú
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-white uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-[#3b5447]">
                    {metricsTable && metricsTable.length > 0 ? metricsTable.map((metric) => (
                      <tr key={metric._id} className="hover:bg-gray-50 dark:hover:bg-[#1c3d2e]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {metricTypeLabels[metric.metricType] || metric.metricType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {metric.value} {metric.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-[#9db9ab]">
                          {format(new Date(metric.timestamp), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-[#9db9ab]">
                          {metric.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(metric)}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(metric._id)}
                              className="text-red-600 dark:text-[#fa5538] hover:text-red-700 dark:hover:text-red-600 transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-[#9db9ab]">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal chỉnh sửa dữ liệu */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1c3d2e] rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Chỉnh sửa dữ liệu
            </h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Loại dữ liệu
                </label>
                <select
                  value={editFormData.metricType}
                  onChange={(e) => setEditFormData({ ...editFormData, metricType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#283930] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="weight">Cân nặng</option>
                  <option value="height">Chiều cao</option>
                  <option value="bmi">BMI</option>
                  <option value="bloodPressure">Huyết áp</option>
                  <option value="heartRate">Nhịp tim</option>
                  <option value="sleep">Giấc ngủ</option>
                  <option value="sleepQuality">Chất lượng giấc ngủ</option>
                  <option value="steps">Số bước chân</option>
                  <option value="exercise">Tập luyện</option>
                  <option value="calories">Calo</option>
                  <option value="water">Nước uống</option>
                  <option value="bloodSugar">Đường huyết</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Giá trị
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.value}
                  onChange={(e) => setEditFormData({ ...editFormData, value: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#283930] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Đơn vị
                </label>
                <input
                  type="text"
                  value={editFormData.unit}
                  onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#283930] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Thời gian
                </label>
                <input
                  type="datetime-local"
                  value={editFormData.timestamp}
                  onChange={(e) => setEditFormData({ ...editFormData, timestamp: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#283930] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#283930] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3b5447] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Nhập ghi chú (tùy chọn)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#283930] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#3b5447] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Lưu thay đổi
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

export default HistoryPage;