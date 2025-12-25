import { useState, useEffect } from 'react';
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, resolveAlert } from '../services/alertService';

const AlertBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await getAlerts({ isRead: false });
      const alertsData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setAlerts(alertsData.slice(0, 5)); // Hiển thị tối đa 5 alerts
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (error) {
      // Silent fail - alert already removed from view
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsRead();
      setAlerts([]);
    } catch (error) {
      // Silent fail - alerts already cleared
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (error) {
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      critical: 'bg-red-500/20 border-red-500/50 text-red-400',
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      low: 'info',
      medium: 'warning',
      high: 'error',
      critical: 'crisis_alert',
    };
    return icons[severity] || 'info';
  };

  if (loading || alerts.length === 0) {
    return null;
  }

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 3);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-black dark:text-white text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications_active</span>
          Cảnh báo sức khỏe
        </h3>
        {alerts.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayedAlerts.map((alert) => (
          <div
            key={alert._id}
            className={`border-2 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl mt-0.5">
                {getSeverityIcon(alert.severity)}
              </span>
              <div className="flex-1">
                <h4 className="font-bold mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.message}</p>
                {alert.metricValue && (
                  <p className="text-xs mt-2 opacity-75">
                    Giá trị: {alert.metricValue} {alert.metricType}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {alert.actionRequired && (
                  <button
                    onClick={() => handleResolve(alert._id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Giải quyết"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                  </button>
                )}
                <button
                  onClick={() => handleMarkAsRead(alert._id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Đóng"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-center text-sm text-primary hover:underline"
        >
          {showAll ? 'Thu gọn' : `Xem thêm ${alerts.length - 3} cảnh báo`}
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
