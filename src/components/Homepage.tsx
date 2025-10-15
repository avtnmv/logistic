import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSidebar } from '../contexts/SidebarContext';
import { useOrders } from '../contexts/OrderContext';
import '../css/left-sidebar.css';
import '../css/homepage.css';

const Homepage: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { createCargo, createTransport, loadMyCargos, loadMyTransports, myCargos, myTransports, deleteCargo, deleteTransport } = useOrders();
  const [activeForm, setActiveForm] = useState<'cards' | 'add-cargo' | 'add-transport'>('cards');


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const formParam = searchParams.get('form');
    
    if (formParam === 'cargo') {
      setActiveForm('add-cargo');

      setShowCargoDimensions(false);
      setShowTransportDimensions(false);
    } else if (formParam === 'transport') {
      setActiveForm('add-transport');

      setShowCargoDimensions(false);
      setShowTransportDimensions(false);
    } else {
      setActiveForm('cards');
    }
  }, [location.search]);
  const [loadingCountry, setLoadingCountry] = useState('');
  const [loadingRegion, setLoadingRegion] = useState('');
  const [loadingCity, setLoadingCity] = useState('');
  const [unloadingCountry, setUnloadingCountry] = useState('');
  const [unloadingRegion, setUnloadingRegion] = useState('');
  const [unloadingCity, setUnloadingCity] = useState('');
  const [showLoadingSuggestions, setShowLoadingSuggestions] = useState(false);
  const [showUnloadingSuggestions, setShowUnloadingSuggestions] = useState(false);
  const [showLoadingCountrySuggestions, setShowLoadingCountrySuggestions] = useState(false);
  const [showUnloadingCountrySuggestions, setShowUnloadingCountrySuggestions] = useState(false);
  const [showLoadingRegionSuggestions, setShowLoadingRegionSuggestions] = useState(false);
  const [showUnloadingRegionSuggestions, setShowUnloadingRegionSuggestions] = useState(false);
  const [showLoadingTypeDropdown, setShowLoadingTypeDropdown] = useState(false);
  const [showVehicleTypeDropdown, setShowVehicleTypeDropdown] = useState(false);
  const [showReloadTypeDropdown, setShowReloadTypeDropdown] = useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [showPaymentTermDropdown, setShowPaymentTermDropdown] = useState(false);
  const [showBargainDropdown, setShowBargainDropdown] = useState(false);
  const [showTransportCurrencyDropdown, setShowTransportCurrencyDropdown] = useState(false);
  const [showCargoTypeDropdown, setShowCargoTypeDropdown] = useState(false);
  

  const [loadingStartDate, setLoadingStartDate] = useState('');
  const [loadingEndDate, setLoadingEndDate] = useState('');
  const [dateError, setDateError] = useState('');

  const [showCargoDimensions, setShowCargoDimensions] = useState(false);
  

  const [showTransportDimensions, setShowTransportDimensions] = useState(false);
  

  const currentUser = useCurrentUser();
  

  const [selectedValues, setSelectedValues] = useState({
    loadingType: ['all'] as string[], // По умолчанию "Все загрузки"
    cargoType: [] as string[], // Массив для множественного выбора типов груза
    vehicleType: '',
    reloadType: '',
    paymentMethod: '',
    paymentTerm: '',
    bargain: ''
  });
  

  const [formData, setFormData] = useState({

    loadingStartDate: '',
    loadingEndDate: '',
    loadingCountry: '',
    loadingRegion: '',
    loadingCity: '',
    unloadingCountry: '',
    unloadingRegion: '',
    unloadingCity: '',
    

    cargoWeight: '',
    cargoVolume: '',
    vehicleCount: '',
    cargoLength: '',
    cargoWidth: '',
    cargoHeight: '',
    cargoPrice: '',
    cargoCurrency: 'USD',
    
    transportWeight: '',
    transportVolume: '',
    vehicleType: '',
    transportLength: '',
    transportWidth: '',
    transportHeight: '',
    transportPrice: '',
    transportCurrency: 'USD',
    
    additionalPhone: '',
    email: '',
    palletCount: '',
    loadingAddress: '',
    unloadingAddress: '',
    cargoNote: '',
    transportNote: '',
    additionalInfo: ''
  });
  
  const [showCard, setShowCard] = useState(false);
  const [currentCard, setCurrentCard] = useState<any>(null);

  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({});
  const [shakeFields, setShakeFields] = useState<{[key: string]: boolean}>({});
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const countriesDatabase = [
    { 
      name: 'Украина', 
      regions: [
        { name: 'Киевская область', cities: ['Киев', 'Бровары', 'Борисполь', 'Ирпень', 'Фастов'] },
        { name: 'Харьковская область', cities: ['Харьков', 'Изюм', 'Купянск', 'Лозовая', 'Чугуев'] },
        { name: 'Одесская область', cities: ['Одесса', 'Измаил', 'Белгород-Днестровский', 'Подольск', 'Южное'] },
        { name: 'Днепропетровская область', cities: ['Днепр', 'Кривой Рог', 'Никополь', 'Павлоград', 'Новомосковск'] },
        { name: 'Львовская область', cities: ['Львов', 'Дрогобыч', 'Стрый', 'Червоноград', 'Трускавец'] }
      ]
    },
    { 
      name: 'Россия', 
      regions: [
        { name: 'Московская область', cities: ['Москва', 'Подольск', 'Химки', 'Королев', 'Мытищи'] },
        { name: 'Ленинградская область', cities: ['Санкт-Петербург', 'Гатчина', 'Выборг', 'Тихвин', 'Кингисепп'] },
        { name: 'Кировская область', cities: ['Киров', 'Кирово-Чепецк', 'Вятские Поляны', 'Слободской', 'Котельнич'] },
        { name: 'Свердловская область', cities: ['Екатеринбург', 'Нижний Тагил', 'Каменск-Уральский', 'Первоуральск', 'Серов'] },
        { name: 'Краснодарский край', cities: ['Краснодар', 'Сочи', 'Новороссийск', 'Армавир', 'Ейск'] }
      ]
    },
    { 
      name: 'Молдова', 
      regions: [
        { name: 'Кишинев', cities: ['Кишинев', 'Вадул-луй-Водэ', 'Крикова', 'Дурлешты', 'Сынжера'] },
        { name: 'Бельцы', cities: ['Бельцы', 'Рыбница', 'Дрокия', 'Глодяны', 'Фалешты'] },
        { name: 'Тирасполь', cities: ['Тирасполь', 'Бендеры', 'Рыбница', 'Дубоссары', 'Григориополь'] }
      ]
    },
    { 
      name: 'Узбекистан', 
      regions: [
        { name: 'Ташкентская область', cities: ['Ташкент', 'Ангрен', 'Чирчик', 'Алмалык', 'Бекабад'] },
        { name: 'Самаркандская область', cities: ['Самарканд', 'Каттакурган', 'Ургут', 'Джамбай', 'Пайарык'] },
        { name: 'Бухарская область', cities: ['Бухара', 'Каган', 'Гиждуван', 'Ромитан', 'Шафиркан'] },
        { name: 'Ферганская область', cities: ['Фергана', 'Коканд', 'Маргилан', 'Кува', 'Кувасай'] },
        { name: 'Андижанская область', cities: ['Андижан', 'Асака', 'Ханабад', 'Шахрихан', 'Пайтуг'] }
      ]
    },
    { 
      name: 'Казахстан', 
      regions: [
        { name: 'Алматинская область', cities: ['Алматы', 'Талдыкорган', 'Капшагай', 'Текели', 'Есик'] },
        { name: 'Акмолинская область', cities: ['Нур-Султан', 'Кокшетау', 'Степногорск', 'Атбасар', 'Макинск'] },
        { name: 'Карагандинская область', cities: ['Караганда', 'Темиртау', 'Жезказган', 'Балхаш', 'Сарань'] },
        { name: 'Павлодарская область', cities: ['Павлодар', 'Экибастуз', 'Аксу', 'Щербакты', 'Успенка'] },
        { name: 'Восточно-Казахстанская область', cities: ['Усть-Каменогорск', 'Семей', 'Риддер', 'Аягоз', 'Зыряновск'] }
      ]
    },
    { 
      name: 'Беларусь', 
      regions: [
        { name: 'Минская область', cities: ['Минск', 'Борисов', 'Солигорск', 'Молодечно', 'Слуцк'] },
        { name: 'Гомельская область', cities: ['Гомель', 'Мозырь', 'Жлобин', 'Светлогорск', 'Речица'] },
        { name: 'Могилевская область', cities: ['Могилев', 'Бобруйск', 'Орша', 'Кричев', 'Горки'] },
        { name: 'Витебская область', cities: ['Витебск', 'Орша', 'Полоцк', 'Новополоцк', 'Лепель'] },
        { name: 'Гродненская область', cities: ['Гродно', 'Лида', 'Слоним', 'Волковыск', 'Новогрудок'] }
      ]
    }
  ];

  const citiesDatabase = [
    'Киев, Украина',
    'Кишинев, Молдова',
    'Киров, Россия',
    'Кировоград, Украина',
    'Москва, Россия',
    'Санкт-Петербург, Россия',
    'Ташкент, Узбекистан',
    'Самарканд, Узбекистан',
    'Бухара, Узбекистан',
    'Алматы, Казахстан',
    'Астана, Казахстан',
    'Минск, Беларусь',
    'Вильнюс, Литва',
    'Рига, Латвия',
    'Таллин, Эстония'
  ];

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) return '1 минуту назад';
      if (diffInMinutes < 5) return `${diffInMinutes} минуты назад`;
      return `${diffInMinutes} минут назад`;
    }
    
    if (diffInHours < 24) {
      if (diffInHours === 1) return '1 час назад';
      if (diffInHours < 5) return `${diffInHours} часа назад`;
      return `${diffInHours} часов назад`;
    }
    
    if (diffInDays < 7) {
      if (diffInDays === 1) return '1 день назад';
      if (diffInDays < 5) return `${diffInDays} дня назад`;
      return `${diffInDays} дней назад`;
    }
    
    return date.toLocaleDateString('ru-RU');
  };

  const calculateDistance = (city1: string, city2: string): number => {
    const distances: { [key: string]: { [key: string]: number } } = {
      'Кишинев': {
        'Кировоград': 850,
        'Киев': 650,
        'Москва': 1200,
        'Санкт-Петербург': 1800
      },
      'Кировоград': {
        'Кишинев': 850,
        'Киев': 250,
        'Москва': 800,
        'Санкт-Петербург': 1400
      },
      'Киев': {
        'Кишинев': 650,
        'Кировоград': 250,
        'Москва': 750,
        'Санкт-Петербург': 1350
      },
      'Москва': {
        'Кишинев': 1200,
        'Кировоград': 800,
        'Киев': 750,
        'Санкт-Петербург': 650
      }
    };

    if (distances[city1] && distances[city1][city2]) {
      return distances[city1][city2];
    }
    if (distances[city2] && distances[city2][city1]) {
      return distances[city2][city1];
    }

    return 500; 
  };

  const toggleCardExpanded = (cardId: string) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      setDeletingCardId(cardId);
      
      try {
        // Пытаемся удалить как груз
        let deleted = await deleteCargo(cardId);
        
        if (!deleted) {
          // Если не удалился как груз, пытаемся как транспорт
          deleted = await deleteTransport(cardId);
        }
        
        if (deleted) {
          console.log('✅ Заявка удалена успешно');
          // Перезагружаем данные
          await loadMyCargos();
          await loadMyTransports();
        } else {
          console.log('❌ Ошибка удаления заявки');
          alert('Ошибка удаления заявки');
        }
        
      } catch (error) {
        console.error('❌ Ошибка удаления заявки:', error);
        alert('Ошибка удаления заявки: ' + (error as Error).message);
      } finally {
        setTimeout(() => {
          setDeletingCardId(null);
          setActiveForm('cards');
        }, 300);
      }
    }
  };

  const getCargoTypeName = (value: string): string => {
    const cargoTypes: { [key: string]: string } = {
      'pallets': 'Груз на паллетах',
      'equipment': 'Оборудование',
      'construction': 'Стройматериалы',
      'metal': 'Металл',
      'metal-products': 'Металлопрокат',
      'pipes': 'Трубы',
      'food': 'Продукты',
      'big-bags': 'Груз в биг-бэгах',
      'container': 'Контейнер',
      'cement': 'Цемент',
      'bitumen': 'Битум',
      'fuel': 'ГСМ',
      'flour': 'Мука',
      'oversized': 'Негабарит',
      'cars': 'Автомобили',
      'lumber': 'Пиломатериалы',
      'concrete': 'Бетонные изделия',
      'furniture': 'Мебель',
      'tnp': 'ТНП'
    };
    return cargoTypes[value] || value;
  };

  // Функция для маппинга типов груза из формы в API типы
  const mapCargoTypeToAPI = (formType: string): 'GENERAL' | 'PALLETS' | 'BULK' | 'LIQUID' => {
    const typeMapping: { [key: string]: 'GENERAL' | 'PALLETS' | 'BULK' | 'LIQUID' } = {
      'pallets': 'PALLETS',
      'equipment': 'GENERAL',
      'construction': 'GENERAL',
      'metal': 'GENERAL',
      'metal-products': 'GENERAL',
      'pipes': 'GENERAL',
      'food': 'GENERAL',
      'big-bags': 'BULK',
      'container': 'GENERAL',
      'cement': 'BULK',
      'bitumen': 'LIQUID',
      'fuel': 'LIQUID',
      'flour': 'BULK',
      'oversized': 'GENERAL',
      'cars': 'GENERAL',
      'lumber': 'GENERAL',
      'concrete': 'GENERAL',
      'furniture': 'GENERAL',
      'tnp': 'GENERAL'
    };
    return typeMapping[formType] || 'GENERAL';
  };

  // Функция для отображения API типов груза
  const getAPICargoTypeDisplayName = (apiType: string): string => {
    const apiTypeMapping: { [key: string]: string } = {
      'GENERAL': 'Генеральный груз',
      'PALLETS': 'Груз на паллетах',
      'BULK': 'Насыпной груз',
      'LIQUID': 'Жидкий груз'
    };
    return apiTypeMapping[apiType] || apiType;
  };

  // Функция для извлечения детального типа груза из заметки
  const getDetailedCargoType = (note: string, apiCargoType: string): string => {
    const cargoTypeMatch = note.match(/\[CargoType:([^\]]+)\]/);
    if (cargoTypeMatch) {
      const detailedType = cargoTypeMatch[1];
      return getCargoTypeName(detailedType);
    }
    // Если детальный тип не найден, используем API тип
    return getAPICargoTypeDisplayName(apiCargoType);
  };

  const getVehicleTypeName = (value: string): string => {
    const vehicleTypes: { [key: string]: string } = {
      'tent': 'Тент',
      'isotherm': 'Изотерм',
      'refrigerator': 'Рефрижератор',
      'flatbed': 'Бортовой',
      'car-carrier': 'Автовоз',
      'platform': 'Платформа',
      'cement-truck': 'Цементовоз',
      'bitumen-truck': 'Битумовоз',
      'fuel-truck': 'Бензовоз',
      'flour-truck': 'Муковоз',
      'tow-truck': 'Эвакуатор',
      'timber-truck': 'Лесовоз',
      'grain-truck': 'Зерновоз',
      'trailer': 'Трал',
      'dump-truck': 'Самосвал',
      'container-truck': 'Контейнеровоз',
      'oversized-truck': 'Негабарит',
      'bus': 'Автобус',
      'gas-truck': 'Газовоз',
      'other-truck': 'Другой тип'
    };
    return vehicleTypes[value] || value;
  };

  const getReloadTypeName = (value: string): string => {
    const reloadTypes: { [key: string]: string } = {
      'no-reload': 'Без догрузки (отдельное авто)',
      'possible-reload': 'Возможна дозагрузка'
    };
    return reloadTypes[value] || value;
  };

  useEffect(() => {
    document.body.style.backgroundColor = '#F5F5F5';
    
    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/my-transports') {
      // Загружаем данные для страницы "Мои перевозки"
      console.log('🔄 Загружаем данные для "Мои перевозки"...');
      console.log('👤 Текущий пользователь:', currentUser);
      loadMyCargos();
      loadMyTransports();
      return;
    }

    if (location.pathname === '/homepage') {
      const params = new URLSearchParams(location.search);
      const formParam = params.get('form');
      if (formParam === 'add-cargo') {
        setActiveForm('add-cargo');
        setShowCargoDimensions(false);
        setShowTransportDimensions(false);
      } else if (formParam === 'add-transport') {
        setActiveForm('add-transport');
        setShowCargoDimensions(false);
        setShowTransportDimensions(false);
      }
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (currentUser?.id) {
      
      const allCards = JSON.parse(localStorage.getItem('transportCards') || '[]');
      const userCards = allCards.filter((card: any) => card.userId === currentUser.id);
      
      if (userCards.length > 0) {
        const storageKey = `transportCards_${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(userCards));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-dropdown')) {
        setShowLoadingTypeDropdown(false);
        setShowVehicleTypeDropdown(false);
        setShowReloadTypeDropdown(false);
        setShowPaymentMethodDropdown(false);
        setShowPaymentTermDropdown(false);
        setShowBargainDropdown(false);
        setShowTransportCurrencyDropdown(false);
      }
    };

    const anyDropdownOpen = showLoadingTypeDropdown || 
      showVehicleTypeDropdown || showReloadTypeDropdown || 
      showPaymentMethodDropdown || showPaymentTermDropdown || 
      showBargainDropdown || showTransportCurrencyDropdown;

    if (anyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoadingTypeDropdown, showVehicleTypeDropdown, 
      showReloadTypeDropdown, showPaymentMethodDropdown, showPaymentTermDropdown, 
      showBargainDropdown, showTransportCurrencyDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.form-field')) {
        setShowLoadingSuggestions(false);
        setShowUnloadingSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const filterCountries = (query: string) => {
    if (!query.trim()) return [];
    return countriesDatabase.filter(country => 
      country.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterRegions = (query: string, country: string) => {
    if (!query.trim() || !country) return [];
    const selectedCountry = countriesDatabase.find(c => c.name === country);
    if (!selectedCountry) return [];
    return selectedCountry.regions.filter(region => 
      region.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterCitiesByCountry = (query: string, country: string) => {
    if (!query.trim() || !country) return [];
    const selectedCountry = countriesDatabase.find(c => c.name === country);
    if (!selectedCountry) return [];
    
    const allCities = selectedCountry.regions.flatMap(region => region.cities);
    
    return allCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterCitiesByRegion = (query: string, country: string, region: string) => {
    if (!query.trim() || !country || !region) return [];
    const selectedCountry = countriesDatabase.find(c => c.name === country);
    if (!selectedCountry) return [];
    const selectedRegion = selectedCountry.regions.find(r => r.name === region);
    if (!selectedRegion) return [];
    return selectedRegion.cities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterCities = (query: string) => {
    if (!query.trim()) return [];
    return citiesDatabase.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleCountrySelect = (country: string, isLoading: boolean) => {
    if (isLoading) {
      setLoadingCountry(country);
      setFormData(prev => ({ ...prev, loadingCountry: country, loadingRegion: '', loadingCity: '' }));
      setLoadingRegion('');
      setLoadingCity('');
      setShowLoadingCountrySuggestions(false);
    } else {
      setUnloadingCountry(country);
      setFormData(prev => ({ ...prev, unloadingCountry: country, unloadingRegion: '', unloadingCity: '' }));
      setUnloadingRegion('');
      setUnloadingCity('');
      setShowUnloadingCountrySuggestions(false);
    }
  };

  const handleRegionSelect = (region: string, isLoading: boolean) => {
    if (isLoading) {
      setLoadingRegion(region);
      setFormData(prev => ({ ...prev, loadingRegion: region }));
      setShowLoadingRegionSuggestions(false);
    } else {
      setUnloadingRegion(region);
      setFormData(prev => ({ ...prev, unloadingRegion: region }));
      setShowUnloadingRegionSuggestions(false);
    }
  };

  const handleCitySelect = (city: string, isLoading: boolean) => {
    if (isLoading) {
      setLoadingCity(city);
      setFormData(prev => ({ ...prev, loadingCity: city }));
      setShowLoadingSuggestions(false);
    } else {
      setUnloadingCity(city);
      setFormData(prev => ({ ...prev, unloadingCity: city }));
      setShowUnloadingSuggestions(false);
    }
  };

  const handleLoadingCityChange = (value: string) => {
    setLoadingCity(value);
    setFormData(prev => ({ ...prev, loadingCity: value }));
    setShowLoadingSuggestions(value.length > 0);
    
    if (validationErrors.loadingCity) {
      setValidationErrors(prev => ({ ...prev, loadingCity: false }));
    }
  };

  const handleUnloadingCityChange = (value: string) => {
    setUnloadingCity(value);
    setFormData(prev => ({ ...prev, unloadingCity: value }));
    setShowUnloadingSuggestions(value.length > 0);
    
    if (validationErrors.unloadingCity) {
      setValidationErrors(prev => ({ ...prev, unloadingCity: false }));
    }
  };

  const handleClickOutside = () => {
    setShowLoadingSuggestions(false);
    setShowUnloadingSuggestions(false);
  };

  const handleSelectChange = (field: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleMultiSelectChange = (field: string, value: string) => {
    setSelectedValues(prev => {
      if (field === 'loadingType') {
        const currentValues = prev.loadingType;
        let newValues: string[];
        
        if (value === 'all') {
          newValues = ['all'];
        } else {
          const filteredValues = currentValues.filter(v => v !== 'all');
          
          if (filteredValues.includes(value)) {
            newValues = filteredValues.filter(v => v !== value);
          } else {
            newValues = [...filteredValues, value];
          }
          
          if (newValues.length === 0) {
            newValues = ['all'];
          }
        }
        
        return {
          ...prev,
          loadingType: newValues
        };
      }
      
      return prev;
    });
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const getLoadingTypeDisplayText = () => {
    if (selectedValues.loadingType.includes('all')) {
      return 'Все загрузки';
    }
    return selectedValues.loadingType.map(type => 
      type === 'back' ? 'Задняя' : 
      type === 'side' ? 'Боковая' : 
      type === 'top' ? 'Верхняя' : type
    ).join(', ');
  };

  const getCargoTypeDisplayText = () => {
    if (selectedValues.cargoType.length === 0) {
      return 'Выберите тип груза';
    }
    return getCargoTypeName(selectedValues.cargoType[0]);
  };

  const handleSingleCargoTypeChange = (value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      cargoType: [value] // Устанавливаем только один тип груза
    }));
    
    if (validationErrors.cargoType) {
      setValidationErrors(prev => ({ ...prev, cargoType: false }));
    }
  };

  const handleSingleSelectChange = (field: string, value: string) => {
    if (field === 'cargoType') {
      setSelectedValues(prev => ({
        ...prev,
        cargoType: [value]
      }));
      setShowCargoTypeDropdown(false);
      if (validationErrors.cargoType) {
        setValidationErrors(prev => ({ ...prev, cargoType: false }));
      }
    } else {
      setSelectedValues(prev => ({
        ...prev,
        [field]: value
      }));
      
      if (validationErrors[field]) {
        setValidationErrors(prev => ({ ...prev, [field]: false }));
      }
      
      switch (field) {
        case 'vehicleType':
          setShowVehicleTypeDropdown(false);
          break;
        case 'reloadType':
          setShowReloadTypeDropdown(false);
          break;
        case 'paymentMethod':
          setShowPaymentMethodDropdown(false);
          break;
        case 'paymentTerm':
          setShowPaymentTermDropdown(false);
          break;
        case 'bargain':
          setShowBargainDropdown(false);
          break;
      }
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    switch (field) {
    }
  };
  
  const validateDates = (startDate: string, endDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start < today) {
      setDateError('Дата начала загрузки не может быть раньше сегодняшнего дня');
      return false;
    }
    
    if (end < start) {
      setDateError('Дата окончания загрузки не может быть раньше даты начала');
      return false;
    }
    
    setDateError('');
    return true;
  };
  
  const handleStartDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, loadingStartDate: date }));
    if (formData.loadingEndDate && !validateDates(date, formData.loadingEndDate)) {
      setLoadingEndDate('');
      setFormData(prev => ({ ...prev, loadingEndDate: '' }));
    }
  };
  
  const handleEndDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, loadingEndDate: date }));
    if (formData.loadingStartDate) {
      validateDates(formData.loadingStartDate, date);
    }
  };

  const resetForm = () => {
    setFormData({
      loadingStartDate: '',
      loadingEndDate: '',
      loadingCountry: '',
      loadingRegion: '',
      loadingCity: '',
      unloadingCountry: '',
      unloadingRegion: '',
      unloadingCity: '',
      cargoWeight: '',
      cargoVolume: '',
      vehicleCount: '',
      cargoLength: '',
      cargoWidth: '',
      cargoHeight: '',
      cargoPrice: '',
      cargoCurrency: 'USD',
      transportWeight: '',
      transportVolume: '',
      vehicleType: '',
      transportLength: '',
      transportWidth: '',
      transportHeight: '',
      transportPrice: '',
      transportCurrency: 'USD',
      additionalPhone: '',
      email: '',
      palletCount: '',
      additionalInfo: '',
      loadingAddress: '',
      unloadingAddress: '',
      cargoNote: '',
      transportNote: ''
    });
    
    setSelectedValues({
      loadingType: ['all'],
      cargoType: [],
      vehicleType: '',
      reloadType: '',
      paymentMethod: '',
      paymentTerm: '',
      bargain: ''
    });
  };
  
  const validateCargoForm = () => {
    const errors: {[key: string]: boolean} = {};
    const requiredFields = [
      'loadingStartDate',
      'loadingEndDate', 
      'loadingCountry',
      'unloadingCountry',
      'cargoWeight',
      'cargoVolume'
    ];
    
    const hasLoadingCountry = formData.loadingCountry;
    const hasLoadingRegion = loadingRegion || formData.loadingRegion;
    const hasLoadingCity = loadingCity || formData.loadingCity;
    const hasUnloadingCountry = formData.unloadingCountry;
    const hasUnloadingRegion = unloadingRegion || formData.unloadingRegion;
    const hasUnloadingCity = unloadingCity || formData.unloadingCity;

    if (hasLoadingCountry && !hasLoadingRegion && !hasLoadingCity) {
      errors['loadingCity'] = true;
    }
    if (hasUnloadingCountry && !hasUnloadingRegion && !hasUnloadingCity) {
      errors['unloadingCity'] = true;
    }

    if (hasLoadingRegion && hasLoadingCountry) {
      delete errors['loadingCity'];
    }
    if (hasUnloadingRegion && hasUnloadingCountry) {
      delete errors['unloadingCity'];
    }
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        errors[field] = true;
      }
    }
    
    if (!selectedValues.loadingType || selectedValues.loadingType.length === 0) {
      errors['loadingType'] = true;
    }
    if (selectedValues.cargoType.length === 0) {
      errors['cargoType'] = true;
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setShakeFields(errors);
      setTimeout(() => setShakeFields({}), 600);
    }
    
    return Object.keys(errors).length === 0;
  };

  const validateTransportForm = () => {
    const errors: {[key: string]: boolean} = {};
    const requiredFields = [
      'loadingStartDate',
      'loadingEndDate',
      'loadingCountry',
      'unloadingCountry',
      'transportWeight',
      'transportVolume'
    ];
    
    const hasLoadingCountry = formData.loadingCountry;
    const hasLoadingRegion = loadingRegion || formData.loadingRegion;
    const hasLoadingCity = loadingCity || formData.loadingCity;
    const hasUnloadingCountry = formData.unloadingCountry;
    const hasUnloadingRegion = unloadingRegion || formData.unloadingRegion;
    const hasUnloadingCity = unloadingCity || formData.unloadingCity;
    
    if (hasLoadingCountry && !hasLoadingRegion && !hasLoadingCity) {
      errors['loadingCity'] = true;
    }
    if (hasUnloadingCountry && !hasUnloadingRegion && !hasUnloadingCity) {
      errors['unloadingCity'] = true;
    }
    
    if (hasLoadingRegion && hasLoadingCountry) {
      delete errors['loadingCity'];
    }
    if (hasUnloadingRegion && hasUnloadingCountry) {
      delete errors['unloadingCity'];
    }
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        errors[field] = true;
      }
    }
    
    if (!selectedValues.vehicleType) {
      errors['vehicleType'] = true;
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setShakeFields(errors);
      setTimeout(() => setShakeFields({}), 600);
    }
    
    return Object.keys(errors).length === 0;
  };


  const createCard = async (type: 'cargo' | 'transport') => {
    if (!currentUser || !currentUser.id) {
      alert('Пожалуйста, войдите в систему для создания заявки');
      return;
    }
    
    if (type === 'cargo' && !validateCargoForm()) {
      alert('Пожалуйста, заполните все обязательные поля для создания карточки груза');
      return;
    }
    
    if (type === 'transport' && !validateTransportForm()) {
      alert('Пожалуйста, заполните все обязательные поля для создания карточки транспорта');
      return;
    }

    try {
      if (type === 'cargo') {
        // Создаем груз через API
        const selectedCargoType = selectedValues.cargoType[0] || 'equipment';
        const apiCargoType = mapCargoTypeToAPI(selectedCargoType);
        
        console.log('🔍 Выбранный тип груза в форме:', selectedCargoType);
        console.log('🔍 Маппинг в API тип:', apiCargoType);
        console.log('🔍 selectedValues.cargoType:', selectedValues.cargoType);
        
        const cargoData = {
          date_from: formData.loadingStartDate || new Date().toISOString().split('T')[0],
          date_to: formData.loadingEndDate || new Date().toISOString().split('T')[0],
          country_from: formData.loadingCountry || 'Украина',
          country_to: formData.unloadingCountry || 'Польша',
          vehicle_type: 'ANY' as const,
          load_type: 'FULL' as const,
          cargo_type: apiCargoType,
          allow_partial_load: false,
          weight_t: (parseFloat(formData.cargoWeight) || 1).toString(),
          volume_m3: (parseFloat(formData.cargoVolume) || 1).toString(),
          cars_count: parseInt(formData.vehicleCount) || 1,
          pallets_count: 0,
          has_dimensions: !!(formData.cargoLength && formData.cargoWidth && formData.cargoHeight),
          length_m: formData.cargoLength ? parseFloat(formData.cargoLength).toString() : undefined,
          width_m: formData.cargoWidth ? parseFloat(formData.cargoWidth).toString() : undefined,
          height_m: formData.cargoHeight ? parseFloat(formData.cargoHeight).toString() : undefined,
          price_currency: (formData.cargoCurrency || 'USD') as 'USD' | 'EUR' | 'UAH' | 'PLN' | 'RUB',
          price_amount: (parseFloat(formData.cargoPrice) || 100).toString(),
          payment_method: 'BANK_TRANSFER' as const,
          payment_term: 'PREPAID' as const,
          bargain: 'ALLOWED' as const,
          contact_extra_phone: currentUser?.phone || '',
          note: `${formData.cargoNote || ''} [CargoType:${selectedCargoType}]`, // Сохраняем детальный тип в заметке
          points: [
            {
              type: 'PICKUP' as const,
              country: formData.loadingCountry || 'Украина',
              region: formData.loadingRegion || 'Киевская',
              city: formData.loadingCity || 'Киев',
              address: formData.loadingAddress || ''
            },
            {
              type: 'DROPOFF' as const,
              country: formData.unloadingCountry || 'Польша',
              region: formData.unloadingRegion || 'Мазовецкое',
              city: formData.unloadingCity || 'Варшава',
              address: formData.unloadingAddress || ''
            }
          ]
        };

        console.log('🚛 Создаем груз через API:', cargoData);
        const response = await createCargo(cargoData);
        console.log('📡 Ответ API:', response);
        
        if (response.status && response.data) {
          console.log('✅ Груз создан успешно:', response.data);
          alert('Груз успешно создан!');
          // Перезагружаем список грузов
          await loadMyCargos();
        } else {
          console.error('❌ Ошибка создания груза:', response);
          alert('Ошибка создания груза: ' + (response.message || 'Неизвестная ошибка'));
        }
      } else if (type === 'transport') {
        // Создаем транспорт через API
        const transportData = {
          date_from: formData.loadingStartDate || new Date().toISOString().split('T')[0],
          date_to: formData.loadingEndDate || new Date().toISOString().split('T')[0],
          country_from: formData.loadingCountry || 'Украина',
          country_to: formData.unloadingCountry || 'Польша',
          vehicle_type: (formData.vehicleType || 'ANY') as 'ANY' | 'TENT' | 'REFRIGERATOR' | 'VAN' | 'PLATFORM',
          cars_count: parseInt(formData.vehicleCount) || 1,
          weight_t: parseFloat(formData.transportWeight) || 10,
          volume_m3: parseFloat(formData.transportVolume) || 10,
          has_dimensions: !!(formData.cargoLength && formData.cargoWidth && formData.cargoHeight),
          length_m: formData.cargoLength ? parseFloat(formData.cargoLength) : undefined,
          width_m: formData.cargoWidth ? parseFloat(formData.cargoWidth) : undefined,
          height_m: formData.cargoHeight ? parseFloat(formData.cargoHeight) : undefined,
          price_currency: (formData.cargoCurrency || 'USD') as 'USD' | 'EUR' | 'UAH' | 'PLN' | 'RUB',
          price_amount: parseFloat(formData.cargoPrice) || 500,
          payment_method: 'BANK_TRANSFER' as const,
          payment_term: 'PREPAID' as const,
          bargain: 'ALLOWED' as const,
          contact_extra_phone: currentUser?.phone || '',
          note: formData.transportNote || '',
          points: [
            {
              type: 'DEPARTURE' as const,
              country: formData.loadingCountry || 'Украина',
              region: formData.loadingRegion || 'Киевская',
              city: formData.loadingCity || 'Киев',
              address: formData.loadingAddress || ''
            },
            {
              type: 'ARRIVAL' as const,
              country: formData.unloadingCountry || 'Польша',
              region: formData.unloadingRegion || 'Мазовецкое',
              city: formData.unloadingCity || 'Варшава',
              address: formData.unloadingAddress || ''
            }
          ]
        };

        console.log('🚚 Создаем транспорт через API:', transportData);
        const response = await createTransport(transportData);
        console.log('📡 Ответ API:', response);
        
        if (response.status && response.data) {
          console.log('✅ Транспорт создан успешно:', response.data);
          alert('Транспорт успешно создан!');
          // Перезагружаем список транспорта
          await loadMyTransports();
        } else {
          console.error('❌ Ошибка создания транспорта:', response);
          alert('Ошибка создания транспорта: ' + (response.message || 'Неизвестная ошибка'));
        }
      }
      
      // Очищаем форму и возвращаемся к карточкам
      setActiveForm('cards');
      resetForm();
      
    } catch (error: any) {
      console.error('❌ Ошибка создания заявки:', error);
      alert('Ошибка создания заявки: ' + (error.message || 'Неизвестная ошибка'));
    }
    setDateError('');
  };

  const renderContent = () => {
    switch (activeForm) {
              case 'add-cargo':
          return (
            <>
              <div className="homepage-form-header-block cargo-form-header">
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M12 22C11.1818 22 10.4002 21.6698 8.83693 21.0095C4.94564 19.3657 3 18.5438 3 17.1613C3 16.7742 3 10.0645 3 7M12 22C12.8182 22 13.5998 21.6698 15.1631 21.0095C19.0544 19.3657 21 18.5438 21 17.1613V7M12 22L12 11.3548" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 12L8 13" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 4L7 9" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Добавление заявки на перевозку груза</h2>
                  <p>Укажите, пожалуйста, пункты загрузки и выгрузки, параметры груза и контактную информацию.</p>
                </div>
              </div>
              
              <div className="homepage-form-container">
                <div className="homepage-form-content">
                <h3>Информация о грузе</h3>
                <p>Укажите как можно подробнее доступную информацию о грузе.</p>
                
                <div className="form-section">
                  <div className={`form-row ${validationErrors.loadingStartDate || validationErrors.loadingEndDate ? 'error' : ''}`}>
                    <div className="form-field">
                      <label>Дни загрузки</label>
                      <div className="date-range-input">
                        <input 
                          type="date" 
                          className={`form-input ${validationErrors.loadingStartDate ? 'error' : ''} ${shakeFields.loadingStartDate ? 'shake' : ''}`}
                          value={formData.loadingStartDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingStartDate: e.target.value }));
                            if (formData.loadingEndDate) {
                              validateDates(e.target.value, formData.loadingEndDate);
                            }
                            // Очищаем ошибку для этого поля
                            if (validationErrors.loadingStartDate) {
                              setValidationErrors(prev => ({ ...prev, loadingStartDate: false }));
                            }
                          }}
                        />
                        <span>-</span>
                        <input 
                          type="date" 
                          className={`form-input ${validationErrors.loadingEndDate ? 'error' : ''} ${shakeFields.loadingEndDate ? 'shake' : ''}`}
                          value={formData.loadingEndDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingEndDate: e.target.value }));
                            if (formData.loadingStartDate) {
                              validateDates(formData.loadingStartDate, e.target.value);
                            }
                            if (validationErrors.loadingEndDate) {
                              setValidationErrors(prev => ({ ...prev, loadingEndDate: false }));
                            }
                          }}
                        />
                      </div>
                      {dateError && <div className="error-message">{dateError}</div>}
                      {(validationErrors.loadingStartDate || validationErrors.loadingEndDate) && (
                        <div className="error-message">Пожалуйста, укажите даты загрузки</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.loadingCountry ? 'error' : ''}`}>
                      <label>Страна загрузки</label>
                      <input 
                        type="text" 
                        className={`form-input ${validationErrors.loadingCountry ? 'error' : ''} ${shakeFields.loadingCountry ? 'shake' : ''}`}
                        placeholder="Начните вводить страну" 
                        value={loadingCountry}
                        onChange={(e) => {
                          setLoadingCountry(e.target.value);
                          setFormData(prev => ({ ...prev, loadingCountry: e.target.value }));
                          setShowLoadingCountrySuggestions(e.target.value.length > 0);
                          if (validationErrors.loadingCountry) {
                            setValidationErrors(prev => ({ ...prev, loadingCountry: false }));
                          }
                        }}
                        onFocus={() => setShowLoadingCountrySuggestions(loadingCountry.length > 0)}
                      />
                      {validationErrors.loadingCountry && (
                        <div className="error-message">Пожалуйста, выберите страну загрузки</div>
                      )}
                      {showLoadingCountrySuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCountries(loadingCountry).map((country, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCountrySelect(country.name, true)}
                            >
                              {country.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`form-field ${validationErrors.unloadingCountry ? 'error' : ''}`}>
                      <label>Страна выгрузки</label>
                      <input 
                        type="text" 
                        className={`form-input ${validationErrors.unloadingCountry ? 'error' : ''} ${shakeFields.unloadingCountry ? 'shake' : ''}`}
                        placeholder="Начните вводить страну" 
                        value={unloadingCountry}
                        onChange={(e) => {
                          setUnloadingCountry(e.target.value);
                          setFormData(prev => ({ ...prev, unloadingCountry: e.target.value }));
                          setShowUnloadingCountrySuggestions(e.target.value.length > 0);
                          if (validationErrors.unloadingCountry) {
                            setValidationErrors(prev => ({ ...prev, unloadingCountry: false }));
                          }
                        }}
                        onFocus={() => setShowUnloadingCountrySuggestions(unloadingCountry.length > 0)}
                      />
                      {validationErrors.unloadingCountry && (
                        <div className="error-message">Пожалуйста, выберите страну выгрузки</div>
                      )}
                      {showUnloadingCountrySuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCountries(unloadingCountry).map((country, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCountrySelect(country.name, false)}
                            >
                              {country.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Область загрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить область" 
                        value={loadingRegion}
                        onChange={(e) => {
                          setLoadingRegion(e.target.value);
                          setFormData(prev => ({ ...prev, loadingRegion: e.target.value }));
                          setShowLoadingRegionSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowLoadingRegionSuggestions(loadingRegion.length > 0)}
                        disabled={!loadingCountry}
                      />
                      {showLoadingRegionSuggestions && loadingCountry && (
                        <div className="autocomplete-suggestions">
                          {filterRegions(loadingRegion, loadingCountry).map((region, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleRegionSelect(region.name, true)}
                            >
                              {region.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Область выгрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить область" 
                        value={unloadingRegion}
                        onChange={(e) => {
                          setUnloadingRegion(e.target.value);
                          setFormData(prev => ({ ...prev, unloadingRegion: e.target.value }));
                          setShowUnloadingRegionSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowUnloadingRegionSuggestions(unloadingRegion.length > 0)}
                        disabled={!unloadingCountry}
                      />
                      {showUnloadingRegionSuggestions && unloadingCountry && (
                        <div className="autocomplete-suggestions">
                          {filterRegions(unloadingRegion, unloadingCountry).map((region, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleRegionSelect(region.name, false)}
                            >
                              {region.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.loadingCity ? 'error' : ''}`}>
                      <label>Город загрузки</label>
                      <input 
                        type="text" 
                        className={`form-input ${validationErrors.loadingCity ? 'error' : ''} ${shakeFields.loadingCity ? 'shake' : ''}`}
                        placeholder="Начните вводить город" 
                        value={loadingCity}
                        onChange={(e) => {
                          setLoadingCity(e.target.value);
                          setFormData(prev => ({ ...prev, loadingCity: e.target.value }));
                          setShowLoadingSuggestions(e.target.value.length > 0);
                          if (validationErrors.loadingCity) {
                            setValidationErrors(prev => ({ ...prev, loadingCity: false }));
                          }
                        }}
                        onFocus={() => setShowLoadingSuggestions(loadingCity.length > 0)}
                        disabled={!loadingCountry}
                      />
                      {validationErrors.loadingCity && (
                        <div className="error-message">Пожалуйста, выберите город загрузки</div>
                      )}
                      {showLoadingSuggestions && loadingCountry && (
                        <div className="autocomplete-suggestions">
                          {(loadingRegion ? 
                            filterCitiesByRegion(loadingCity, loadingCountry, loadingRegion) :
                            filterCitiesByCountry(loadingCity, loadingCountry)
                          ).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, true)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`form-field ${validationErrors.unloadingCity ? 'error' : ''}`}>
                      <label>Город выгрузки</label>
                      <input 
                        type="text" 
                        className={`form-input ${validationErrors.unloadingCity ? 'error' : ''} ${shakeFields.unloadingCity ? 'shake' : ''}`}
                        placeholder="Начните вводить город" 
                        value={unloadingCity}
                        onChange={(e) => {
                          setUnloadingCity(e.target.value);
                          setFormData(prev => ({ ...prev, unloadingCity: e.target.value }));
                          setShowUnloadingSuggestions(e.target.value.length > 0);
                          if (validationErrors.unloadingCity) {
                            setValidationErrors(prev => ({ ...prev, unloadingCity: false }));
                          }
                        }}
                        onFocus={() => setShowUnloadingSuggestions(unloadingCity.length > 0)}
                        disabled={!unloadingCountry}
                      />
                      {validationErrors.unloadingCity && (
                        <div className="error-message">Пожалуйста, выберите город выгрузки</div>
                      )}
                      {showUnloadingSuggestions && unloadingCountry && (
                        <div className="autocomplete-suggestions">
                          {(unloadingRegion ? 
                            filterCitiesByRegion(unloadingCity, unloadingCountry, unloadingRegion) :
                            filterCitiesByCountry(unloadingCity, unloadingCountry)
                          ).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, false)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место загрузки</button>
                    </div>
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место выгрузки</button>
                    </div>
                  </div>
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Тип автомобиля</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.vehicleType ? 'has-value' : ''}`}
                          onClick={() => setShowVehicleTypeDropdown(!showVehicleTypeDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.vehicleType ? getVehicleTypeName(selectedValues.vehicleType) : 'Выберите тип'}
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showVehicleTypeDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showVehicleTypeDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'tent')}>
                              <span>Тент</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'isotherm')}>
                              <span>Изотерм</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'refrigerator')}>
                              <span>Рефрижератор</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'flatbed')}>
                              <span>Бортовой</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'car-carrier')}>
                              <span>Автовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'platform')}>
                              <span>Платформа</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'cement-truck')}>
                              <span>Цементовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'bitumen-truck')}>
                              <span>Битумовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'fuel-truck')}>
                              <span>Бензовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'flour-truck')}>
                              <span>Муковоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'tow-truck')}>
                              <span>Эвакуатор</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'timber-truck')}>
                              <span>Лесовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'grain-truck')}>
                              <span>Зерновоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'trailer')}>
                              <span>Трал</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'dump-truck')}>
                              <span>Самосвал</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'container-truck')}>
                              <span>Контейнеровоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'oversized-truck')}>
                              <span>Негабарит</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'bus')}>
                              <span>Автобус</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'gas-truck')}>
                              <span>Газовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'other-truck')}>
                              <span>Другой тип</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`form-field ${validationErrors.loadingType ? 'error' : ''}`}>
                      <label>Тип загрузки</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.loadingType.length > 0 ? 'has-value' : ''} ${validationErrors.loadingType ? 'error' : ''}`}
                          onClick={() => setShowLoadingTypeDropdown(!showLoadingTypeDropdown)}
                        >
                          <span className="dropdown-text">
                            {getLoadingTypeDisplayText()}
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showLoadingTypeDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showLoadingTypeDropdown && (
                          <div className="dropdown-menu">
                            <label className="dropdown-option">
                              <input 
                                type="checkbox" 
                                checked={selectedValues.loadingType.includes('all')}
                                onChange={() => handleMultiSelectChange('loadingType', 'all')}
                              />
                              <span>Все загрузки</span>
                            </label>
                            <label className="dropdown-option">
                              <input 
                                type="checkbox" 
                                checked={selectedValues.loadingType.includes('back')}
                                onChange={() => handleMultiSelectChange('loadingType', 'back')}
                              />
                              <span>Задняя</span>
                            </label>
                            <label className="dropdown-option">
                              <input 
                                type="checkbox" 
                                checked={selectedValues.loadingType.includes('side')}
                                onChange={() => handleMultiSelectChange('loadingType', 'side')}
                              />
                              <span>Боковая</span>
                            </label>
                            <label className="dropdown-option">
                              <input 
                                type="checkbox" 
                                checked={selectedValues.loadingType.includes('top')}
                                onChange={() => handleMultiSelectChange('loadingType', 'top')}
                              />
                              <span>Верхняя</span>
                            </label>
                          </div>
                        )}
                      </div>
                      {validationErrors.loadingType && (
                        <div className="error-message">Пожалуйста, выберите тип загрузки</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.cargoType ? 'error' : ''}`}>
                      <label>Тип груза</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.cargoType[0] ? 'has-value' : ''} ${validationErrors.cargoType ? 'error' : ''}`}
                          onClick={() => setShowCargoTypeDropdown(!showCargoTypeDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.cargoType[0] ? getCargoTypeDisplayText() : 'Выберите тип груза'}
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showCargoTypeDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showCargoTypeDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'pallets')}>
                              <span>Груз на паллетах</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'equipment')}>
                              <span>Оборудование</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'construction')}>
                              <span>Стройматериалы</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'metal')}>
                              <span>Металл</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'metal-products')}>
                              <span>Металлопрокат</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'pipes')}>
                              <span>Трубы</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'food')}>
                              <span>Продукты</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'big-bags')}>
                              <span>Груз в биг-бэгах</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'container')}>
                              <span>Контейнер</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'cement')}>
                              <span>Цемент</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'bitumen')}>
                              <span>Битум</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'fuel')}>
                              <span>ГСМ</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'flour')}>
                              <span>Мука</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'oversized')}>
                              <span>Негабарит</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'cars')}>
                              <span>Автомобили</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'lumber')}>
                              <span>Пиломатериалы</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'concrete')}>
                              <span>Бетонные изделия</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'furniture')}>
                              <span>Мебель</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('cargoType', 'tnp')}>
                              <span>ТНП</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {validationErrors.cargoType && (
                        <div className="error-message">Пожалуйста, выберите тип груза</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Возможность дозагрузки</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.reloadType ? 'has-value' : ''}`}
                          onClick={() => setShowReloadTypeDropdown(!showReloadTypeDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.reloadType ? 
                              (selectedValues.reloadType === 'no-reload' ? 'Без догрузки (отдельное авто)' : 'Возможна дозагрузка') : 
                              'Возможность дозагрузки'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showReloadTypeDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                    </div>
                        {showReloadTypeDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('reloadType', 'no-reload')}>
                              <span>Без догрузки (отдельное авто)</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('reloadType', 'possible-reload')}>
                              <span>Возможна дозагрузка</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.cargoWeight ? 'error' : ''}`}>
                      <label>Вес груза</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.cargoWeight ? 'error' : ''} ${shakeFields.cargoWeight ? 'shake' : ''}`}
                        placeholder="тн" 
                        value={formData.cargoWeight}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, cargoWeight: e.target.value }));
                          if (validationErrors.cargoWeight) {
                            setValidationErrors(prev => ({ ...prev, cargoWeight: false }));
                          }
                        }}
                      />
                      {validationErrors.cargoWeight && (
                        <div className="error-message">Пожалуйста, укажите вес груза</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Количество автомобилей</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="шт" 
                        value={formData.vehicleCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicleCount: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.cargoVolume ? 'error' : ''}`}>
                      <label>Объем груза</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.cargoVolume ? 'error' : ''} ${shakeFields.cargoVolume ? 'shake' : ''}`}
                        placeholder="м³" 
                        value={formData.cargoVolume}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, cargoVolume: e.target.value }));
                          if (validationErrors.cargoVolume) {
                            setValidationErrors(prev => ({ ...prev, cargoVolume: false }));
                          }
                        }}
                      />
                      {validationErrors.cargoVolume && (
                        <div className="error-message">Пожалуйста, укажите объем груза</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Количество паллет</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="шт" 
                        value={formData.palletCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, palletCount: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Указать габариты груза</label>
                      <div 
                        className={`dimensions-trigger ${showCargoDimensions ? 'active' : ''}`}
                        onClick={() => setShowCargoDimensions(!showCargoDimensions)}
                      >
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ввести длину, ширину и высоту" 
                          readOnly
                        />
                        <div className="dimensions-icon">
                          <div className="dimensions-circle"></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-field">
                     
                    </div>
                  </div>
                  
                  {showCargoDimensions && (
                    <div className="form-row dimensions-row">
                      <div className="form-field">
                        <label>Длина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите длину в метрах" 
                          value={formData.cargoLength}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoLength: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Ширина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите ширину в метрах" 
                          value={formData.cargoWidth}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoWidth: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Высота груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите высоту в метрах" 
                          value={formData.cargoHeight}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoHeight: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Стоимость</label>
                      <div className="currency-input">
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="0" 
                          value={formData.cargoPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoPrice: e.target.value }))}
                        />
                        <select 
                          className="currency-select"
                          value={formData.cargoCurrency}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoCurrency: e.target.value }))}
                        >
                          <option value="USD">USD</option>
                          <option value="RUB">RUB</option>
                          <option value="UZS">UZS</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Метод оплаты</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.paymentMethod ? 'has-value' : ''}`}
                          onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.paymentMethod ? 
                              (selectedValues.paymentMethod === 'cashless' ? 'Наличные' : 
                               selectedValues.paymentMethod === 'card' ? 'На карту' : 'Комбинированный') : 
                              'Выберите метод оплаты'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showPaymentMethodDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showPaymentMethodDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentMethod', 'cashless')}>
                              <span>Наличные</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentMethod', 'card')}>
                              <span>На карту</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentMethod', 'combined')}>
                              <span>Комбинированный</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Срок оплаты</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.paymentTerm ? 'has-value' : ''}`}
                          onClick={() => setShowPaymentTermDropdown(!showPaymentTermDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.paymentTerm ? 
                              (selectedValues.paymentTerm === 'unloading' ? 'При разгрузке' : 
                               selectedValues.paymentTerm === 'prepayment' ? 'Предоплата' : 'Отсрочка платежа') : 
                              'Выберите срок оплаты'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showPaymentTermDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showPaymentTermDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentTerm', 'unloading')}>
                              <span>При разгрузке</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentTerm', 'prepayment')}>
                              <span>Предоплата</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentTerm', 'deferred')}>
                              <span>Отсрочка платежа</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Торг</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.bargain ? 'has-value' : ''}`}
                          onClick={() => setShowBargainDropdown(!showBargainDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.bargain ? 
                              (selectedValues.bargain === 'yes' ? 'Возможен' : 'Без торга') : 
                              'Возможность торга'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showBargainDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                    </div>
                        {showBargainDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('bargain', 'yes')}>
                              <span>Возможен</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('bargain', 'no')}>
                              <span>Без торга</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                  <hr className="form-divider" />
                </div>
                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <h3>Выберите контакты, которые будут видны в заказе</h3>
                  <p>Здесь отображаются доступные контакты, добавленные вами в разделе "Профиль". Вы можете изменить или добавить их в личном кабинете.</p>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Основной телефон</label>
                      <input type="tel" className="form-input" value={currentUser?.phone || ''} readOnly />
                    </div>
                    <div className="form-field">
                      <label>Дополнительный телефон</label>
                      <input type="tel" className="form-input" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>E-mail</label>
                      <input type="email" className="form-input" placeholder="example@email.com" />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                </div>
                

                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <div className="form-row">
                    <div className="form-field" style={{ width: '100%' }}>
                      <label>Дополнительная информация</label>
                      <textarea 
                        className="form-input" 
                        rows={4} 
                        placeholder="Введите дополнительную информацию..." 
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <button className="submit-cargo-btn" onClick={() => createCard('cargo')}>
                    Добавить груз
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'add-transport':
        return (
          <>
            <div className="homepage-form-header-block transport-form-header">
              <div className="homepage-form-header-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                  <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 17h4M13.5 7h.943c1.31 0 1.966 0 2.521.315.556.314.926.895 1.667 2.056.52.814 1.064 1.406 1.831 1.931.772.53 1.14.789 1.343 1.204.195.398.195.869.195 1.811 0 1.243 0 1.864-.349 2.259l-.046.049c-.367.375-.946.375-2.102.375H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m13 7 .994 2.486c.487 1.217.73 1.826 1.239 2.17.508.344 1.163.344 2.475.344H21M4.87 17c-1.353 0-2.03 0-2.45-.44C2 16.122 2 15.415 2 14V7c0-1.414 0-2.121.42-2.56S3.517 4 4.87 4h5.26c1.353 0 2.03 0 2.45.44C13 4.878 13 5.585 13 7v10H8.696" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="homepage-form-header-content">
                <h2>Добавление заявки на перевозку транспорта</h2>
                <p>Укажите, пожалуйста, пункты загрузки и выгрузки, параметры автомобиля и контактную информацию.</p>
              </div>
            </div>
            
            <div className="homepage-form-container">
              <div className="homepage-form-content">
                <h3>Информация о транспорте</h3>
                <p>Укажите как можно подробнее доступную информацию о транспорте.</p>
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Дни загрузки</label>
                      <div className="date-range-input">
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.loadingStartDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingStartDate: e.target.value }));
                            if (formData.loadingEndDate) {
                              validateDates(e.target.value, formData.loadingEndDate);
                            }
                          }}
                        />
                        <span>-</span>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.loadingEndDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingEndDate: e.target.value }));
                            if (formData.loadingStartDate) {
                              validateDates(formData.loadingStartDate, e.target.value);
                            }
                          }}
                        />
                      </div>
                      {dateError && <div className="error-message">{dateError}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Страна загрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название страны" 
                        value={loadingCountry}
                        onChange={(e) => {
                          setLoadingCountry(e.target.value);
                          setFormData(prev => ({ ...prev, loadingCountry: e.target.value }));
                          setShowLoadingCountrySuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowLoadingCountrySuggestions(loadingCountry.length > 0)}
                      />
                      {showLoadingCountrySuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCountries(loadingCountry).map((country, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCountrySelect(country.name, true)}
                            >
                              {country.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Страна выгрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название страны" 
                        value={unloadingCountry}
                        onChange={(e) => {
                          setUnloadingCountry(e.target.value);
                          setFormData(prev => ({ ...prev, unloadingCountry: e.target.value }));
                          setShowUnloadingCountrySuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowUnloadingCountrySuggestions(unloadingCountry.length > 0)}
                      />
                      {showUnloadingCountrySuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCountries(unloadingCountry).map((country, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCountrySelect(country.name, false)}
                            >
                              {country.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Область загрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название области" 
                        value={loadingRegion}
                        onChange={(e) => {
                          setLoadingRegion(e.target.value);
                          setFormData(prev => ({ ...prev, loadingRegion: e.target.value }));
                          setShowLoadingRegionSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowLoadingRegionSuggestions(loadingRegion.length > 0)}
                        disabled={!loadingCountry}
                      />
                      {showLoadingRegionSuggestions && loadingCountry && (
                        <div className="autocomplete-suggestions">
                          {filterRegions(loadingRegion, loadingCountry).map((region, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleRegionSelect(region.name, true)}
                            >
                              {region.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Область выгрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название области" 
                        value={unloadingRegion}
                        onChange={(e) => {
                          setUnloadingRegion(e.target.value);
                          setFormData(prev => ({ ...prev, unloadingRegion: e.target.value }));
                          setShowUnloadingRegionSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowUnloadingRegionSuggestions(unloadingRegion.length > 0)}
                        disabled={!unloadingCountry}
                      />
                      {showUnloadingRegionSuggestions && unloadingCountry && (
                        <div className="autocomplete-suggestions">
                          {filterRegions(unloadingRegion, unloadingCountry).map((region, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleRegionSelect(region.name, false)}
                            >
                              {region.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Город загрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название города" 
                        value={loadingCity}
                        onChange={(e) => {
                          setLoadingCity(e.target.value);
                          setFormData(prev => ({ ...prev, loadingCity: e.target.value }));
                          setShowLoadingSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowLoadingSuggestions(loadingCity.length > 0)}
                        disabled={!loadingCountry}
                      />
                      {showLoadingSuggestions && loadingCountry && (
                        <div className="autocomplete-suggestions">
                          {loadingRegion ? 
                            filterCitiesByRegion(loadingCity, loadingCountry, loadingRegion).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, true)}
                            >
                              {city}
                              </div>
                            )) :
                            filterCitiesByCountry(loadingCity, loadingCountry).map((city, index) => (
                              <div 
                                key={index} 
                                className="suggestion-item"
                                onClick={() => handleCitySelect(city, true)}
                              >
                                {city}
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Город выгрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название города" 
                        value={unloadingCity}
                        onChange={(e) => {
                          setUnloadingCity(e.target.value);
                          setFormData(prev => ({ ...prev, unloadingCity: e.target.value }));
                          setShowUnloadingSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowUnloadingSuggestions(unloadingCity.length > 0)}
                        disabled={!unloadingCountry}
                      />
                      {showUnloadingSuggestions && unloadingCountry && (
                        <div className="autocomplete-suggestions">
                          {unloadingRegion ? 
                            filterCitiesByRegion(unloadingCity, unloadingCountry, unloadingRegion).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, false)}
                            >
                              {city}
                            </div>
                            )) :
                            filterCitiesByCountry(unloadingCity, unloadingCountry).map((city, index) => (
                              <div 
                                key={index} 
                                className="suggestion-item"
                                onClick={() => handleCitySelect(city, false)}
                              >
                                {city}
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место загрузки</button>
                    </div>
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место выгрузки</button>
                    </div>
                  </div>
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.vehicleType ? 'error' : ''}`}>
                      <label>Тип автомобиля</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.vehicleType ? 'has-value' : ''} ${validationErrors.vehicleType ? 'error' : ''}`}
                          onClick={() => setShowVehicleTypeDropdown(!showVehicleTypeDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.vehicleType ? getVehicleTypeName(selectedValues.vehicleType) : 'Выберите тип'}
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showVehicleTypeDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showVehicleTypeDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'tent')}>
                              <span>Тент</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'isotherm')}>
                              <span>Изотерм</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'refrigerator')}>
                              <span>Рефрижератор</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'flatbed')}>
                              <span>Бортовой</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'car-carrier')}>
                              <span>Автовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'platform')}>
                              <span>Платформа</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'cement-truck')}>
                              <span>Цементовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'bitumen-truck')}>
                              <span>Битумовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'fuel-truck')}>
                              <span>Бензовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'flour-truck')}>
                              <span>Муковоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'tow-truck')}>
                              <span>Эвакуатор</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'timber-truck')}>
                              <span>Лесовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'grain-truck')}>
                              <span>Зерновоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'trailer')}>
                              <span>Трал</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'dump-truck')}>
                              <span>Самосвал</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'container-truck')}>
                              <span>Контейнеровоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'oversized-truck')}>
                              <span>Негабарит</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'bus')}>
                              <span>Автобус</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'gas-truck')}>
                              <span>Газовоз</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('vehicleType', 'other-truck')}>
                              <span>Другой тип</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {validationErrors.vehicleType && (
                        <div className="error-message">Пожалуйста, выберите тип автомобиля</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Количество автомобилей</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Укажите количество" 
                        value={formData.vehicleCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicleCount: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.transportWeight ? 'error' : ''}`}>
                      <label>Масса (т)</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.transportWeight ? 'error' : ''} ${shakeFields.transportWeight ? 'shake' : ''}`}
                        placeholder="Укажите вес" 
                        value={formData.transportWeight}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, transportWeight: e.target.value }));
                          if (validationErrors.transportWeight) {
                            setValidationErrors(prev => ({ ...prev, transportWeight: false }));
                          }
                        }}
                      />
                      {validationErrors.transportWeight && (
                        <div className="error-message">Пожалуйста, укажите массу транспорта</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Указать габариты авто</label>
                      <div className="dimensions-trigger" onClick={() => setShowTransportDimensions(!showTransportDimensions)}>
                        <input 
                          type="text" 
                          className={`form-input ${showTransportDimensions ? 'active' : ''}`}
                          placeholder="Ввести длину, ширину и высоту"
                          readOnly
                        />
                        <div className="dimensions-icon">
                          <div className={`dimensions-circle ${showTransportDimensions ? 'active' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {showTransportDimensions && (
                    <div className="form-row dimensions-row">
                      <div className="form-field">
                        <label>Длина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите длину в метрах" 
                          value={formData.transportLength}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportLength: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Ширина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите ширину в метрах" 
                          value={formData.transportWidth}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportWidth: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Высота груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите высоту в метрах" 
                          value={formData.transportHeight}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportHeight: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.transportVolume ? 'error' : ''}`}>
                      <label>Объём (м³)</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.transportVolume ? 'error' : ''} ${shakeFields.transportVolume ? 'shake' : ''}`}
                        placeholder="Укажите объём" 
                        value={formData.transportVolume}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, transportVolume: e.target.value }));
                          if (validationErrors.transportVolume) {
                            setValidationErrors(prev => ({ ...prev, transportVolume: false }));
                          }
                        }}
                      />
                      {validationErrors.transportVolume && (
                        <div className="error-message">Пожалуйста, укажите объём транспорта</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Метод оплаты</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.paymentMethod ? 'has-value' : ''}`}
                          onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.paymentMethod ? 
                              (selectedValues.paymentMethod === 'cashless' ? 'Наличные' : 
                               selectedValues.paymentMethod === 'card' ? 'На карту' : 'Комбинированный') : 
                              'Выберите метод оплаты'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showPaymentMethodDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                      </div>
                        {showPaymentMethodDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentMethod', 'cashless')}>
                              <span>Наличные</span>
                    </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentMethod', 'card')}>
                              <span>На карту</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentMethod', 'combined')}>
                              <span>Комбинированный</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Срок оплаты</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.paymentTerm ? 'has-value' : ''}`}
                          onClick={() => setShowPaymentTermDropdown(!showPaymentTermDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.paymentTerm ? 
                              (selectedValues.paymentTerm === 'unloading' ? 'При разгрузке' : 
                               selectedValues.paymentTerm === 'prepayment' ? 'Предоплата' : 'Отсрочка платежа') : 
                              'Выберите срок оплаты'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showPaymentTermDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                        </div>
                        {showPaymentTermDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentTerm', 'unloading')}>
                              <span>При разгрузке</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentTerm', 'prepayment')}>
                              <span>Предоплата</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('paymentTerm', 'deferred')}>
                              <span>Отсрочка платежа</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Торг</label>
                      <div className="custom-dropdown">
                        <div 
                          className={`dropdown-trigger ${selectedValues.bargain ? 'has-value' : ''}`}
                          onClick={() => setShowBargainDropdown(!showBargainDropdown)}
                        >
                          <span className="dropdown-text">
                            {selectedValues.bargain ? 
                              (selectedValues.bargain === 'yes' ? 'Возможен' : 'Без торга') : 
                              'Возможность торга'
                            }
                          </span>
                          <svg 
                            className={`dropdown-arrow ${showBargainDropdown ? 'open' : ''}`} 
                            width="10" 
                            height="6" 
                            viewBox="0 0 10 6" 
                            fill="none"
                          >
                            <path d="M.529.695c.26-.26.682-.26.942 0L5 4.224 8.529.695a.667.667 0 0 1 .942.943l-4 4a.667.667 0 0 1-.942 0l-4-4a.667.667 0 0 1 0-.943" fill="#717680"/>
                          </svg>
                    </div>
                        {showBargainDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('bargain', 'yes')}>
                              <span>Возможен</span>
                            </div>
                            <div className="dropdown-option" onClick={() => handleSingleSelectChange('bargain', 'no')}>
                              <span>Без торга</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                  <hr className="form-divider" />
                </div>
                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <h3>Выберите контакты, которые будут видны в заказе</h3>
                  <p>Здесь отображаются доступные контакты, добавленные вами в разделе "Профиль". Вы можете изменить или добавить их в личном кабинете.</p>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Основной телефон</label>
                      <input type="tel" className="form-input" value={currentUser?.phone || ''} readOnly />
                    </div>
                    <div className="form-field">
                      <label>Дополнительный телефон</label>
                      <input type="tel" className="form-input" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>E-mail</label>
                      <input type="email" className="form-input" placeholder="example@email.com" />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                </div>
                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <div className="form-row"></div>
                    <div className="form-field" style={{ width: '100%' }}>
                      <label>Дополнительная информация</label>
                      <textarea 
                        className="form-input" 
                        rows={4} 
                        placeholder="Введите дополнительную информацию..." 
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <button className="submit-transport-btn" onClick={() => createCard('transport')}>
                    Добавить автомобиль
                  </button>
                </div>
            </div>
          </>
        );
      
      default:
        return (
          <div className="cards-container">
            <h3>Мои перевозки</h3>
            <p>Здесь отображаются все созданные вами заявки на перевозку</p>
            
            {(() => {
              if (!currentUser?.id) {
                return (
                  <div className="no-cards">
                    <p>Пожалуйста, войдите в систему для просмотра ваших заявок.</p>
                  </div>
                );
              }
              
              // Используем данные из хука, который уже вызван на верхнем уровне
              const allMyOrders = [...(myCargos || []), ...(myTransports || [])];
              
              console.log('📋 Мои заявки:', allMyOrders.length);
              console.log('📦 Мои грузы:', myCargos?.length || 0);
              console.log('🚚 Мой транспорт:', myTransports?.length || 0);
              
              // Функция для преобразования API данных в формат карточки
              const convertOrderToCard = (order: any) => {
                console.log('🔍 Конвертируем заявку:', order.id, 'cargo_type:', order.cargo_type);
                
                // API не возвращает type в points, используем порядок: первый = загрузка/отправление, второй = разгрузка/прибытие
                const pickupPoint = order.points?.[0]; // Первая точка
                const dropoffPoint = order.points?.[1]; // Вторая точка
                
                return {
                  id: order.id,
                  type: order.cargo_type ? 'cargo' : 'transport',
                  loadingCity: pickupPoint?.city || '',
                  loadingRegion: pickupPoint?.region || '',
                  loadingCountry: pickupPoint?.country || '',
                  unloadingCity: dropoffPoint?.city || '',
                  unloadingRegion: dropoffPoint?.region || '',
                  unloadingCountry: dropoffPoint?.country || '',
                  createdAt: order.created_at,
                  cargoPrice: order.price_amount?.toString() || '0',
                  cargoCurrency: order.price_currency || 'USD',
                  cargoWeight: order.weight_t?.toString() || '0',
                  cargoVolume: order.volume_m3?.toString() || '0',
                  vehicleType: order.vehicle_type || 'ANY',
                  cargoType: getDetailedCargoType(order.note || '', order.cargo_type || 'GENERAL'), // Используем детальный тип из заметки
                  paymentMethod: order.payment_method === 'BANK_TRANSFER' ? 'cashless' : 
                                order.payment_method === 'CARD' ? 'card' : 'cash',
                  paymentTerm: order.payment_term === 'PREPAID' ? 'prepayment' :
                              order.payment_term === 'ON_UNLOAD' ? 'unloading' :
                              order.payment_term === 'POSTPAID' ? 'deferred' : 'prepayment',
                  palletCount: order.pallets_count || 0,
                  vehicleCount: order.cars_count || 1,
                  additionalPhone: order.contact_extra_phone || '',
                  additionalInfo: order.note || ''
                };
              };
              
              const convertedOrders = allMyOrders.map(convertOrderToCard);
              
              if (convertedOrders.length === 0) {
                return (
                  <div className="no-cards">
                    <p>У вас пока нет созданных заявок. Создайте первую заявку, нажав "Добавить груз" или "Добавить транспорт" в левом меню.</p>
                  </div>
                );
              }
              
              return (
                <div className="cards-grid">
                  {convertedOrders.map((card: any, index: number) => (
                    <div 
                      key={card.id} 
                      className={`transport-card ${deletingCardId === card.id ? 'deleting' : ''}`}
                    >
                      <div className="transport-card__content">
                        <div className="transport-card__row">
                          <div className="transport-card__route-info">
                            <div className="transport-card__route">
                              {(() => {
                                const loadingParts = [];
                                if (card.loadingCity) loadingParts.push(card.loadingCity);
                                if (card.loadingRegion) loadingParts.push(card.loadingRegion);
                                if (card.loadingCountry) loadingParts.push(card.loadingCountry);
                                const loadingStr = loadingParts.length > 0 ? loadingParts.join(', ') : 'Не указано';
                                
                                const unloadingParts = [];
                                if (card.unloadingCity) unloadingParts.push(card.unloadingCity);
                                if (card.unloadingRegion) unloadingParts.push(card.unloadingRegion);
                                if (card.unloadingCountry) unloadingParts.push(card.unloadingCountry);
                                const unloadingStr = unloadingParts.length > 0 ? unloadingParts.join(', ') : 'Не указано';
                                
                                return `${loadingStr} → ${unloadingStr}`;
                              })()}
                            </div>
                            <div className="transport-card__type-badge">
                              {card.type === 'cargo' ? (
                                <svg width="14" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 22C11.1818 22 10.4002 21.6698 8.83693 21.0095C4.94564 19.3657 3 18.5438 3 17.1613C3 16.7742 3 10.0645 3 7M12 22C12.8182 22 13.5998 21.6698 15.1631 21.0095C19.0544 19.3657 21 18.5438 21 17.1613V7M12 22L12 11.3548" stroke="#FE6824" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z" stroke="#FE6824" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M6 12L8 13" stroke="#FE6824" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M17 4L7 9" stroke="#FE6824" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 .667A1.333 1.333 0 0 1 10.335 2v.667h1.013a1.33 1.33 0 0 1 1.041.5l.987 1.234c.189.236.292.53.292.833V8a1.333 1.333 0 0 1-1.333 1.334 2 2 0 1 1-4 0H5.667a2 2 0 1 1-4 0A1.333 1.333 0 0 1 .334 8V2A1.333 1.333 0 0 1 1.667.667zm-5.333 8a.667.667 0 1 0 0 1.333.667.667 0 0 0 0-1.333m6.667 0a.667.667 0 1 0 0 1.333.667.667 0 0 0 0-1.333M9.001 2H1.667v6h.51a2 2 0 0 1 2.894-.092L5.158 8h3.685l.077-.08.08-.077zm2.346 2h-1.013v3.334c.547 0 1.042.22 1.403.574l.088.092h.509V5.234z" fill="#FE6824"/>
                                </svg>
                              )}
                              {card.type === 'cargo' ? 'Груз' : 'Транспорт'}
                            </div>
                            <div className="transport-card__date">
                              <div>Добавлено {card.createdAt ? new Date(card.createdAt).toLocaleDateString('ru-RU') : '09.01.2025'}</div>
                            </div>
                          </div>
                          <div className="transport-card__time-ago">
                            {card.createdAt ? getTimeAgo(card.createdAt) : 'только что'}
                          </div>
                        </div>

                        <div className="transport-card__row transport-card__row--second">
                          <div className="transport-card__distance-cargo">
                            <div className="transport-card__distance">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {calculateDistance(card.loadingCity, card.unloadingCity)} км
                            </div>
                            <div className="transport-card__cargo-type">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {Array.isArray(card.cargoType) ? 
                                card.cargoType.map((type: string) => type).join(', ') :
                                card.cargoType || 'Не указано'
                              }
                            </div>
                          </div>
                          <div className="transport-card__payment-price">
                            <div className={`transport-card__payment-badge ${
                              card.paymentMethod === 'cashless' ? 'transport-card__payment-badge--cashless' :
                              card.paymentMethod === 'card' ? 'transport-card__payment-badge--card' :
                              card.paymentMethod === 'combined' ? 'transport-card__payment-badge--combined' :
                              'transport-card__payment-badge--cashless'
                            }`}>
                              {card.paymentMethod === 'cashless' ? 'Наличные' : 
                               card.paymentMethod === 'card' ? 'На карту' : 
                               card.paymentMethod === 'combined' ? 'Комбинированный' : 'Наличные'}
                            </div>
                            <div className="transport-card__price">
                              {card.cargoPrice || '55'} {card.cargoCurrency}
                            </div>
                          </div>
                        </div>

                        <div className="transport-card__row">
                          <div className="transport-card__vehicle-info">
                            <div className="transport-card__vehicle-type">
                              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 .667A1.333 1.333 0 0 1 10.335 2v.667h1.013a1.33 1.33 0 0 1 1.041.5l.987 1.234c.189.236.292.53.292.833V8a1.333 1.333 0 0 1-1.333 1.334 2 2 0 1 1-4 0H5.667a2 2 0 1 1-4 0A1.333 1.333 0 0 1 .334 8V2A1.333 1.333 0 0 1 1.667.667zm-5.333 8a.667.667 0 1 0 0 1.333.667.667 0 0 0 0-1.333m6.667 0a.667.667 0 1 0 0 1.333.667.667 0 0 0 0-1.333M9.001 2H1.667v6h.51a2 2 0 0 1 2.894-.092L5.158 8h3.685l.077-.08.08-.077zm2.346 2h-1.013v3.334c.547 0 1.042.22 1.403.574l.088.092h.509V5.234z" fill="#717680"/>
                              </svg>
                              {card.type === 'cargo' ? 
                                (getVehicleTypeName(card.vehicleType) || 'Тент') :
                                (getVehicleTypeName(card.vehicleType) || 'Тент')
                              }
                            </div>
                            <div className="transport-card__spec-item">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10.667h8.003L9.053 4H2.95zm4.001-8a.65.65 0 0 0 .476-.192A.64.64 0 0 0 6.668 2a.65.65 0 0 0-.192-.475.64.64 0 0 0-.475-.192.64.64 0 0 0-.474.192.65.65 0 0 0-.193.475q0 .283.193.475A.64.64 0 0 0 6 2.667m1.884 0h1.168q.5 0 .866.333.367.333.45.817l.951 6.666q.084.6-.308 1.059a1.26 1.26 0 0 1-1.01.458H2q-.617 0-1.01-.458a1.29 1.29 0 0 1-.307-1.059l.95-6.666q.084-.484.45-.817.367-.333.867-.333h1.167a4 4 0 0 1-.083-.325A1.7 1.7 0 0 1 4.001 2q0-.834.583-1.417A1.93 1.93 0 0 1 6.001 0 1.93 1.93 0 0 1 7.42.583q.583.584.583 1.417q0 .183-.033.342t-.084.325" fill="#717680"/>
                              </svg>
                              {card.cargoWeight || card.transportWeight || '10'}т
                            </div>
                            <div className="transport-card__spec-item">
                              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.46 9.334h1.834c.12 0 .24-.047.327-.12a.39.39 0 0 0 0-.587.47.47 0 0 0-.327-.12h-.727l1.507-1.373a.4.4 0 0 0 .133-.294.4.4 0 0 0-.133-.293.504.504 0 0 0-.653 0L3.914 7.92v-.66a.4.4 0 0 0-.133-.293.47.47 0 0 0-.327-.12.5.5 0 0 0-.327.12.4.4 0 0 0-.133.293v1.667a.4.4 0 0 0 .133.293c.087.08.2.12.327.12zm4.794-3.747c.12 0 .24-.047.327-.12l1.506-1.373v.66a.4.4 0 0 0 .134.293.504.504 0 0 0 .653 0 .4.4 0 0 0 .133-.293V3.087a.4.4 0 0 0-.133-.293.47.47 0 0 0-.327-.12H8.714c-.12 0-.24.046-.327.12a.4.4 0 0 0-.133.293c0 .107.047.213.133.293s.2.12.327.12h.727L7.934 4.874a.4.4 0 0 0-.133.293c0 .107.046.22.133.293.087.08.2.12.327.12h-.007zM9.434 8.5h-.727c-.12 0-.24.047-.326.12a.4.4 0 0 0-.134.294c0 .106.047.213.134.293.086.08.2.12.326.12h1.834c.12 0 .24-.047.326-.12a.4.4 0 0 0 .134-.293V7.247a.4.4 0 0 0-.134-.293.47.47 0 0 0-.326-.12.5.5 0 0 0-.327.12.4.4 0 0 0-.133.293v.66L8.574 6.534a.47.47 0 0 0-.327-.12.5.5 0 0 0-.326.12.39.39 0 0 0 0 .587l1.506 1.373zM3.461 5.167c.12 0 .24-.047.326-.12a.4.4 0 0 0 .134-.293v-.66l1.506 1.373a.506.506 0 0 0 .654 0 .39.39 0 0 0 0-.587L4.574 3.507h.727c.12 0 .24-.047.326-.12a.4.4 0 0 0 .134-.293.4.4 0 0 0-.134-.294.47.47 0 0 0-.326-.12H3.467c-.12 0-.24.047-.326.12a.4.4 0 0 0-.134.294V4.76a.4.4 0 0 0 .134.294c.086.08.2.12.326.12zm8.873-4.5H1.667C.934.667.334 1.267.334 2v8c0 .734.6 1.334 1.333 1.334h10.667c.733 0 1.333-.6 1.333-1.334V2c0-.733-.6-1.333-1.333-1.333m0 9.333H1.667V2h10.667z" fill="#717680"/>
                              </svg>
                              {card.cargoVolume || card.transportVolume || '86'}м³
                            </div>
                            {card.palletCount > 0 && (
                              <div className="transport-card__spec-item">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2 10.667h8.003L9.053 4H2.95zm4.001-8a.65.65 0 0 0 .476-.192A.64.64 0 0 0 6.668 2a.65.65 0 0 0-.192-.475.64.64 0 0 0-.475-.192.64.64 0 0 0-.474.192.65.65 0 0 0-.193.475q0 .283.193.475A.64.64 0 0 0 6 2.667m1.884 0h1.168q.5 0 .866.333.367.333.45.817l.951 6.666q.084.6-.308 1.059a1.26 1.26 0 0 1-1.01.458H2q-.617 0-1.01-.458a1.29 1.29 0 0 1-.307-1.059l.95-6.666q.084-.484.45-.817.367-.333.867-.333h1.167a4 4 0 0 1-.083-.325A1.7 1.7 0 0 1 4.001 2q0-.834.583-1.417A1.93 1.93 0 0 1 6.001 0 1.93 1.93 0 0 1 7.42.583q.583.584.583 1.417q0 .183-.033.342t-.084.325" fill="#717680"/>
                                </svg>
                                {card.palletCount}шт
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="transport-card__row">
                          <div className="transport-card__details">
                            <span>
                              {Array.isArray(card.loadingType) ? 
                                card.loadingType.includes('all') ? 'Все загрузки' :
                                card.loadingType.map((type: string) => 
                                  type === 'back' ? 'Задняя' : 
                                  type === 'side' ? 'Боковая' : 
                                  type === 'top' ? 'Верхняя' : type
                                ).join(', ') :
                                card.loadingType === 'back' ? 'Задняя' : 
                                card.loadingType === 'side' ? 'Боковая' : 
                                card.loadingType === 'top' ? 'Верхняя' : 'Задняя'
                              }
                            </span>
                            <span>Информация о грузе</span>
                          </div>
                          <div className="transport-card__actions">
                            <button 
                              className="transport-card__bookmark-btn"
                              title="Добавить в закладки"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button 
                              className="transport-card__edit-btn"
                              title="Редактировать"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button 
                              className="transport-card__delete-btn"
                              title="Удалить"
                              onClick={() => handleDeleteCard(card.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button 
                              className="transport-card__details-btn"
                              onClick={() => toggleCardExpanded(card.id)}
                            >
                              {expandedCardId === card.id ? 'Свернуть' : 'Подробнее'}
                              <svg 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transform: expandedCardId === card.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                              >
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className={`transport-card__expanded ${expandedCardId === card.id ? 'expanded' : ''}`}>
                            <div className="transport-card__expanded-content">
                              <h4>Контактная информация</h4>
                              <div className="transport-card__contact-info">
                                <div className="transport-card__contact-row">
                                  <span className="transport-card__contact-label">Имя:</span>
                                  <span className="transport-card__contact-value">
                                    {currentUser?.firstName} {currentUser?.lastName}
                                  </span>
                                </div>
                                <div className="transport-card__contact-row">
                                  <span className="transport-card__contact-label">Телефон:</span>
                                  <span className="transport-card__contact-value">{currentUser?.phone}</span>
                                </div>
                                {currentUser?.email && (
                                  <div className="transport-card__contact-row">
                                    <span className="transport-card__contact-label">Email:</span>
                                    <span className="transport-card__contact-value">{currentUser.email}</span>
                                  </div>
                                )}
                                {card.additionalPhone && (
                                  <div className="transport-card__contact-row">
                                    <span className="transport-card__contact-label">Доп. телефон:</span>
                                    <span className="transport-card__contact-value">{card.additionalPhone}</span>
                                  </div>
                                )}
                                {card.palletCount > 0 && (
                                  <div className="transport-card__contact-row">
                                    <span className="transport-card__contact-label">Количество паллет:</span>
                                    <span className="transport-card__contact-value">{card.palletCount}</span>
                                  </div>
                                )}
                                {card.additionalInfo && !card.additionalInfo.includes('[CargoType:') && (
                                  <div className="transport-card__contact-row">
                                    <span className="transport-card__contact-label">Комментарий:</span>
                                    <span className="transport-card__contact-value">{card.additionalInfo}</span>
                                  </div>
                                )}
                                {card.additionalInfo && card.additionalInfo.includes('[CargoType:') && (
                                  <div className="transport-card__contact-row">
                                    <span className="transport-card__contact-label">Комментарий:</span>
                                    <span className="transport-card__contact-value">{card.additionalInfo.replace(/\[CargoType:[^\]]+\]/g, '').trim()}</span>
                                  </div>
                                )}
                              </div>
                              
                              <hr className="transport-card__divider" />
                              
                              <div className="transport-card__additional-info">
                                <div className="transport-card__info-row">
                                  <span className="transport-card__info-label">Условия оплаты:</span>
                                  <span className="transport-card__info-value">
                                    {card.paymentTerm === 'prepayment' ? 'Предоплата' :
                                     card.paymentTerm === 'unloading' ? 'При разгрузке' :
                                     card.paymentTerm === 'deferred' ? 'Отсрочка платежа' : 'Не указано'}
                                  </span>
                                </div>
                                {card.vehicleCount > 0 && (
                                  <div className="transport-card__info-row">
                                    <span className="transport-card__info-label">Количество автомобилей:</span>
                                    <span className="transport-card__info-value">
                                      {card.vehicleCount}
                                    </span>
                                  </div>
                                )}
                                {card.palletCount > 0 && (
                                  <div className="transport-card__info-row">
                                    <span className="transport-card__info-label">Количество паллет:</span>
                                    <span className="transport-card__info-value">
                                      {card.palletCount} шт
                                    </span>
                                  </div>
                                )}
                                {card.additionalInfo && (
                                  <div className="transport-card__info-row">
                                    <span className="transport-card__info-label">Дополнительная информация:</span>
                                    <span className="transport-card__info-value">{card.additionalInfo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="homepage-container container">
        <LeftSidebar 
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <div className="homepage-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Homepage;


