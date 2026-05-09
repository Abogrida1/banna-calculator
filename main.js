const translations = {
    en: {
        title: "Scientific Calorie Tracker",
        subtitle: "Professional Nutrition Analysis (Mifflin-St Jeor)",
        age: "Age (Years)",
        gender: "Gender",
        male: "Male",
        female: "Female",
        height: "Height (cm)",
        weight: "Weight (kg)",
        activity: "Activity Level",
        activity_sedentary: "Sedentary (Little or no exercise)",
        activity_light: "Light (Exercise 1-3 times/week)",
        activity_moderate: "Moderate (Exercise 4-5 times/week)",
        activity_very: "Active (Daily exercise or intense exercise 3-4 times/week)",
        activity_extra: "Very Active (Intense exercise 6-7 times/week)",
        calculate: "Calculate Results",
        results: "Your Body Analysis",
        bmr: "Basal Metabolic Rate (BMR)",
        tdee: "Maintenance Calories (TDEE)",
        calories_day: "kcal / day",
        weight_loss: "Weight Loss Target (-500 kcal)",
        weight_gain: "Weight Gain Target (+500 kcal)",
        bmi: "Body Mass Index (BMI)",
        bmi_category: "Classification",
        underweight: "Underweight",
        normal: "Normal / Healthy",
        overweight: "Overweight",
        obese: "Obesity",
        loading: "Analyzing scientific data...",
        footer: "Standardized by the Mifflin-St Jeor Equation",
        error_limit: "Please enter valid values within professional ranges."
    },
    ar: {
        title: "حاسبة السعرات العلمية",
        subtitle: "تحليل تغذية احترافي (معادلة ميفلين سانت جيور)",
        age: "العمر (سنوات)",
        gender: "الجنس",
        male: "ذكر",
        female: "أنثى",
        height: "الطول (سم)",
        weight: "الوزن (كجم)",
        activity: "مستوى النشاط البدني",
        activity_sedentary: "خامل (بدون تمارين)",
        activity_light: "نشاط خفيف (تمرين 1-3 مرات/أسبوع)",
        activity_moderate: "نشاط متوسط (تمرين 4-5 مرات/أسبوع)",
        activity_very: "نشاط عالي (تمرين يومي)",
        activity_extra: "نشاط فائق (تمارين شاقة جداً)",
        calculate: "عرض النتائج",
        results: "تحليل بيانات الجسم",
        bmr: "معدل الأيض الأساسي (BMR)",
        tdee: "سعرات الثبات (TDEE)",
        calories_day: "سعر حراري / يوم",
        weight_loss: "هدف إنقاص الوزن (-500 سعر)",
        weight_gain: "هدف زيادة الوزن (+500 سعر)",
        bmi: "مؤشر كتلة الجسم (BMI)",
        bmi_category: "تصنيف الحالة",
        underweight: "نقص في الوزن",
        normal: "وزن صحي / مثالي",
        overweight: "وزن زائد",
        obese: "سمنة مفرطة",
        loading: "جاري تحليل البيانات العلمية...",
        footer: "معتمدة بناءً على معادلة ميفلين سانت جيور العالمية",
        error_limit: "يرجى إدخال قيم صحيحة ضمن النطاقات المتعارف عليها."
    }
};

let currentLang = 'ar'; // Default to Arabic as requested
let currentTheme = 'light';

// Elements
const calorieForm = document.getElementById('calorieForm');
const resultsCard = document.getElementById('resultsCard');
const loaderOverlay = document.getElementById('loaderOverlay');
const loaderText = document.getElementById('loaderText');
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const html = document.documentElement;

// Initialization
function init() {
    updateLanguage();
    setupEventListeners();
}

function setupEventListeners() {
    langToggle.addEventListener('click', toggleLanguage);
    themeToggle.addEventListener('click', toggleTheme);
    calorieForm.addEventListener('submit', handleCalculate);
}

// Language Logic
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    updateLanguage();
}

function updateLanguage() {
    const isAr = currentLang === 'ar';
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    html.setAttribute('lang', currentLang);
    langToggle.textContent = isAr ? 'English' : 'العربية';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    // Update placeholders with localization
    document.getElementById('age').placeholder = isAr ? 'مثال: ٢٥' : 'Ex: 25';
    document.getElementById('height').placeholder = isAr ? '١٧٠ سم' : '170 cm';
    document.getElementById('weight').placeholder = isAr ? '٧٠ كجم' : '70 kg';
}

// Theme Logic
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (currentTheme === 'dark') {
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    } else {
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
}

// Calculation Logic
function handleCalculate(e) {
    e.preventDefault();
    
    if (!calorieForm.checkValidity()) {
        calorieForm.reportValidity();
        return;
    }

    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseInt(document.getElementById('height').value);
    const weight = parseInt(document.getElementById('weight').value);
    const activity = parseFloat(document.getElementById('activity').value);

    showLoader(() => {
        calculateResults(age, gender, height, weight, activity);
    });
}

function showLoader(callback) {
    loaderOverlay.style.display = 'flex';
    loaderText.textContent = translations[currentLang].loading;
    
    // Smooth fade in
    loaderOverlay.style.opacity = '0';
    setTimeout(() => {
        loaderOverlay.style.transition = 'opacity 0.4s ease';
        loaderOverlay.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        loaderOverlay.style.opacity = '0';
        setTimeout(() => {
            loaderOverlay.style.display = 'none';
            callback();
        }, 400);
    }, 2500); 
}

function calculateResults(age, gender, height, weight, activity) {
    // Scientific Mifflin-St Jeor Equation
    // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = bmr * activity;
    const bmi = weight / ((height / 100) ** 2);

    updateUI(bmr, tdee, bmi);
}

function updateUI(bmr, tdee, bmi) {
    document.getElementById('bmrValue').textContent = Math.round(bmr).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    document.getElementById('tdeeValue').textContent = Math.round(tdee).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    document.getElementById('lossValue').textContent = Math.round(tdee - 500).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    document.getElementById('gainValue').textContent = Math.round(tdee + 500).toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US');
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);

    const bmiCat = document.getElementById('bmiCategory');
    const { category, color } = getBMICategory(bmi);
    bmiCat.textContent = translations[currentLang][category];
    bmiCat.style.backgroundColor = color;
    bmiCat.style.color = 'var(--bg-primary)';

    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth' });
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'underweight', color: 'var(--text-secondary)' };
    if (bmi < 25) return { category: 'normal', color: 'var(--text-primary)' };
    if (bmi < 30) return { category: 'overweight', color: 'var(--text-secondary)' };
    return { category: 'obese', color: 'var(--text-primary)' };
}

init();
