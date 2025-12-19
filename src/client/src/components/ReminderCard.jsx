import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ReminderCard = ({ reminder, onToggle, onDelete }) => {
  const getReminderIcon = (type) => {
    const icons = {
      medication: 'medication',
      water: 'water_drop',
      exercise: 'fitness_center',
      meal: 'restaurant',
      sleep: 'bedtime',
      measurement: 'monitor_heart',
      custom: 'notifications',
    };
    return icons[type] || 'notifications';
  };

  const getReminderColor = (type) => {
    const colors = {
      medication: 'text-red-500',
      water: 'text-blue-500',
      exercise: 'text-green-500',
      meal: 'text-yellow-500',
      sleep: 'text-purple-500',
      measurement: 'text-pink-500',
      custom: 'text-gray-500',
    };
    return colors[type] || 'text-gray-500';
  };

  const getFrequencyText = (frequency, days) => {
    if (frequency === 'once') return 'Một lần';
    if (frequency === 'daily') return 'Hàng ngày';
    if (frequency === 'weekly' && days) {
      const dayNames = {
        monday: 'T2',
        tuesday: 'T3',
        wednesday: 'T4',
        thursday: 'T5',
        friday: 'T6',
        saturday: 'T7',
        sunday: 'CN',
      };
      return days.map(d => dayNames[d]).join(', ');
    }
    return frequency;
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-white/10 ${getReminderColor(reminder.type)}`}>
          <span className="material-symbols-outlined text-2xl">
            {getReminderIcon(reminder.type)}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-black dark:text-white font-bold text-lg">
              {reminder.title}
            </h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={reminder.enabled}
                onChange={() => onToggle(reminder._id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <p className="text-gray-600 dark:text-[#9db9ab] text-sm mb-3">
            {reminder.message}
          </p>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-[#9db9ab]">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>{reminder.time}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 dark:text-[#9db9ab]">
              <span className="material-symbols-outlined text-base">repeat</span>
              <span>{getFrequencyText(reminder.frequency, reminder.days)}</span>
            </div>
            
            {reminder.nextScheduled && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-[#9db9ab]">
                <span className="material-symbols-outlined text-base">event</span>
                <span>
                  Tiếp theo: {format(new Date(reminder.nextScheduled), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onDelete(reminder._id)}
          className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Xóa nhắc nhở"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};

export default ReminderCard;
