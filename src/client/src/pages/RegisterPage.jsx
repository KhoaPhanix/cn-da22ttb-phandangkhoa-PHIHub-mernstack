import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'male',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Đăng ký thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-8 bg-background-light dark:bg-background-dark font-display">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 flex w-full items-center justify-start p-6 lg:p-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            health_and_safety
          </span>
          <span className="text-lg font-bold text-text-light dark:text-text-dark">
            Trung tâm Sức khỏe Cá nhân
          </span>
        </Link>
      </header>

      <main className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl border border-border-light/50 dark:border-border-dark shadow-xl lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="flex flex-col justify-center bg-background-light dark:bg-background-dark p-8 sm:p-12">
          <div className="w-full max-w-md">
            {/* PageHeading */}
            <div className="mb-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-text-light dark:text-text-dark">
                  Tạo Tài Khoản Mới
                </h1>
                <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">
                  Bắt đầu hành trình chăm sóc sức khỏe thông minh của bạn.
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* TextField: Họ và Tên */}
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-text-light dark:text-text-dark">
                  Họ và Tên
                </p>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark p-3 text-base font-normal leading-normal text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="Nhập họ và tên của bạn"
                />
              </label>

              {/* TextField: Email */}
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-text-light dark:text-text-dark">
                  Địa chỉ Email
                </p>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT border ${
                    errors.email ? 'border-error' : 'border-border-light dark:border-border-dark'
                  } bg-input-bg-light dark:bg-input-bg-dark p-3 text-base font-normal leading-normal text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20`}
                  placeholder="nhapemail@email.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-error">{errors.email}</p>
                )}
              </label>

              {/* TextField: Mật khẩu */}
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-text-light dark:text-text-dark">
                  Mật khẩu
                </p>
                <div className="flex w-full flex-1 items-stretch rounded-DEFAULT">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-DEFAULT border border-border-light dark:border-border-dark border-r-0 bg-input-bg-light dark:bg-input-bg-dark p-3 pr-2 text-base font-normal leading-normal text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                    placeholder="Nhập mật khẩu của bạn"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex cursor-pointer items-center justify-center border border-border-light dark:border-border-dark border-l-0 bg-input-bg-light dark:bg-input-bg-dark px-3 rounded-r-DEFAULT text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-error">{errors.password}</p>
                )}
              </label>

              {/* TextField: Xác nhận lại mật khẩu */}
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-text-light dark:text-text-dark">
                  Xác nhận lại mật khẩu
                </p>
                <div className="flex w-full flex-1 items-stretch rounded-DEFAULT">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-DEFAULT border ${
                      errors.confirmPassword ? 'border-error' : 'border-border-light dark:border-border-dark'
                    } border-r-0 bg-input-bg-light dark:bg-input-bg-dark p-3 pr-2 text-base font-normal leading-normal text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="flex cursor-pointer items-center justify-center border border-border-light dark:border-border-dark border-l-0 bg-input-bg-light dark:bg-input-bg-dark px-3 rounded-r-DEFAULT text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-error">{errors.confirmPassword}</p>
                )}
              </label>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Date Picker: Ngày sinh */}
                <label className="flex flex-col">
                  <p className="pb-2 text-sm font-medium leading-normal text-text-light dark:text-text-dark">
                    Ngày sinh
                  </p>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-DEFAULT border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark p-3 text-base font-normal leading-normal text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                {/* Radio Buttons: Giới tính */}
                <div className="flex flex-col">
                  <p className="pb-2 text-sm font-medium leading-normal text-text-light dark:text-text-dark">
                    Giới tính
                  </p>
                  <div className="grid h-12 grid-cols-3 gap-2">
                    <label className="flex cursor-pointer items-center justify-center rounded-DEFAULT border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark text-center text-sm font-medium text-text-light dark:text-text-dark has-[:checked]:border-primary has-[:checked]:bg-primary/20 has-[:checked]:text-primary transition-colors">
                      <input
                        className="sr-only"
                        name="gender"
                        type="radio"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                      />
                      Nam
                    </label>
                    <label className="flex cursor-pointer items-center justify-center rounded-DEFAULT border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark text-center text-sm font-medium text-text-light dark:text-text-dark has-[:checked]:border-primary has-[:checked]:bg-primary/20 has-[:checked]:text-primary transition-colors">
                      <input
                        className="sr-only"
                        name="gender"
                        type="radio"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                      />
                      Nữ
                    </label>
                    <label className="flex cursor-pointer items-center justify-center rounded-DEFAULT border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark text-center text-sm font-medium text-text-light dark:text-text-dark has-[:checked]:border-primary has-[:checked]:bg-primary/20 has-[:checked]:text-primary transition-colors">
                      <input
                        className="sr-only"
                        name="gender"
                        type="radio"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                      />
                      Khác
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined !text-xl">error</span>
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-DEFAULT bg-primary px-6 text-base font-bold text-background-dark transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>

            {/* Link to Login */}
            <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Hero Image */}
        <div className="relative hidden items-center justify-center bg-[#102219] lg:flex">
          <img
            className="h-full w-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
            alt="A doctor examining medical data on a tablet"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-12 text-white">
            <h2 className="mb-4 text-4xl font-bold">Dữ liệu sức khỏe trong tầm tay bạn.</h2>
            <p className="text-lg text-white/80">
              Tham gia cùng chúng tôi để theo dõi, phân tích và cải thiện sức khỏe của bạn một cách thông minh và hiệu quả.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
