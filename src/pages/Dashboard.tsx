import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState('monthly');

    // Get last 6 months dynamically
    const getLast6Months = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            last6Months.push({
                name: months[date.getMonth()],
                fullDate: date
            });
        }
        
        return last6Months;
    };

    // Generate realistic data for last 6 months
    const monthlyClientsData = useMemo(() => {
        const last6Months = getLast6Months();
        return last6Months.map((month, index) => ({
            name: month.name,
            clients: Math.floor(Math.random() * 20) + 10 + index * 2 // Trending upward
        }));
    }, []);

    // const monthlyProjectsData = useMemo(() => {
    //     const last6Months = getLast6Months();
    //     return last6Months.map((month, index) => ({
    //         name: month.name,
    //         completed: Math.floor(Math.random() * 15) + 8 + index * 2 // Trending upward
    //     }));
    // }, []);

    const monthlyProjectsData = useMemo(() => {
        const last6Months = getLast6Months();
        return last6Months.map((month, index) => ({
            name: month.name,
            completed: Math.floor(Math.random() * 15) + 8 + index * 2 // Trending upward
        }));
    }, []);

    // Yearly data
    const yearlyClientsData = [
        { name: '2021', clients: 85 },
        { name: '2022', clients: 142 },
        { name: '2023', clients: 198 },
        { name: '2024', clients: 156 },
    ];

    const yearlyProjectsData = [
        { name: '2021', completed: 65 },
        { name: '2022', completed: 118 },
        { name: '2023', completed: 175 },
        { name: '2024', completed: 85 },
    ];

    // Get data based on selected time filter
    const getClientsData = () => {
        return timeFilter === 'yearly' ? yearlyClientsData : monthlyClientsData;
    };

    const getProjectsData = () => {
        return timeFilter === 'yearly' ? yearlyProjectsData : monthlyProjectsData;
    };

    // Update stats based on time filter
    const getStats = () => {
        if (timeFilter === 'yearly') {
            return [
                { title: 'Total Clients', value: '581', change: '+28%', color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Active Projects', value: '45', change: '+8%', color: 'text-green-600', bg: 'bg-green-50' },
                { title: 'Revenue', value: '₹1.2M', change: '+35%', color: 'text-purple-600', bg: 'bg-purple-50' },
                { title: 'Team Members', value: '24', change: '+15%', color: 'text-orange-600', bg: 'bg-orange-50' },
            ];
        } else {
            return [
                { title: 'Total Clients', value: '156', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Active Projects', value: '45', change: '+8%', color: 'text-green-600', bg: 'bg-green-50' },
                { title: 'Revenue', value: '₹125K', change: '+15%', color: 'text-purple-600', bg: 'bg-purple-50' },
                { title: 'Team Members', value: '24', change: '+2%', color: 'text-orange-600', bg: 'bg-orange-50' },
            ];
        }
    };

    const statusData = [
        { name: 'Active Projects', value: 45, color: '#3B82F6' },
        { name: 'Completed', value: 30, color: '#10B981' },
        { name: 'On Hold', value: 15, color: '#F59E0B' },
        { name: 'Cancelled', value: 10, color: '#EF4444' },
    ];

    // Calculate total for percentage
    const totalProjects = statusData.reduce((sum, item) => sum + item.value, 0);

    // Custom tooltip for pie chart with percentage
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / totalProjects) * 100).toFixed(1);
            return (
                <div className="bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        Projects: <span className="font-semibold">{data.value}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Percentage: <span className="font-semibold">{percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="mt-4 sm:mt-0">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="monthly">Monthly View</option>
                        <option value="yearly">Yearly View</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getStats().map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <div className={`w-6 h-6 ${stat.color}`}>📊</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clients Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        New Clients - {timeFilter === 'yearly' ? 'Yearly' : 'Monthly'} View
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getClientsData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="clients" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Project Status Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Project Completion Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Project Completions - {timeFilter === 'yearly' ? 'Yearly' : 'Monthly'} View
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getProjectsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


export default Dashboard;