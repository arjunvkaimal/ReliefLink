  import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

  export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
  }

  export interface VictimRequest {
    id: string;
    userId: string;
    name: string;
    location: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: string;
    updatedAt: string;
  }

  export interface Disaster {
    id: string;
    name: string;
    location: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved';
    createdAt: string;
  }

  export interface Volunteer {
    id: string;
    userId: string;
    disasterId: string;
    skills: string;
    availability: string;
    location: string;
    contactInfo: string;
    status: 'active' | 'inactive';
    createdAt: string;
  }

  export interface VolunteerCall {
    id: string;
    volunteerId: string;
    disasterId: string;
    calledBy: string;
    calledAt: string;
    responseStatus: 'available' | 'busy' | 'not_reachable' | 'pending';
    notes?: string;
  }

  export interface Donation {
    id: string;
    userId: string;
    fundraiserId: string;
    amount: number;
    type: 'money' | 'resource';
    resourceName?: string;
    createdAt: string;
  }

  export interface Fundraiser {
    id: string;
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: string;
    endDate: string;
  }

  export interface Resource {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface ResourceAllocation {
    id: string;
    resourceId: string;
    requestId: string;
    quantity: number;
    allocatedDate: string;
  }

  export interface Report {
    id: string;
    userId: string;
    title: string;
    description: string;
    location: string;
    createdAt: string;
  }

  interface AppContextType {
    currentUser: User | null;
    users: User[];
    victimRequests: VictimRequest[];
    volunteers: Volunteer[];
    donations: Donation[];
    fundraisers: Fundraiser[];
    resources: Resource[];
    resourceAllocations: ResourceAllocation[];
    reports: Report[];
    disasters: Disaster[];
    volunteerCalls: VolunteerCall[];
    login: (email: string, password: string) => boolean;
    register: (email: string, password: string, name: string, phone: string) => boolean;
    logout: () => void;
    addVictimRequest: (request: Omit<VictimRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
    addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'createdAt'>) => void;
    addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;
    addFundraiser: (fundraiser: Omit<Fundraiser, 'id' | 'createdAt' | 'currentAmount'>) => void;
    addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
    addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
    addDisaster: (disaster: Omit<Disaster, 'id' | 'createdAt'>) => void;
    addVolunteerCall: (call: Omit<VolunteerCall, 'id' | 'calledAt'>) => void;
    updateVictimRequest: (id: string, updates: Partial<VictimRequest>) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    updateFundraiser: (id: string, updates: Partial<Fundraiser>) => void;
    updateResource: (id: string, updates: Partial<Resource>) => void;
    updateDisaster: (id: string, updates: Partial<Disaster>) => void;
    updateVolunteerCall: (id: string, updates: Partial<VolunteerCall>) => void;
    allocateResource: (allocation: Omit<ResourceAllocation, 'id'>) => void;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [victimRequests, setVictimRequests] = useState<VictimRequest[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [resourceAllocations, setResourceAllocations] = useState<ResourceAllocation[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [volunteerCalls, setVolunteerCalls] = useState<VolunteerCall[]>([]);

    useEffect(() => {
      const storedUsers = localStorage.getItem('users');
      const storedCurrentUser = localStorage.getItem('currentUser');
      const storedRequests = localStorage.getItem('victimRequests');
      const storedVolunteers = localStorage.getItem('volunteers');
      const storedDonations = localStorage.getItem('donations');
      const storedFundraisers = localStorage.getItem('fundraisers');
      const storedResources = localStorage.getItem('resources');
      const storedAllocations = localStorage.getItem('resourceAllocations');
      const storedReports = localStorage.getItem('reports');
      const storedDisasters = localStorage.getItem('disasters');
      const storedVolunteerCalls = localStorage.getItem('volunteerCalls');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
      if (storedRequests) setVictimRequests(JSON.parse(storedRequests));
      if (storedVolunteers) setVolunteers(JSON.parse(storedVolunteers));
      if (storedDonations) setDonations(JSON.parse(storedDonations));
      if (storedFundraisers) setFundraisers(JSON.parse(storedFundraisers));
      if (storedResources) setResources(JSON.parse(storedResources));
      if (storedAllocations) setResourceAllocations(JSON.parse(storedAllocations));
      if (storedReports) setReports(JSON.parse(storedReports));
      if (storedDisasters) setDisasters(JSON.parse(storedDisasters));
      if (storedVolunteerCalls) setVolunteerCalls(JSON.parse(storedVolunteerCalls));
    }, []);

    useEffect(() => {
      localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    }, [currentUser]);

    useEffect(() => {
      localStorage.setItem('victimRequests', JSON.stringify(victimRequests));
    }, [victimRequests]);

    useEffect(() => {
      localStorage.setItem('volunteers', JSON.stringify(volunteers));
    }, [volunteers]);

    useEffect(() => {
      localStorage.setItem('donations', JSON.stringify(donations));
    }, [donations]);

    useEffect(() => {
      localStorage.setItem('fundraisers', JSON.stringify(fundraisers));
    }, [fundraisers]);

    useEffect(() => {
      localStorage.setItem('resources', JSON.stringify(resources));
    }, [resources]);

    useEffect(() => {
      localStorage.setItem('resourceAllocations', JSON.stringify(resourceAllocations));
    }, [resourceAllocations]);

    useEffect(() => {
      localStorage.setItem('reports', JSON.stringify(reports));
    }, [reports]);

    useEffect(() => {
      localStorage.setItem('disasters', JSON.stringify(disasters));
    }, [disasters]);

    useEffect(() => {
      localStorage.setItem('volunteerCalls', JSON.stringify(volunteerCalls));
    }, [volunteerCalls]);

    const login = (email: string, password: string) => {
      const storedPasswords = JSON.parse(localStorage.getItem('passwords') || '{}');
      if (storedPasswords[email] === password) {
        const user = users.find((u) => u.email === email);
        if (user && user.isActive) {
          setCurrentUser(user);
          return true;
        }
      }
      return false;
    };

    const register = (email: string, password: string, name: string, phone: string) => {
      if (users.some((u) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        phone,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setUsers([...users, newUser]);

      const storedPasswords = JSON.parse(localStorage.getItem('passwords') || '{}');
      storedPasswords[email] = password;
      localStorage.setItem('passwords', JSON.stringify(storedPasswords));

      setCurrentUser(newUser);
      return true;
    };

    const logout = () => {
      setCurrentUser(null);
    };

    const addVictimRequest = (request: Omit<VictimRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newRequest: VictimRequest = {
        ...request,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVictimRequests([...victimRequests, newRequest]);
    };

    const addVolunteer = (volunteer: Omit<Volunteer, 'id' | 'createdAt'>) => {
      const newVolunteer: Volunteer = {
        ...volunteer,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setVolunteers([...volunteers, newVolunteer]);
    };

    const addDonation = (donation: Omit<Donation, 'id' | 'createdAt'>) => {
      const newDonation: Donation = {
        ...donation,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setDonations([...donations, newDonation]);

      if (donation.type === 'money') {
        setFundraisers(
          fundraisers.map((f) =>
            f.id === donation.fundraiserId
              ? { ...f, currentAmount: f.currentAmount + donation.amount }
              : f
          )
        );
      }
    };

    const addFundraiser = (fundraiser: Omit<Fundraiser, 'id' | 'createdAt' | 'currentAmount'>) => {
      const newFundraiser: Fundraiser = {
        ...fundraiser,
        id: Date.now().toString(),
        currentAmount: 0,
        createdAt: new Date().toISOString(),
      };
      setFundraisers([...fundraisers, newFundraiser]);
    };

    const addResource = (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newResource: Resource = {
        ...resource,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setResources([...resources, newResource]);
    };

    const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
      const newReport: Report = {
        ...report,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setReports([...reports, newReport]);
    };

    const addDisaster = (disaster: Omit<Disaster, 'id' | 'createdAt'>) => {
      const newDisaster: Disaster = {
        ...disaster,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setDisasters([...disasters, newDisaster]);
    };

    const addVolunteerCall = (call: Omit<VolunteerCall, 'id' | 'calledAt'>) => {
      const newCall: VolunteerCall = {
        ...call,
        id: Date.now().toString(),
        calledAt: new Date().toISOString(),
      };
      setVolunteerCalls([...volunteerCalls, newCall]);
    };

    const updateVictimRequest = (id: string, updates: Partial<VictimRequest>) => {
      setVictimRequests(
        victimRequests.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      );
    };

    const updateUser = (id: string, updates: Partial<User>) => {
      setUsers(users.map((u) => (u.id === id ? { ...u, ...updates } : u)));
      if (currentUser?.id === id) {
        setCurrentUser({ ...currentUser, ...updates });
      }
    };

    const updateFundraiser = (id: string, updates: Partial<Fundraiser>) => {
      setFundraisers(fundraisers.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    const updateResource = (id: string, updates: Partial<Resource>) => {
      setResources(
        resources.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      );
    };

    const updateDisaster = (id: string, updates: Partial<Disaster>) => {
      setDisasters(disasters.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    };

    const updateVolunteerCall = (id: string, updates: Partial<VolunteerCall>) => {
      setVolunteerCalls(volunteerCalls.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    };

    const allocateResource = (allocation: Omit<ResourceAllocation, 'id'>) => {
      const newAllocation: ResourceAllocation = {
        ...allocation,
        id: Date.now().toString(),
      };
      setResourceAllocations([...resourceAllocations, newAllocation]);

      setResources(
        resources.map((r) =>
          r.id === allocation.resourceId
            ? { ...r, quantity: r.quantity - allocation.quantity, updatedAt: new Date().toISOString() }
            : r
        )
      );
    };

    return (
      <AppContext.Provider
        value={{
          currentUser,
          users,
          victimRequests,
          volunteers,
          donations,
          fundraisers,
          resources,
          resourceAllocations,
          reports,
          disasters,
          volunteerCalls,
          login,
          register,
          logout,
          addVictimRequest,
          addVolunteer,
          addDonation,
          addFundraiser,
          addResource,
          addReport,
          addDisaster,
          addVolunteerCall,
          updateVictimRequest,
          updateUser,
          updateFundraiser,
          updateResource,
          updateDisaster,
          updateVolunteerCall,
          allocateResource,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  };

  export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useApp must be used within an AppProvider');
    }
    return context;
  };
