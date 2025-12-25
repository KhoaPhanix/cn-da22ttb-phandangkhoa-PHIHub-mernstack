import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, medical, emergency
  const [avatarPreview, setAvatarPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'male',
    phone: '',
    address: '',
  });
  const [medicalInfo, setMedicalInfo] = useState({
    chronicConditions: [],
    allergies: [],
    medications: [],
    emergencyContact: { name: '', relationship: '', phone: '' },
    doctor: { name: '', specialty: '', phone: '', hospital: '' }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      const profile = response.data || response; // Handle both {success: true, data: {...}} and direct response
      
      setFormData({
        name: profile.name || '',
        dob: profile.dob ? profile.dob.split('T')[0] : '',
        gender: profile.gender || 'male',
        phone: profile.phone || '',
        address: profile.address || '',
      });

      // Set avatar preview
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }

      // Set medical info
      if (profile.medicalInfo) {
        setMedicalInfo({
          chronicConditions: profile.medicalInfo.chronicConditions || [],
          allergies: profile.medicalInfo.allergies || [],
          medications: profile.medicalInfo.medications || [],
          emergencyContact: profile.medicalInfo.emergencyContact || { name: '', relationship: '', phone: '' },
          doctor: profile.medicalInfo.doctor || { name: '', specialty: '', phone: '', hospital: '' }
        });
      }
    } catch (error) {
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh (jpg, png, gif)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      // Upload to server
      const response = await uploadAvatar(file);
      const avatarUrl = response.data?.avatar || response.avatar;
      
      // Update preview (use relative path since we have proxy/nginx)
      setAvatarPreview(avatarUrl.startsWith('http') ? avatarUrl : avatarUrl);
      
      // Update user context
      setUser({ ...user, avatar: avatarUrl });
      
      setSuccess('Cập nhật ảnh đại diện thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updateData = { ...formData, medicalInfo };
      const response = await updateUserProfile(updateData);
      const updatedUser = response.data || response; // Handle both response formats
      setUser(updatedUser);
      setSuccess('Cập nhật hồ sơ thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  // Medical info handlers
  const addChronicCondition = () => {
    setMedicalInfo({
      ...medicalInfo,
      chronicConditions: [...medicalInfo.chronicConditions, { name: '', diagnosedDate: '', severity: 'mild', notes: '' }]
    });
  };

  const updateChronicCondition = (index, field, value) => {
    const updated = [...medicalInfo.chronicConditions];
    updated[index][field] = value;
    setMedicalInfo({ ...medicalInfo, chronicConditions: updated });
  };

  const removeChronicCondition = (index) => {
    setMedicalInfo({
      ...medicalInfo,
      chronicConditions: medicalInfo.chronicConditions.filter((_, i) => i !== index)
    });
  };

  const addAllergy = () => {
    setMedicalInfo({
      ...medicalInfo,
      allergies: [...medicalInfo.allergies, { allergen: '', reaction: '', severity: 'mild' }]
    });
  };

  const updateAllergy = (index, field, value) => {
    const updated = [...medicalInfo.allergies];
    updated[index][field] = value;
    setMedicalInfo({ ...medicalInfo, allergies: updated });
  };

  const removeAllergy = (index) => {
    setMedicalInfo({
      ...medicalInfo,
      allergies: medicalInfo.allergies.filter((_, i) => i !== index)
    });
  };

  const addMedication = () => {
    setMedicalInfo({
      ...medicalInfo,
      medications: [...medicalInfo.medications, { 
        name: '', 
        dosage: '', 
        frequency: '', 
        startDate: '', 
        endDate: '', 
        purpose: '', 
        prescribedBy: '' 
      }]
    });
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medicalInfo.medications];
    updated[index][field] = value;
    setMedicalInfo({ ...medicalInfo, medications: updated });
  };

  const removeMedication = (index) => {
    setMedicalInfo({
      ...medicalInfo,
      medications: medicalInfo.medications.filter((_, i) => i !== index)
    });
  };

  const updateEmergencyContact = (field, value) => {
    setMedicalInfo({
      ...medicalInfo,
      emergencyContact: { ...medicalInfo.emergencyContact, [field]: value }
    });
  };

  const updateDoctor = (field, value) => {
    setMedicalInfo({
      ...medicalInfo,
      doctor: { ...medicalInfo.doctor, [field]: value }
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
      
      <main className="px-4 md:px-10 py-8 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Hồ sơ cá nhân
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-black/10 dark:border-white/10 px-4 mb-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'basic'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'medical'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Thông tin y tế
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'emergency'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Liên hệ khẩn cấp
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            {/* Left Column: Avatar */}
            <div className="lg:col-span-1">
              <div className="flex w-full flex-col gap-4 items-center p-6 bg-white/5 dark:bg-white/[.02] rounded-xl border border-black/10 dark:border-white/10">
                <div className="relative group">
                  {avatarPreview ? (
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-white/10 cursor-pointer"
                      style={{ backgroundImage: `url(${avatarPreview})` }}
                      onClick={handleAvatarClick}
                    >
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-white/10 bg-primary/20 flex items-center justify-center cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <span className="material-symbols-outlined text-white text-5xl">person</span>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
                    {formData.name || 'User'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                    {user?.email}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="flex w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">{uploading ? 'Đang tải lên...' : 'Thay đổi ảnh'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <div className="flex flex-col w-full bg-white/5 dark:bg-white/[.02] rounded-xl border border-black/10 dark:border-white/10 p-6">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  
                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col flex-1">
                          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                            Họ và tên
                          </p>
                          <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                          />
                        </label>

                        <label className="flex flex-col flex-1">
                          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                            Ngày sinh
                          </p>
                          <div className="relative flex w-full flex-1 items-stretch">
                            <input
                              name="dob"
                              type="date"
                              value={formData.dob}
                              onChange={handleChange}
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-500 pl-4 pr-10 text-base font-normal leading-normal"
                            />
                            <div className="absolute right-0 top-0 h-full text-gray-600 dark:text-gray-400 flex items-center justify-center pr-3 pointer-events-none">
                              <span className="material-symbols-outlined text-xl">calendar_today</span>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col flex-1">
                          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                            Số điện thoại
                          </p>
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                            placeholder="0987654321"
                          />
                        </label>

                        <div className="flex flex-col flex-1">
                          <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                            Giới tính
                          </p>
                          <div className="relative w-full">
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="form-select appearance-none w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                            >
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                              <option value="other">Khác</option>
                            </select>
                            <div className="absolute right-0 top-0 h-full text-gray-600 dark:text-gray-400 flex items-center justify-center pr-3 pointer-events-none">
                              <span className="material-symbols-outlined text-xl">expand_more</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <label className="flex flex-col flex-1">
                        <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                          Email
                        </p>
                        <input
                          type="email"
                          readOnly
                          value={user?.email || ''}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-0 border border-black/20 dark:border-white/20 bg-gray-100 dark:bg-white/5 cursor-not-allowed h-12 placeholder:text-gray-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                        />
                      </label>

                      <label className="flex flex-col flex-1">
                        <p className="text-black dark:text-white text-sm font-medium leading-normal pb-2">
                          Địa chỉ
                        </p>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 min-h-24 placeholder:text-gray-500 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                          placeholder="Nhập địa chỉ của bạn..."
                        />
                      </label>

                      <div className="border-t border-black/10 dark:border-white/10 pt-6 mt-2">
                        <a href="#" className="text-sm font-medium text-primary hover:underline">
                          Thay đổi mật khẩu
                        </a>
                      </div>
                    </>
                  )}

                  {/* Medical Info Tab */}
                  {activeTab === 'medical' && (
                    <>
                      {/* Chronic Conditions */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-black dark:text-white text-lg font-bold">Bệnh lý nền</h3>
                          <button
                            type="button"
                            onClick={addChronicCondition}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                          >
                            <span className="material-symbols-outlined !text-xl">add</span>
                            <span className="text-sm font-semibold">Thêm bệnh lý</span>
                          </button>
                        </div>

                        {medicalInfo.chronicConditions.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm italic">Chưa có bệnh lý nền nào được ghi nhận</p>
                        ) : (
                          medicalInfo.chronicConditions.map((condition, index) => (
                            <div key={index} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-3">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bệnh lý #{index + 1}</p>
                                <button
                                  type="button"
                                  onClick={() => removeChronicCondition(index)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <span className="material-symbols-outlined !text-xl">delete</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="Tên bệnh lý"
                                  value={condition.name}
                                  onChange={(e) => updateChronicCondition(index, 'name', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                                <input
                                  type="date"
                                  placeholder="Ngày chẩn đoán"
                                  value={condition.diagnosedDate}
                                  onChange={(e) => updateChronicCondition(index, 'diagnosedDate', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                              </div>
                              <select
                                value={condition.severity}
                                onChange={(e) => updateChronicCondition(index, 'severity', e.target.value)}
                                className="form-select w-full rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                              >
                                <option value="mild">Nhẹ</option>
                                <option value="moderate">Trung bình</option>
                                <option value="severe">Nặng</option>
                              </select>
                              <textarea
                                placeholder="Ghi chú"
                                value={condition.notes}
                                onChange={(e) => updateChronicCondition(index, 'notes', e.target.value)}
                                className="form-textarea w-full rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm min-h-20"
                              />
                            </div>
                          ))
                        )}
                      </div>

                      {/* Allergies */}
                      <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
                        <div className="flex justify-between items-center">
                          <h3 className="text-black dark:text-white text-lg font-bold">Dị ứng</h3>
                          <button
                            type="button"
                            onClick={addAllergy}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                          >
                            <span className="material-symbols-outlined !text-xl">add</span>
                            <span className="text-sm font-semibold">Thêm dị ứng</span>
                          </button>
                        </div>

                        {medicalInfo.allergies.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm italic">Chưa có dị ứng nào được ghi nhận</p>
                        ) : (
                          medicalInfo.allergies.map((allergy, index) => (
                            <div key={index} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-3">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dị ứng #{index + 1}</p>
                                <button
                                  type="button"
                                  onClick={() => removeAllergy(index)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <span className="material-symbols-outlined !text-xl">delete</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="Chất gây dị ứng"
                                  value={allergy.allergen}
                                  onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Phản ứng"
                                  value={allergy.reaction}
                                  onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                              </div>
                              <select
                                value={allergy.severity}
                                onChange={(e) => updateAllergy(index, 'severity', e.target.value)}
                                className="form-select w-full rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                              >
                                <option value="mild">Nhẹ</option>
                                <option value="moderate">Trung bình</option>
                                <option value="severe">Nghiêm trọng</option>
                              </select>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Medications */}
                      <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
                        <div className="flex justify-between items-center">
                          <h3 className="text-black dark:text-white text-lg font-bold">Thuốc đang dùng</h3>
                          <button
                            type="button"
                            onClick={addMedication}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                          >
                            <span className="material-symbols-outlined !text-xl">add</span>
                            <span className="text-sm font-semibold">Thêm thuốc</span>
                          </button>
                        </div>

                        {medicalInfo.medications.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm italic">Chưa có thuốc nào được ghi nhận</p>
                        ) : (
                          medicalInfo.medications.map((med, index) => (
                            <div key={index} className="p-4 bg-black/5 dark:bg-white/5 rounded-lg space-y-3">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thuốc #{index + 1}</p>
                                <button
                                  type="button"
                                  onClick={() => removeMedication(index)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <span className="material-symbols-outlined !text-xl">delete</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="Tên thuốc"
                                  value={med.name}
                                  onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Liều lượng"
                                  value={med.dosage}
                                  onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  placeholder="Tần suất (vd: 2 lần/ngày)"
                                  value={med.frequency}
                                  onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                                <input
                                  type="date"
                                  placeholder="Ngày bắt đầu"
                                  value={med.startDate}
                                  onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                                <input
                                  type="date"
                                  placeholder="Ngày kết thúc"
                                  value={med.endDate}
                                  onChange={(e) => updateMedication(index, 'endDate', e.target.value)}
                                  className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="Mục đích sử dụng"
                                value={med.purpose}
                                onChange={(e) => updateMedication(index, 'purpose', e.target.value)}
                                className="form-input w-full rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Bác sĩ kê đơn"
                                value={med.prescribedBy}
                                onChange={(e) => updateMedication(index, 'prescribedBy', e.target.value)}
                                className="form-input w-full rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-white dark:bg-white/5 h-10 px-3 text-sm"
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}

                  {/* Emergency Contact Tab */}
                  {activeTab === 'emergency' && (
                    <>
                      {/* Emergency Contact */}
                      <div className="space-y-4">
                        <h3 className="text-black dark:text-white text-lg font-bold">Liên hệ khẩn cấp</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="flex flex-col">
                            <p className="text-black dark:text-white text-sm font-medium pb-2">Họ tên</p>
                            <input
                              type="text"
                              value={medicalInfo.emergencyContact.name}
                              onChange={(e) => updateEmergencyContact('name', e.target.value)}
                              className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                              placeholder="Nguyễn Văn A"
                            />
                          </label>
                          <label className="flex flex-col">
                            <p className="text-black dark:text-white text-sm font-medium pb-2">Mối quan hệ</p>
                            <input
                              type="text"
                              value={medicalInfo.emergencyContact.relationship}
                              onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                              className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                              placeholder="Vợ/Chồng, Con, Bạn..."
                            />
                          </label>
                        </div>
                        <label className="flex flex-col">
                          <p className="text-black dark:text-white text-sm font-medium pb-2">Số điện thoại</p>
                          <input
                            type="tel"
                            value={medicalInfo.emergencyContact.phone}
                            onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                            className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                            placeholder="0987654321"
                          />
                        </label>
                      </div>

                      {/* Doctor Information */}
                      <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
                        <h3 className="text-black dark:text-white text-lg font-bold">Thông tin bác sĩ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="flex flex-col">
                            <p className="text-black dark:text-white text-sm font-medium pb-2">Họ tên bác sĩ</p>
                            <input
                              type="text"
                              value={medicalInfo.doctor.name}
                              onChange={(e) => updateDoctor('name', e.target.value)}
                              className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                              placeholder="BS. Nguyễn Văn B"
                            />
                          </label>
                          <label className="flex flex-col">
                            <p className="text-black dark:text-white text-sm font-medium pb-2">Chuyên khoa</p>
                            <input
                              type="text"
                              value={medicalInfo.doctor.specialty}
                              onChange={(e) => updateDoctor('specialty', e.target.value)}
                              className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                              placeholder="Tim mạch, Nội khoa..."
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="flex flex-col">
                            <p className="text-black dark:text-white text-sm font-medium pb-2">Số điện thoại</p>
                            <input
                              type="tel"
                              value={medicalInfo.doctor.phone}
                              onChange={(e) => updateDoctor('phone', e.target.value)}
                              className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                              placeholder="0912345678"
                            />
                          </label>
                          <label className="flex flex-col">
                            <p className="text-black dark:text-white text-sm font-medium pb-2">Bệnh viện</p>
                            <input
                              type="text"
                              value={medicalInfo.doctor.hospital}
                              onChange={(e) => updateDoctor('hospital', e.target.value)}
                              className="form-input rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-black/20 dark:border-white/20 bg-transparent dark:bg-white/5 h-12 px-4"
                              placeholder="Bệnh viện Chợ Rẫy"
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                      <span className="material-symbols-outlined !text-xl">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                      <span className="material-symbols-outlined !text-xl">check_circle</span>
                      <span>{success}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-gray-800 dark:text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="truncate">Hủy</span>
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <span className="truncate">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
