import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createMetric } from '../services/metricsService';

const MetricsEntryPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    sleep: '',
    sleepQuality: '',
    steps: '',
    exercise: '',
    calories: '',
    water: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sử dụng ngày được chọn và set thời gian là 8:00 AM
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(8, 0, 0, 0);
      const timestamp = selectedDateTime.toISOString();
      const promises = [];

      if (formData.weight) {
        promises.push(createMetric({
          metricType: 'weight',
          value: parseFloat(formData.weight),
          unit: 'kg',
          timestamp,
        }));
      }

      if (formData.height) {
        promises.push(createMetric({
          metricType: 'height',
          value: parseFloat(formData.height),
          unit: 'cm',
          timestamp,
        }));
      }

      // Tính BMI tự động nếu có cả cân nặng và chiều cao
      if (formData.weight && formData.height) {
        const heightInMeters = parseFloat(formData.height) / 100;
        const bmi = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
        promises.push(createMetric({
          metricType: 'bmi',
          value: parseFloat(bmi.toFixed(2)),
          unit: 'kg/m²',
          timestamp,
        }));
      }

      if (formData.bloodPressureSystolic && formData.bloodPressureDiastolic) {
        promises.push(createMetric({
          metricType: 'bloodPressure',
          value: parseFloat(formData.bloodPressureSystolic),
          unit: 'mmHg',
          timestamp,
          metadata: {
            systolic: parseFloat(formData.bloodPressureSystolic),
            diastolic: parseFloat(formData.bloodPressureDiastolic),
          },
        }));
      }

      if (formData.heartRate) {
        promises.push(createMetric({
          metricType: 'heartRate',
          value: parseFloat(formData.heartRate),
          unit: 'nhịp/phút',
          timestamp,
        }));
      }

      if (formData.sleep) {
        promises.push(createMetric({
          metricType: 'sleep',
          value: parseFloat(formData.sleep),
          unit: 'giờ',
          timestamp,
        }));
      }

      if (formData.sleepQuality) {
        promises.push(createMetric({
          metricType: 'sleepQuality',
          value: parseFloat(formData.sleepQuality),
          unit: 'điểm',
          timestamp,
        }));
      }

      if (formData.steps) {
        promises.push(createMetric({
          metricType: 'steps',
          value: parseFloat(formData.steps),
          unit: 'bước',
          timestamp,
        }));
      }

      if (formData.exercise) {
        promises.push(createMetric({
          metricType: 'exercise',
          value: parseFloat(formData.exercise),
          unit: 'phút',
          timestamp,
        }));
      }

      if (formData.calories) {
        promises.push(createMetric({
          metricType: 'calories',
          value: parseFloat(formData.calories),
          unit: 'kcal',
          timestamp,
        }));
      }

      if (formData.water) {
        promises.push(createMetric({
          metricType: 'water',
          value: parseFloat(formData.water),
          unit: 'lít',
          timestamp,
        }));
      }

      await Promise.all(promises);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Navbar />
      
      <div className="relative flex h-auto min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-[#111814] p-6 sm:p-8 shadow-2xl shadow-primary/10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 right-4 text-[#9db9ab] hover:text-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="mb-6">
            <h1 className="text-white tracking-light text-2xl sm:text-3xl font-bold leading-tight text-center">
              Cập nhật chỉ số sức khỏe
            </h1>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Date Picker */}
            <div className="flex flex-col gap-2 p-4 bg-[#1c3d2e]/30 rounded-lg border border-[#3b5447]">
              <label className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <span className="text-white text-base font-medium">Chọn ngày nhập liệu</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="form-input flex w-full resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-12 px-4 text-base font-normal leading-normal"
              />
            </div>
            {/* Row 1: Weight & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">scale</span>
                  Cân nặng
                </p>
                <div className="relative">
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-12 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 65.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">kg</span>
                </div>
              </label>

              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">height</span>
                  Chiều cao
                </p>
                <div className="relative">
                  <input
                    name="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-12 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 170"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">cm</span>
                </div>
              </label>
            </div>

            {/* Row 2: Blood Pressure (Systolic & Diastolic) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">monitor_heart</span>
                  Huyết áp tâm thu
                </p>
                <div className="relative">
                  <input
                    name="bloodPressureSystolic"
                    type="number"
                    value={formData.bloodPressureSystolic}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-16 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 120"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">mmHg</span>
                </div>
              </label>

              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">monitor_heart</span>
                  Huyết áp tâm trương
                </p>
                <div className="relative">
                  <input
                    name="bloodPressureDiastolic"
                    type="number"
                    value={formData.bloodPressureDiastolic}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-16 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 80"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">mmHg</span>
                </div>
              </label>
            </div>

            {/* Row 3: Heart Rate & Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">favorite</span>
                  Nhịp tim
                </p>
                <div className="relative">
                  <input
                    name="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-12 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 72"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">nhịp/phút</span>
                </div>
              </label>

              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">directions_walk</span>
                  Số bước chân
                </p>
                <div className="relative">
                  <input
                    name="steps"
                    type="number"
                    value={formData.steps}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-16 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 8000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">bước</span>
                </div>
              </label>
            </div>

            {/* Row 4: Sleep Time & Sleep Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">bedtime</span>
                  Thời gian ngủ
                </p>
                <div className="relative">
                  <input
                    name="sleep"
                    type="number"
                    step="0.5"
                    value={formData.sleep}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-12 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 7.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">giờ</span>
                </div>
              </label>

              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">hotel</span>
                  Chất lượng giấc ngủ
                </p>
                <div className="relative">
                  <input
                    name="sleepQuality"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={formData.sleepQuality}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-16 text-base font-normal leading-normal"
                    placeholder="1-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">/10</span>
                </div>
              </label>
            </div>

            {/* Row 5: Exercise & Calories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">fitness_center</span>
                  Thời gian tập luyện
                </p>
                <div className="relative">
                  <input
                    name="exercise"
                    type="number"
                    min="0"
                    value={formData.exercise}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-16 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 30 (0 nếu không tập)"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">phút</span>
                </div>
              </label>

              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">local_fire_department</span>
                  Lượng Calo tiêu thụ
                </p>
                <div className="relative">
                  <input
                    name="calories"
                    type="number"
                    value={formData.calories}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-16 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 1800"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">calo</span>
                </div>
              </label>
            </div>

            {/* Row 6: Water Intake */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-white text-base font-medium leading-normal pb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">water_drop</span>
                  Lượng nước uống
                </p>
                <div className="relative">
                  <input
                    name="water"
                    type="number"
                    value={formData.water}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5447] bg-[#1c2721] focus:border-primary h-14 placeholder:text-[#9db9ab] p-[15px] pr-12 text-base font-normal leading-normal"
                    placeholder="Ví dụ: 2000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">lít</span>
                </div>
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                <span className="material-symbols-outlined !text-xl">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto h-12 px-6 flex items-center justify-center rounded-lg text-white font-semibold text-base transition-colors bg-transparent hover:bg-white/10"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-12 px-6 flex items-center justify-center rounded-lg text-black bg-primary font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MetricsEntryPage;
