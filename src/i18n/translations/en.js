export default {
  header: {
    employees: 'Employees',
    addNew: 'Add New',
    login: 'Login',
  },
  login: {
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
  },
  common: {
    actions: {
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      proceed: 'Proceed',
      save: 'Save',
      close: 'Close',
      updating: 'Updating...',
      adding: 'Adding...',
      updateEmployee: 'Update Employee',
      addEmployee: 'Add Employee',
    },
    messages: {
      confirmDelete: 'Are you sure you want to delete {{name}}?',
      confirmUpdate:
        "Are you sure you want to update this employee's information?",
      deleteSuccess: 'Employee successfully deleted',
      updateSuccess: 'Employee successfully updated',
      createSuccess: 'Employee successfully created',
      required: 'This field is required',
      invalidFormat: 'Invalid format',
      areYouSure: 'Are you sure?',
    },
  },
  employeeList: {
    title: 'Employee List',
    search: 'Search employees...',
    noResults: 'No employees found',
    description: 'Try adjusting your search criteria',
    viewMode: {
      table: 'Table View',
      grid: 'Grid View',
    },
    columns: {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phone: 'Phone Number',
      email: 'Email',
      department: 'Department',
      position: 'Position',
      actions: 'Actions',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      showing: 'Showing {{start}} to {{end}} of {{total}} entries',
    },
  },
  employeeForm: {
    titles: {
      create: 'Add New Employee',
      edit: 'Edit Employee',
    },
    fields: {
      firstName: {
        label: 'First Name',
        placeholder: 'Enter first name',
      },
      lastName: {
        label: 'Last Name',
        placeholder: 'Enter last name',
      },
      dateOfEmployment: {
        label: 'Date of Employment',
        placeholder: 'Select date of employment',
      },
      dateOfBirth: {
        label: 'Date of Birth',
        placeholder: 'Select date of birth',
      },
      phone: {
        label: 'Phone Number',
        placeholder: 'Enter phone number',
      },
      email: {
        label: 'Email Address',
        placeholder: 'Enter email address',
      },
      department: {
        label: 'Department',
        placeholder: 'Select department',
      },
      position: {
        label: 'Position',
        placeholder: 'Select position',
      },
    },
  },
  departments: {
    analytics: 'Analytics',
    tech: 'Tech',
  },
  positions: {
    junior: 'Junior',
    medior: 'Medior',
    senior: 'Senior',
  },
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    uniqueEmail: 'This email is already in use',
    date: 'Please enter a valid date',
    minLength: 'Must be at least {{min}} characters',
    maxLength: 'Must be at most {{max}} characters',
  },
};
