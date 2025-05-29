import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaFileInvoiceDollar, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

export default function OptionOrder() {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };
        if (showOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptions]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Quản lý đơn hàng
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation('/orders')}
                        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Quản lý đơn hàng</h2>
                                <p className="text-blue-100">Xem và quản lý tất cả đơn hàng</p>
                            </div>
                            <FaClipboardList className="text-4xl text-blue-100" />
                        </div>
                    </motion.div>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-white rounded-xl shadow-lg p-6 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300"
                            onClick={() => setShowOptions((prev) => !prev)}
                        >
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-gray-800">Xử lý đơn hàng</h2>
                                <p className="text-gray-600">Chọn loại đơn hàng cần xử lý</p>
                            </div>
                            <motion.div
                                animate={{ rotate: showOptions ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaChevronDown className="text-2xl text-gray-600" />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {showOptions && (
                                <motion.div
                                    ref={optionsRef}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10"
                                >
                                    <motion.button
                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                        className="w-full p-4 flex items-center space-x-3 border-b border-gray-100"
                                        onClick={() => {
                                            setShowOptions(false);
                                            navigate('/orders/paid');
                                        }}
                                    >
                                        <FaFileInvoiceDollar className="text-green-600 text-xl" />
                                        <span className="text-gray-700">Đơn hàng đã thanh toán</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                        className="w-full p-4 flex items-center space-x-3"
                                        onClick={() => {
                                            setShowOptions(false);
                                            navigate('/orders/confirmed');
                                        }}
                                    >
                                        <FaCheckCircle className="text-blue-600 text-xl" />
                                        <span className="text-gray-700">Đơn hàng đã xác nhận</span>
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}