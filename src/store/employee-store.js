import { createStore } from 'zustand/vanilla'

// Departman ve pozisyon sabitleri
export const DEPARTMENTS = {
  ANALYTICS: 'Analytics',
  TECH: 'Tech'
}

export const POSITIONS = {
  JUNIOR: 'Junior',
  MEDIOR: 'Medior',
  SENIOR: 'Senior'
}

// Gerçekçi veri üretimi için yardımcı listeler
const FIRST_NAMES = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Can', 'Ece', 'Deniz', 'Berk'];
const LAST_NAMES = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Özdemir', 'Arslan', 'Doğan', 'Aydın'];

// Rastgele tarih üretme fonksiyonu
const generateRandomDate = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
  return randomDate.toISOString().split('T')[0];
};

// Rastgele telefon numarası üretme
const generateRandomPhone = () => {
  const areaCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const firstPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const secondPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const thirdPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `+90 ${areaCode} ${firstPart} ${secondPart} ${thirdPart}`;
};

// Dummy veri oluşturma yardımcı fonksiyonu
const generateDummyEmployees = (count) => {
  return Array.from({ length: count }, (_, index) => {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const department = Object.values(DEPARTMENTS)[Math.floor(Math.random() * Object.values(DEPARTMENTS).length)];
    const position = Object.values(POSITIONS)[Math.floor(Math.random() * Object.values(POSITIONS).length)];
    
    return {
      id: index + 1,
      firstName,
      lastName,
      dateOfEmployment: generateRandomDate('2020-01-01', '2024-01-01'),
      dateOfBirth: generateRandomDate('1980-01-01', '2000-01-01'),
      phone: generateRandomPhone(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sourtimes.org`,
      department,
      position
    };
  });
};

export const employeeStore = createStore((set, get) => ({
  employees: generateDummyEmployees(100),
  currentPage: 1,
  itemsPerPage: 12,
  viewType: 'table',
  searchQuery: '',
  selectedEmployees: new window.Set(),

  setViewType: (type) => set({ viewType: type }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  toggleEmployeeSelection: (id) => 
    set(state => {
      const newSelected = new window.Set(state.selectedEmployees)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      return { selectedEmployees: newSelected }
    }),

  addEmployee: (employee) => {
    // Email benzersizlik kontrolü
    const state = get()
    const emailExists = state.employees.some(emp => emp.email === employee.email)
    if (emailExists) {
      throw new Error('Bu email adresi zaten kullanımda')
    }
    
    set((state) => ({ 
      employees: [...state.employees, { ...employee, id: state.employees.length + 1 }] 
    }))
  },

  updateEmployee: async (id, employeeData) => {
    const state = employeeStore.getState();
    const employees = [...state.employees];
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) {
      throw new Error('Employee not found');
    }

    // Email benzersizlik kontrolü (kendi emaili hariç)
    const emailExists = employees.some(emp => 
      emp.id !== id && emp.email === employeeData.email
    );
    
    if (emailExists) {
      throw new Error('Email already exists');
    }

    employees[index] = {
      ...employees[index],
      ...employeeData,
      updatedAt: new Date().toISOString()
    };

    employeeStore.setState({ employees });
  },

  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter(emp => emp.id !== id),
      selectedEmployees: new window.Set([...state.selectedEmployees].filter(empId => empId !== id))
    })),

  deleteSelectedEmployees: () =>
    set((state) => ({
      employees: state.employees.filter(emp => !state.selectedEmployees.has(emp.id)),
      selectedEmployees: new window.Set()
    })),

  getFilteredEmployees: () => {
    const state = get()
    let filtered = state.employees

    // Sadece ad ve soyada göre filtreleme
    if (state.searchQuery) {
      const searchLower = state.searchQuery.toLowerCase()
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchLower) || 
        emp.lastName.toLowerCase().includes(searchLower) ||
        // Tam ad araması için
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower)
      )
    }

    const start = (state.currentPage - 1) * state.itemsPerPage
    const end = start + state.itemsPerPage

    return {
      items: filtered.slice(start, end),
      total: filtered.length
    }
  }
}))