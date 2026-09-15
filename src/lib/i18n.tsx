import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "fr" | "ar" | "en";

const KEY = "himam-almaali-language";

const translations: Record<string, Record<Language, string>> = {
  "Student portal sign in": { fr: "Connexion au portail étudiant", ar: "تسجيل الدخول إلى بوابة الطالب", en: "Student portal sign in" },
  "Student": { fr: "Élève", ar: "طالب", en: "Student" },
  "Admin": { fr: "Administration", ar: "إدارة", en: "Admin" },
  "Teacher": { fr: "Enseignant", ar: "أستاذ", en: "Teacher" },
  "Principal": { fr: "Directeur", ar: "مدير", en: "Principal" },
  "Organizer": { fr: "Organisateur", ar: "منظّم", en: "Organizer" },
  "Username": { fr: "Nom d'utilisateur", ar: "اسم المستخدم", en: "Username" },
  "Password": { fr: "Mot de passe", ar: "كلمة المرور", en: "Password" },
  "Remember me": { fr: "Se souvenir de moi", ar: "تذكرني", en: "Remember me" },
  "Forgot password?": { fr: "Mot de passe oublié ?", ar: "هل نسيت كلمة المرور؟", en: "Forgot password?" },
  "Log In": { fr: "Se connecter", ar: "تسجيل الدخول", en: "Log In" },
  "Signing in…": { fr: "Connexion…", ar: "جارٍ تسجيل الدخول…", en: "Signing in…" },
  "Language": { fr: "Langue", ar: "اللغة", en: "Language" },
  "French": { fr: "Français", ar: "الفرنسية", en: "French" },
  "Arabic": { fr: "Arabe", ar: "العربية", en: "Arabic" },
  "English": { fr: "Anglais", ar: "الإنجليزية", en: "English" },
  "Please fill in both your username and password.": { fr: "Veuillez saisir votre nom d'utilisateur et votre mot de passe.", ar: "يرجى إدخال اسم المستخدم وكلمة المرور.", en: "Please fill in both your username and password." },
  "Those details don't match our records. Try again.": { fr: "Ces informations ne correspondent pas à nos dossiers. Réessayez.", ar: "هذه المعلومات لا تطابق سجلاتنا. حاول مرة أخرى.", en: "Those details don't match our records. Try again." },
  "That's a student account — switch to Student to sign in.": { fr: "C'est un compte élève — passez en mode Élève pour vous connecter.", ar: "هذا حساب طالب — اختر وضع الطالب لتسجيل الدخول.", en: "That's a student account — switch to Student to sign in." },
  "That's an admin account — switch to Admin to sign in.": { fr: "C'est un compte administratif — passez en mode Administration.", ar: "هذا حساب إداري — اختر وضع الإدارة لتسجيل الدخول.", en: "That's an admin account — switch to Admin to sign in." },
  "That's the Principal account — choose Principal under Admin to sign in.": { fr: "C'est le compte du directeur — choisissez Directeur dans Administration.", ar: "هذا حساب المدير — اختر المدير ضمن الإدارة.", en: "That's the Principal account — choose Principal under Admin to sign in." },
  "That's the Organizer account — choose Organizer under Admin to sign in.": { fr: "C'est le compte de l'organisateur — choisissez Organisateur dans Administration.", ar: "هذا حساب المنظم — اختر المنظم ضمن الإدارة.", en: "That's the Organizer account — choose Organizer under Admin to sign in." },
  "Please ask the school office to reset your password.": { fr: "Veuillez demander au secrétariat de réinitialiser votre mot de passe.", ar: "يرجى طلب إعادة تعيين كلمة المرور من إدارة المدرسة.", en: "Please ask the school office to reset your password." },
  "Demo student access —": { fr: "Accès élève de démonstration —", ar: "دخول الطالب التجريبي —", en: "Demo student access —" },
  "Demo teacher access —": { fr: "Accès enseignant de démonstration —", ar: "دخول الأستاذ التجريبي —", en: "Demo teacher access —" },
  "Demo Principal access —": { fr: "Accès directeur de démonstration —", ar: "دخول المدير التجريبي —", en: "Demo Principal access —" },
  "Demo Organizer access —": { fr: "Accès organisateur de démonstration —", ar: "دخول المنظم التجريبي —", en: "Demo Organizer access —" },
  "Editor access —": { fr: "Accès éditeur —", ar: "دخول المحرر —", en: "Editor access —" },
  "Dashboard": { fr: "Tableau de bord", ar: "لوحة التحكم", en: "Dashboard" },
  "Grades": { fr: "Notes", ar: "الدرجات", en: "Grades" },
  "Days missed": { fr: "Jours d'absence", ar: "أيام الغياب", en: "Days missed" },
  "Activities": { fr: "Activités", ar: "الأنشطة", en: "Activities" },
  "Exams": { fr: "Examens", ar: "الامتحانات", en: "Exams" },
  "Schedule": { fr: "Emploi du temps", ar: "الجدول", en: "Schedule" },
  "Profile": { fr: "Profil", ar: "الملف الشخصي", en: "Profile" },
  "Settings": { fr: "Paramètres", ar: "الإعدادات", en: "Settings" },
  "Logout": { fr: "Se déconnecter", ar: "تسجيل الخروج", en: "Logout" },
  "Student portal": { fr: "Portail étudiant", ar: "بوابة الطالب", en: "Student portal" },
  "Loading your portal…": { fr: "Chargement de votre portail…", ar: "جارٍ تحميل بوابتك…", en: "Loading your portal…" },
  "Loading the staff portal…": { fr: "Chargement du portail du personnel…", ar: "جارٍ تحميل بوابة الموظفين…", en: "Loading the staff portal…" },
  "Loading…": { fr: "Chargement…", ar: "جارٍ التحميل…", en: "Loading…" },
  "Recent grades": { fr: "Notes récentes", ar: "الدرجات الأخيرة", en: "Recent grades" },
  "Attendance summary": { fr: "Résumé des absences", ar: "ملخص الحضور", en: "Attendance summary" },
  "Today's classes": { fr: "Cours du jour", ar: "حصص اليوم", en: "Today's classes" },
  "Upcoming exams": { fr: "Examens à venir", ar: "الامتحانات القادمة", en: "Upcoming exams" },
  "View all": { fr: "Tout voir", ar: "عرض الكل", en: "View all" },
  "School announcements": { fr: "Annonces de l'école", ar: "إعلانات المدرسة", en: "School announcements" },
  "Progress": { fr: "Progression", ar: "التقدم", en: "Progress" },
  "Date": { fr: "Date", ar: "التاريخ", en: "Date" },
  "Time": { fr: "Heure", ar: "الوقت", en: "Time" },
  "Location": { fr: "Lieu", ar: "المكان", en: "Location" },
  "Close": { fr: "Fermer", ar: "إغلاق", en: "Close" },
  "Cancel": { fr: "Annuler", ar: "إلغاء", en: "Cancel" },
  "Save changes": { fr: "Enregistrer les modifications", ar: "حفظ التغييرات", en: "Save changes" },
  "Edit profile": { fr: "Modifier le profil", ar: "تعديل الملف الشخصي", en: "Edit profile" },
  "Full name": { fr: "Nom complet", ar: "الاسم الكامل", en: "Full name" },
  "Email": { fr: "E-mail", ar: "البريد الإلكتروني", en: "Email" },
  "Class": { fr: "Classe", ar: "الفصل", en: "Class" },
  "Student ID": { fr: "Identifiant élève", ar: "معرّف الطالب", en: "Student ID" },
  "Grade / year": { fr: "Niveau / année", ar: "المستوى / السنة", en: "Grade / year" },
  "Homeroom teacher": { fr: "Professeur principal", ar: "الأستاذ الرئيسي", en: "Homeroom teacher" },
  "Profile updated.": { fr: "Profil mis à jour.", ar: "تم تحديث الملف الشخصي.", en: "Profile updated." },
  "Preferences saved.": { fr: "Préférences enregistrées.", ar: "تم حفظ التفضيلات.", en: "Preferences saved." },
  "Notification and display preferences.": { fr: "Préférences de notifications et d'affichage.", ar: "تفضيلات الإشعارات والعرض.", en: "Notification and display preferences." },
  "Email alerts": { fr: "Alertes e-mail", ar: "تنبيهات البريد الإلكتروني", en: "Email alerts" },
  "Exam reminders": { fr: "Rappels d'examen", ar: "تذكيرات الامتحانات", en: "Exam reminders" },
  "Activity updates": { fr: "Mises à jour des activités", ar: "تحديثات الأنشطة", en: "Activity updates" },
  "Compact lists": { fr: "Listes compactes", ar: "قوائم مختصرة", en: "Compact lists" },
  "See grades": { fr: "Voir les notes", ar: "عرض الدرجات", en: "See grades" },
  "Students": { fr: "Élèves", ar: "الطلاب", en: "Students" },
  "Management": { fr: "Gestion", ar: "الإدارة", en: "Management" },
  "View students": { fr: "Voir les élèves", ar: "عرض الطلاب", en: "View students" },
  "Manage students & teachers": { fr: "Gérer les élèves et enseignants", ar: "إدارة الطلاب والأساتذة", en: "Manage students & teachers" },
  "Publish homework": { fr: "Publier un devoir", ar: "نشر واجب", en: "Publish homework" },
  "portal": { fr: "portail", ar: "بوابة", en: "portal" },
  "View attendance": { fr: "Voir les absences", ar: "عرض الحضور", en: "View attendance" },
  "Today's timetable": { fr: "Emploi du temps du jour", ar: "جدول اليوم", en: "Today's timetable" },
  "Exam schedule": { fr: "Calendrier des examens", ar: "جدول الامتحانات", en: "Exam schedule" },
  "This school year": { fr: "Cette année scolaire", ar: "هذه السنة الدراسية", en: "This school year" },
  "Periods missed": { fr: "Périodes manquées", ar: "الحصص الفائتة", en: "Periods missed" },
  "Across all dates": { fr: "Toutes les dates", ar: "في جميع التواريخ", en: "Across all dates" },
  "Subjects": { fr: "Matières", ar: "المواد", en: "Subjects" },
  "Current timetable": { fr: "Emploi du temps actuel", ar: "الجدول الحالي", en: "Current timetable" },
  "Next exam": { fr: "Prochain examen", ar: "الامتحان القادم", en: "Next exam" },
  "None scheduled": { fr: "Aucun prévu", ar: "لا يوجد", en: "None scheduled" },
  "Request to join": { fr: "Demande d'inscription", ar: "طلب الانضمام", en: "Request to join" },
  "Your request to join": { fr: "Votre demande pour rejoindre", ar: "طلبك للانضمام إلى", en: "Your request to join" },
  "was sent to the organizer.": { fr: "a été envoyée à l'organisateur.", ar: "تم إرسالها إلى المنظم.", en: "was sent to the organizer." },
  "Request to join a club or activity. The organizer will review it.": { fr: "Demandez à rejoindre un club ou une activité. L'organisateur examinera votre demande.", ar: "اطلب الانضمام إلى نادٍ أو نشاط. سيراجع المنظم طلبك.", en: "Request to join a club or activity. The organizer will review it." },
  "Joined": { fr: "Inscrit", ar: "منضم", en: "Joined" },
  "Request pending": { fr: "Demande en attente", ar: "الطلب قيد الانتظار", en: "Request pending" },
  "Enter your full name. The organizer will accept or deny your request.": { fr: "Saisissez votre nom complet. L'organisateur acceptera ou refusera votre demande.", ar: "أدخل اسمك الكامل. سيقبل المنظم طلبك أو يرفضه.", en: "Enter your full name. The organizer will accept or deny your request." },
  "Send request": { fr: "Envoyer la demande", ar: "إرسال الطلب", en: "Send request" },
  "Marks for": { fr: "Notes pour", ar: "درجات", en: "Marks for" },
  "subjects, each scored out of 20.": { fr: "matières, chacune notée sur 20.", ar: "مواد، كل واحدة من 20.", en: "subjects, each scored out of 20." },
  "Select an exam for topics and details.": { fr: "Sélectionnez un examen pour voir les thèmes et les détails.", ar: "اختر امتحاناً لعرض المواضيع والتفاصيل.", en: "Select an exam for topics and details." },
  "days": { fr: "jours", ar: "أيام", en: "days" },
  "Countdown": { fr: "Compte à rebours", ar: "العد التنازلي", en: "Countdown" },
  "Topics covered": { fr: "Thèmes abordés", ar: "المواضيع المشمولة", en: "Topics covered" },
  "Weekly schedule": { fr: "Emploi du temps hebdomadaire", ar: "الجدول الأسبوعي", en: "Weekly schedule" },
  "Monday to Friday timetable.": { fr: "Emploi du temps du lundi au vendredi.", ar: "جدول من الاثنين إلى الجمعة.", en: "Monday to Friday timetable." },
  "Your student record.": { fr: "Votre dossier scolaire.", ar: "سجلك الدراسي.", en: "Your student record." },
  "Get an email when a new grade is posted.": { fr: "Recevoir un e-mail lorsqu'une nouvelle note est publiée.", ar: "احصل على بريد عند نشر درجة جديدة.", en: "Get an email when a new grade is posted." },
  "Reminders three days before each exam.": { fr: "Rappels trois jours avant chaque examen.", ar: "تذكيرات قبل كل امتحان بثلاثة أيام.", en: "Reminders three days before each exam." },
  "News from clubs you have joined.": { fr: "Actualités des clubs que vous avez rejoints.", ar: "أخبار الأندية التي انضممت إليها.", en: "News from clubs you have joined." },
  "Show more rows per screen.": { fr: "Afficher plus de lignes par écran.", ar: "عرض صفوف أكثر في الشاشة.", en: "Show more rows per screen." },
  "period": { fr: "période", ar: "حصة", en: "period" },
  "periods": { fr: "périodes", ar: "حصص", en: "periods" },
  "Days recorded": { fr: "Jours enregistrés", ar: "أيام مسجلة", en: "Days recorded" },
  "Absence dates": { fr: "Dates d'absence", ar: "تواريخ الغياب", en: "Absence dates" },
  "Across those dates": { fr: "Sur ces dates", ar: "خلال تلك التواريخ", en: "Across those dates" },
  "Attendance details": { fr: "Détails des absences", ar: "تفاصيل الحضور", en: "Attendance details" },
  "Welcome back": { fr: "Bon retour", ar: "مرحباً بعودتك", en: "Welcome back" },
  "Students on roll": { fr: "Élèves inscrits", ar: "الطلاب المسجلون", en: "Students on roll" },
  "Students assigned to you": { fr: "Élèves qui vous sont affectés", ar: "الطلاب المكلفون بك", en: "Students assigned to you" },
  "Teachers": { fr: "Enseignants", ar: "الأساتذة", en: "Teachers" },
  "Published school-wide": { fr: "Publications de l'école", ar: "منشورات المدرسة", en: "Published school-wide" },
  "Your latest posts": { fr: "Vos dernières publications", ar: "أحدث منشوراتك", en: "Your latest posts" },
  "No school-wide posts yet.": { fr: "Aucune publication scolaire pour le moment.", ar: "لا توجد منشورات مدرسية بعد.", en: "No school-wide posts yet." },
  "Update each student's assigned teacher and classroom.": { fr: "Modifiez l'enseignant et la classe de chaque élève.", ar: "حدّث أستاذ وفصل كل طالب.", en: "Update each student's assigned teacher and classroom." },
  "Your two assigned students.": { fr: "Vos deux élèves affectés.", ar: "الطالبان المكلفان بك.", en: "Your two assigned students." },
  "Add student": { fr: "Ajouter un élève", ar: "إضافة طالب", en: "Add student" },
  "Classroom": { fr: "Classe", ar: "الفصل الدراسي", en: "Classroom" },
  "Name": { fr: "Nom", ar: "الاسم", en: "Name" },
  "No students match that search.": { fr: "Aucun élève ne correspond à cette recherche.", ar: "لا يوجد طلاب يطابقون البحث.", en: "No students match that search." },
  "Save": { fr: "Enregistrer", ar: "حفظ", en: "Save" },
  "Saved": { fr: "Enregistré", ar: "تم الحفظ", en: "Saved" },
  "Search by name, username or classroom": { fr: "Rechercher par nom, identifiant ou classe", ar: "البحث بالاسم أو اسم المستخدم أو الفصل", en: "Search by name, username or classroom" },
  "All student marks across every subject.": { fr: "Toutes les notes des élèves dans chaque matière.", ar: "درجات جميع الطلاب في كل المواد.", en: "All student marks across every subject." },
  "Edit marks from 0 to 20 for your assigned class.": { fr: "Modifiez les notes de 0 à 20 pour votre classe.", ar: "عدّل الدرجات من 0 إلى 20 لفصلك.", en: "Edit marks from 0 to 20 for your assigned class." },
  "Your subject": { fr: "Votre matière", ar: "مادتك", en: "Your subject" },
  "Back to students": { fr: "Retour aux élèves", ar: "العودة إلى الطلاب", en: "Back to students" },
  "You have": { fr: "Vous avez", ar: "لديك", en: "You have" },
  "recorded absence dates": { fr: "dates d'absence enregistrées", ar: "تواريخ غياب مسجلة", en: "recorded absence dates" },
  "covering": { fr: "couvrant", ar: "تشمل", en: "covering" },
  "missed periods.": { fr: "périodes manquées.", ar: "حصص فائتة.", en: "missed periods." },
  "in": { fr: "dans", ar: "خلال", en: "in" },
  "Mathematics": { fr: "Mathématiques", ar: "الرياضيات", en: "Mathematics" },
  "English": { fr: "Anglais", ar: "الإنجليزية", en: "English" },
  "Science": { fr: "Sciences", ar: "العلوم", en: "Science" },
  "History": { fr: "Histoire", ar: "التاريخ", en: "History" },
  "Computer Science": { fr: "Informatique", ar: "علوم الحاسوب", en: "Computer Science" },
  "Physical Education": { fr: "Éducation physique", ar: "التربية البدنية", en: "Physical Education" },
};

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (text: string) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

function initialLanguage(): Language {
  if (typeof window === "undefined") return "fr";
  const saved = window.localStorage.getItem(KEY);
  return saved === "ar" || saved === "en" || saved === "fr" ? saved : "fr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  };
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: (text: string) => translations[text]?.[language] ?? text }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

export function languageName(language: Language) {
  return language === "fr" ? "Français" : language === "ar" ? "العربية" : "English";
}
