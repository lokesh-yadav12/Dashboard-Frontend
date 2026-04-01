import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TeamMember {
    id: number;
    employeeId: string;
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
    highestQualification?: string;
    qualificationDocument?: string;
    profileImage?: string;
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
            const sampleMembers: TeamMember[] = [];
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