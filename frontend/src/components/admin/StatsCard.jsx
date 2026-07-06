import { motion } from 'framer-motion';
import useCounter from '../../hooks/useCounter';

const StatsCard = ({ label, value, icon, color, index }) => {
  // شيل الـ $ و علامات تانية من الرقم
  const isNumber = !isNaN(parseFloat(value));
  const numericValue = isNumber ? parseFloat(value.toString().replace(/[^0-9.]/g, '')) : 0;
  const prefix = value?.toString().startsWith('$') ? '$' : '';

  const count = useCounter(numericValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm mb-1">{label}</p>
          <p className="text-3xl font-extrabold text-slate-800">
            {isNumber ? `${prefix}${count.toLocaleString()}` : value}
          </p>
        </div>
        <div
          className="p-3 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;