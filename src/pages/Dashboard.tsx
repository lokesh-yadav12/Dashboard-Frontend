import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useClients } from '../contexts/ClientContext';
import { useTeam } from '../contexts/TeamContext';
import { usePayments } from '../contexts/PaymentContext';
import MobileFilterDropdown from '../components/MobileFilterDropdown';

const Dashboard: React.FC = () => {
    const { clients } = useClients();
    const { teamMembers } = useTeam();
    const { payments } = usePayments();
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

    // Generate realistic data for last 6 months based on actual clients
    const monthlyClientsData = useMemo(() => {
        const last6Months = getLast6Months();
        return last6Months.map((month) => {
            const monthClients = clients.filter(client => {
                const clientDate = new Date(client.startDate);
                return clientDate.getMonth() === month.fullDate.getMonth() && 
                       clientDate.getFullYear() === month.fullDate.getFullYear();
            });
            return {
                name: month.name,
                clients: monthClients.length
            };
        });
    }, [clients]);

    // const monthlyProjectsData = useMemo(() => {
    //     const last6Months = getLast6Months();
    //     return last6Months.map((month, index) => ({
    //         name: month.name,
    //         completed: Math.floor(Math.random() * 15) + 8 + index * 2 // Trending upward
    //     }));
    // }, []);

    const monthlyProjectsData = useMemo(() => {
        const last6Months = getLast6Months();
        return last6Months.map((month) => {
            const monthProjects = clients.filter(client => {
                const clientDate = new Date(client.startDate);
                return client.status === 'completed' &&
                       clientDate.getMonth() === month.fullDate.getMonth() && 
                       clientDate.getFullYear() === month.fullDate.getFullYear();
            });
            return {
                name: month.name,
                completed: monthProjects.length
            };
        });
    }, [clients]);

    // Yearly data based on actual clients
    const yearlyClientsData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
        
        return years.map(year => {
            const yearClients = clients.filter(client => {
                const clientDate = new Date(client.startDate);
                return clientDate.getFullYear() === year;
            });
            return {
                name: year.toString(),
                clients: yearClients.length
            };
        });
    }, [clients]);

    const yearlyProjectsData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
        
        return years.map(year => {
            const yearProjects = clients.filter(client => {
                const clientDate = new Date(client.startDate);
                return client.status === 'completed' && clientDate.getFullYear() === year;
            });
            return {
                name: year.toString(),
                completed: yearProjects.length
            };
        });
    }, [clients]);

    // Get data based on selected time filter
    const getClientsData = () => {
        return timeFilter === 'yearly' ? yearlyClientsData : monthlyClientsData;
    };

    const getProjectsData = () => {
        return timeFilter === 'yearly' ? yearlyProjectsData : monthlyProjectsData;
    };

    // Calculate actual stats
    const calculateStats = () => {
        const totalClients = clients.length;
        const activeProjects = clients.filter(c => c.status === 'live' || c.status === 'development').length;
        const completedProjects = clients.filter(c => c.status === 'completed').length;
        
        // Calculate total revenue from all payments
        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const formattedRevenue = totalRevenue >= 100000 
            ? `₹${(totalRevenue / 100000).toFixed(1)}L` 
            : `₹${(totalRevenue / 1000).toFixed(1)}K`;
        
        const totalTeamMembers = teamMembers.length;
        const activeTeamMembers = teamMembers.filter(m => m.status === 'active').length;

        // Calculate growth percentages (comparing to previous period)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const currentMonthClients = clients.filter(c => {
            const date = new Date(c.startDate);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
        
        const lastMonthClients = clients.filter(c => {
            const date = new Date(c.startDate);
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length;
        
        const clientGrowth = lastMonthClients > 0 
            ? `${((currentMonthClients - lastMonthClients) / lastMonthClients * 100).toFixed(0)}%`
            : currentMonthClients > 0 ? '+100%' : '0%';

        return {
            totalClients,
            activeProjects,
            completedProjects,
            totalRevenue: formattedRevenue,
            totalTeamMembers,
            activeTeamMembers,
            clientGrowth
        };
    };

    const stats = calculateStats();

    // Update stats based on time filter
    const getStats = () => {
        return [
            { 
                title: 'Total Clients', 
                value: stats.totalClients.toString(), 
                change: stats.clientGrowth, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50' 
            },
            { 
                title: 'Active Projects', 
                value: stats.activeProjects.toString(), 
                change: stats.activeProjects > 0 ? '+' + Math.round((stats.activeProjects / stats.totalClients) * 100) + '%' : '0%', 
                color: 'text-green-600', 
                bg: 'bg-green-50' 
            },
            { 
                title: 'Revenue', 
                value: stats.totalRevenue, 
                change: payments.length > 0 ? '+' + Math.round((payments.length / Math.max(clients.length, 1)) * 100) + '%' : '0%', 
                color: 'text-purple-600', 
                bg: 'bg-purple-50' 
            },
            { 
                title: 'Team Members', 
                value: stats.totalTeamMembers.toString(), 
                change: stats.activeTeamMembers > 0 ? Math.round((stats.activeTeamMembers / stats.totalTeamMembers) * 100) + '% Active' : '0%', 
                color: 'text-orange-600', 
                bg: 'bg-orange-50' 
            },
        ];
    };

    // Calculate actual project status data
    const statusData = useMemo(() => {
        const liveProjects = clients.filter(c => c.status === 'live').length;
        const developmentProjects = clients.filter(c => c.status === 'development').length;
        const completedProjects = clients.filter(c => c.status === 'completed').length;
        
        return [
            { name: 'Live Projects', value: liveProjects, color: '#3B82F6' },
            { name: 'Development', value: developmentProjects, color: '#10B981' },
            { name: 'Completed', value: completedProjects, color: '#F59E0B' },
        ].filter(item => item.value > 0); // Only show categories with data
    }, [clients]);

    // Calculate total for percentage
    const totalProjects = useMemo(() => {
        return statusData.reduce((sum, item) => sum + item.value, 0);
    }, [statusData]);

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
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="w-full sm:w-auto">
                    <MobileFilterDropdown
                        value={timeFilter}
                        onChange={setTimeFilter}
                        options={[
                            { value: 'monthly', label: 'Monthly View' },
                            { value: 'yearly', label: 'Yearly View' }
                        ]}
                    />
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