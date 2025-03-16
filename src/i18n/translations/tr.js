export default {
  header: {
    employees: 'Çalışanlar',
    addNew: 'Yeni Ekle',
    login: 'Giriş Yap',
  },
  login: {
    username: 'Kullanıcı Adı',
    usernamePlaceholder: 'Kullanıcı adınızı giriniz',
    password: 'Şifre',
    passwordPlaceholder: 'Şifrenizi giriniz',
  },
  common: {
    actions: {
      edit: 'Düzenle',
      delete: 'Sil',
      cancel: 'İptal',
      confirm: 'Onayla',
      proceed: 'Devam Et',
      save: 'Kaydet',
      close: 'Kapat',
      updating: 'Güncelleniyor...',
      adding: 'Ekliniyor...',
      updateEmployee: 'Çalışanı Güncelle',
      addEmployee: 'Çalışan Ekle',
    },
    messages: {
      confirmDelete: '{{name}} kaydını silmek istediğinizden emin misiniz?',
      confirmUpdate:
        'Çalışan bilgilerini güncellemek istediğinizden emin misiniz?',
      deleteSuccess: 'Çalışan başarıyla silindi',
      updateSuccess: 'Çalışan başarıyla güncellendi',
      createSuccess: 'Çalışan başarıyla oluşturuldu',
      required: 'Bu alan zorunludur',
      invalidFormat: 'Geçersiz format',
      areYouSure: 'Emin misiniz?',
    },
  },
  employeeList: {
    title: 'Çalışan Listesi',
    search: 'Çalışan ara...',
    noResults: 'Çalışan bulunamadı',
    description: 'Arama kriterlerinizi değiştirmeyi deneyin',
    viewMode: {
      table: 'Tablo Görünümü',
      grid: 'Kart Görünümü',
    },
    columns: {
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Başlama Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phone: 'Telefon Numarası',
      email: 'E-posta',
      department: 'Departman',
      position: 'Pozisyon',
      actions: 'İşlemler',
    },
    pagination: {
      previous: 'Önceki',
      next: 'Sonraki',
      showing:
        'Toplam {{total}} kayıttan {{start}} - {{end}} arası gösteriliyor',
    },
  },
  employeeForm: {
    titles: {
      create: 'Yeni Çalışan Ekle',
      edit: 'Çalışan Düzenle',
    },
    fields: {
      firstName: {
        label: 'Ad',
        placeholder: 'Ad giriniz',
      },
      lastName: {
        label: 'Soyad',
        placeholder: 'Soyad giriniz',
      },
      dateOfEmployment: {
        label: 'İşe Başlama Tarihi',
        placeholder: 'İşe başlama tarihi seçiniz',
      },
      dateOfBirth: {
        label: 'Doğum Tarihi',
        placeholder: 'Doğum tarihi seçiniz',
      },
      phone: {
        label: 'Telefon Numarası',
        placeholder: 'Telefon numarası giriniz',
      },
      email: {
        label: 'E-posta Adresi',
        placeholder: 'E-posta adresi giriniz',
      },
      department: {
        label: 'Departman',
        placeholder: 'Departman seçiniz',
      },
      position: {
        label: 'Pozisyon',
        placeholder: 'Pozisyon seçiniz',
      },
    },
  },
  departments: {
    analytics: 'Analitik',
    tech: 'Teknoloji',
  },
  positions: {
    junior: 'Junior',
    medior: 'Medior',
    senior: 'Senior',
  },
  validation: {
    required: 'Bu alan zorunludur',
    email: 'Geçerli bir e-posta adresi giriniz',
    phone: 'Geçerli bir telefon numarası giriniz',
    uniqueEmail: 'Bu e-posta adresi zaten kullanımda',
    date: 'Geçerli bir tarih giriniz',
    minLength: 'En az {{min}} karakter olmalıdır',
    maxLength: 'En fazla {{max}} karakter olmalıdır',
  },
};
