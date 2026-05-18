// sync-data.js
// Синхронизация данных между cars.html и admin.html

(function() {
    'use strict';
    
    console.log('Скрипт синхронизации данных загружен');
    
    // Константы для ключей localStorage
    const STORAGE_KEYS = {
        CARS: 'cars',
        APPLICATIONS: 'carApplications',
        USERS: 'users',
        USER_STATE: 'userState'
    };
    
    // Инициализация данных при первой загрузке
    function initData() {
        // Проверяем наличие данных автомобилей
        if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
            const initialCars = [
                {
                    id: 1,
                    name: "Toyota Camry 2023",
                    price: "2 450 000 ₽",
                    image: "https://sun9-28.userapi.com/s/v1/ig2/dbkNnFt5GkQPO0mtcO5lnYGYry3ppBqaIhmN0na90LbEJUk-0B7pku-tgq6z0TFCAcjeulzIpyB7kXRNYL2a9LAW.jpg?quality=95&as=32x21,48x32,72x48,108x72,160x107,240x160,360x240,480x320,540x360,640x427,720x480,1080x720,1280x853,1440x960,1470x980&from=bu&cs=1470x0",
                    features: ["Бензин", "Автомат", "2.5 л"],
                    badge: "НОВИНКА",
                    brand: "toyota",
                    bodyType: "sedan",
                    fuelType: "petrol",
                    maxPrice: 2450000,
                    description: "Современный седан с передовыми технологиями и элегантным дизайном. Идеален для города и дальних поездок.",
                    specs: {
                        engine: "2.5 л, 203 л.с.",
                        transmission: "Автоматическая",
                        drive: "Передний",
                        fuel: "7.8 л/100км",
                        acceleration: "8.3 сек",
                        trunk: "524 л"
                    }
                },
                // ... остальные начальные автомобили
            ];
            localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(initialCars));
        }
        
        // Проверяем наличие данных пользователей
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            const initialUsers = [
                {
                    username: 'admin',
                    password: 'admin123',
                    firstName: 'Администратор',
                    lastName: 'Системы',
                    email: 'admin@avtomir.ru',
                    phone: '+7 (999) 999-99-99',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                },
                {
                    username: 'demo',
                    password: '123456',
                    firstName: 'Иван',
                    lastName: 'Иванов',
                    patronymic: 'Иванович',
                    phone: '+7 (999) 123-45-67',
                    role: 'user',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
        }
        
        // Проверяем наличие данных заявок
        if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
            localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
        }
    }
    
    // Функция для получения всех автомобилей
    function getAllCars() {
        const cars = localStorage.getItem(STORAGE_KEYS.CARS);
        return cars ? JSON.parse(cars) : [];
    }
    
    // Функция для добавления нового автомобиля
    function addCar(carData) {
        const cars = getAllCars();
        
        // Генерация уникального ID
        const newId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
        
        const newCar = {
            id: newId,
            ...carData,
            createdAt: new Date().toISOString()
        };
        
        cars.push(newCar);
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
        
        console.log('Автомобиль добавлен:', newCar);
        return newCar;
    }
    
    // Функция для обновления автомобиля
    function updateCar(carId, carData) {
        const cars = getAllCars();
        const index = cars.findIndex(c => c.id === carId);
        
        if (index !== -1) {
            cars[index] = { ...cars[index], ...carData, updatedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
            console.log('Автомобиль обновлен:', cars[index]);
            return cars[index];
        }
        
        return null;
    }
    
    // Функция для удаления автомобиля
    function deleteCar(carId) {
        const cars = getAllCars();
        const filteredCars = cars.filter(c => c.id !== carId);
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(filteredCars));
        console.log('Автомобиль удален, ID:', carId);
        return true;
    }
    
    // Функция для получения заявок
    function getApplications() {
        const apps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        return apps ? JSON.parse(apps) : [];
    }
    
    // Функция для добавления заявки
    function addApplication(applicationData) {
        const applications = getApplications();
        const newId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;
        
        const newApplication = {
            id: newId,
            ...applicationData,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        applications.push(newApplication);
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
        
        console.log('Заявка добавлена:', newApplication);
        return newApplication;
    }
    
    // Функция для обновления статуса заявки
    function updateApplicationStatus(appId, newStatus, comment = '') {
        const applications = getApplications();
        const index = applications.findIndex(a => a.id === appId);
        
        if (index !== -1) {
            applications[index].status = newStatus;
            applications[index].updatedAt = new Date().toISOString();
            
            if (comment) {
                applications[index].adminComment = comment;
            }
            
            localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
            console.log('Статус заявки обновлен:', applications[index]);
            return applications[index];
        }
        
        return null;
    }
    
    // Функция для удаления заявки
    function deleteApplication(appId) {
        const applications = getApplications();
        const filteredApplications = applications.filter(a => a.id !== appId);
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(filteredApplications));
        console.log('Заявка удалена, ID:', appId);
        return true;
    }
    
    // Функция для получения пользователей
    function getUsers() {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    }
    
    // Функция для добавления пользователя
    function addUser(userData) {
        const users = getUsers();
        
        // Проверяем, существует ли пользователь с таким username
        if (users.find(u => u.username === userData.username)) {
            console.error('Пользователь с таким логином уже существует');
            return null;
        }
        
        const newUser = {
            ...userData,
            role: userData.role || 'user',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        console.log('Пользователь добавлен:', newUser);
        return newUser;
    }
    
    // Функция для удаления пользователя
    function deleteUser(username) {
        const users = getUsers();
        const filteredUsers = users.filter(u => u.username !== username);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
        console.log('Пользователь удален:', username);
        return true;
    }
    
    // Функция для получения статистики
    function getStats() {
        const cars = getAllCars();
        const applications = getApplications();
        const users = getUsers();
        
        const newApplications = applications.filter(a => a.status === 'new').length;
        
        return {
            carsCount: cars.length,
            ordersCount: applications.length,
            usersCount: users.length,
            newOrdersCount: newApplications
        };
    }
    
    // Экспортируем функции в глобальную область видимости
    window.DataSync = {
        // Инициализация
        init: initData,
        
        // Автомобили
        getAllCars: getAllCars,
        addCar: addCar,
        updateCar: updateCar,
        deleteCar: deleteCar,
        
        // Заявки
        getApplications: getApplications,
        addApplication: addApplication,
        updateApplicationStatus: updateApplicationStatus,
        deleteApplication: deleteApplication,
        
        // Пользователи
        getUsers: getUsers,
        addUser: addUser,
        deleteUser: deleteUser,
        
        // Статистика
        getStats: getStats,
        
        // Ключи хранилища
        STORAGE_KEYS: STORAGE_KEYS
    };
    
    // Автоматически инициализируем данные при загрузке
    document.addEventListener('DOMContentLoaded', function() {
        initData();
        console.log('Данные инициализированы');
    });
    
})();