import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
    joinDate: string;
    department: string;
    status: 'active' | 'inactive';
    avatar: string;
    phone: string;
    projects: number;
    address?: string;
    salary?: number;
    skills?: string[];
}

interface TeamContextType {
    teamMembers: TeamMember[];
    addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
    updateTeamMember: (id: number, member: Partial<TeamMember>) => void;
    deleteTeamMember: (id: number) => void;
    getTeamMember: (id: number) => TeamMember | undefined;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (context === undefined) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        // Load team members from localStorage on app start
        const savedMembers = localStorage.getItem('teamMembers');
        if (savedMembers) {
            setTeamMembers(JSON.parse(savedMembers));
        } else {
            // Initialize with sample data
            const sampleMembers: TeamMember[] = [
                {
                    id: 1,
                    name: 'John Smith',
                    role: 'Senior Developer',
                    email: 'john.smith@company.com',
                    joinDate: '2023-01-15',
                    department: 'Development',
                    status: 'active',
                    avatar: 'JS',
                    phone: '+1 (555) 123-4567',
                    projects: 8,
                    address: '123 Main St, City, State',
                    salary: 85000,
                    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB']
                },
                {
                    id: 2,
                    name: 'Sarah Johnson',
                    role: 'UI/UX Designer',
                    email: 'sarah.johnson@company.com',
                    joinDate: '2023-03-20',
                    department: 'Design',
                    status: 'active',
                    avatar: 'SJ',
                    phone: '+1 (555) 234-5678',
                    projects: 12,
                    address: '456 Design Ave, City, State',
                    salary: 75000,
                    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping']
                },
                {
                    id: 3,
                    name: 'Mike Chen',
                    role: 'Project Manager',
                    email: 'mike.chen@company.com',
                    joinDate: '2022-11-10',
                    department: 'Management',
                    status: 'active',
                    avatar: 'MC',
                    phone: '+1 (555) 345-6789',
                    projects: 15,
                    address: '789 Management Blvd, City, State',
                    salary: 95000,
                    skills: ['Agile', 'Scrum', 'Jira', 'Leadership']
                },
                {
                    id: 4,
                    name: 'Emily Davis',
                    role: 'Frontend Developer',
                    email: 'emily.davis@company.com',
                    joinDate: '2024-01-08',
                    department: 'Development',
                    status: 'active',
                    avatar: 'ED',
                    phone: '+1 (555) 456-7890',
                    projects: 5,
                    address: '321 Frontend St, City, State',
                    salary: 70000,
                    skills: ['Vue.js', 'CSS', 'JavaScript', 'Tailwind']
                },
                {
                    id: 5,
                    name: 'Alex Rodriguez',
                    role: 'Backend Developer',
                    email: 'alex.rodriguez@company.com',
                    joinDate: '2023-07-12',
                    department: 'Development',
                    status: 'active',
                    avatar: 'AR',
                    phone: '+1 (555) 567-8901',
                    projects: 10,
                    address: '654 Backend Way, City, State',
                    salary: 80000,
                    skills: ['Python', 'Django', 'PostgreSQL', 'AWS']
                },
                {
                    id: 6,
                    name: 'Lisa Wang',
                    role: 'QA Engineer',
                    email: 'lisa.wang@company.com',
                    joinDate: '2023-09-05',
                    department: 'Quality Assurance',
                    status: 'inactive',
                    avatar: 'LW',
                    phone: '+1 (555) 678-9012',
                    projects: 7,
                    address: '987 QA Lane, City, State',
                    salary: 65000,
                    skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing']
                }
            ];
            setTeamMembers(sampleMembers);
            localStorage.setItem('teamMembers', JSON.stringify(sampleMembers));
        }
    }, []);

    const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
        const newMember: TeamMember = {
            ...memberData,
            id: Date.now()
        };
        const updatedMembers = [...teamMembers, newMember];
        setTeamMembers(updatedMembers);
        localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    };

    const updateTeamMember = (id: number, memberData: Partial<TeamMember>) => {
        const updatedMembers = teamMembers.map(member =>
            member.id === id ? { ...member, ...memberData } : member
        );
        setTeamMembers(updatedMembers);
        localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    };

    const deleteTeamMember = (id: number) => {
        const updatedMembers = teamMembers.filter(member => member.id !== id);
        setTeamMembers(updatedMembers);
        localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    };

    const getTeamMember = (id: number) => {
        return teamMembers.find(member => member.id === id);
    };

    const value = {
        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        getTeamMember
    };

    return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};