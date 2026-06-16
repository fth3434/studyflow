# 🚀 StudyFlow - Akıllı Öğrenci Asistanı ve Dashboard

StudyFlow, öğrencilerin çalışma rutinlerini optimize etmek, görevlerini takip etmek ve akademik başarılarını ölçmek için geliştirilmiş **modern, dinamik ve kapsamlı** bir eğitim asistanıdır. Öğrencilerin ihtiyaç duyabileceği her detay ince bir şekilde düşünülmüş olup; Lise'den Üniversite'ye kadar her eğitim kademesine özel akıllı algoritmalarla donatılmıştır.

---

## ✨ Öne Çıkan Özellikler ve İnce Detaylar

### 1. Eğitim Kademesine Özel Not ve Ortalama Hesaplama 🎓
Sistemin en güçlü yanlarından biri, sayfa yenilenmesine gerek kalmadan **Üniversite** ve **Lise/Ortaokul** arasında geçiş yapabilen akıllı hesaplama modülüdür:
*   **Üniversite Modu:** Seçildiğinde Güz, Bahar veya Yaz Okulu dönemleri listelenir. Vize (%40) ve Final (%60) notları üzerinden uluslararası harf notu (AA, BA, FF vb.) hesaplanır ve **4.0'lık GANO** sistemine göre ağırlıklı dönem ortalaması anında yansıtılır.
*   **Lise ve Ortaokul Modu:** Seçildiğinde 1. Dönem ve 2. Dönem seçenekleri listelenir. Harf notu sistemi devreden çıkar; bunun yerine haftalık ders saati (kredi) ve sınav notları kullanılarak **100'lük sistem** üzerinden "Dönem Ortalaması" hesaplanır. Dersten geçip kalma durumu (50 barajı) kırmızı ve yeşil renklerle dinamik olarak gösterilir.
*   **Dinamik Satır Üretimi:** "Ders Sayısı" girişini değiştirdiğiniz an, girdiğiniz rakam kadar satır (Ders Adı, Kredi, Sınav 1, Sınav 2) anında ekranda belirir. Veriler "Kaydet" butonu ile tek tıkla veritabanına işlenir.

### 2. Canlı Sınav Geri Sayım Sayacı ⏳
Yaklaşan sınavlarınız için gün, ay, yıl, saat ve dakika seçerek kayıt oluşturabilirsiniz.
*   Sınavlar sekmesinde her bir sınav için özel tasarlanmış, **saniye saniye geriye sayan dijital rozetler (badge)** bulunur (Gün, Saat, Dakika, Saniye).
*   Sınav tarihi geçtiğinde sayaç otomatik olarak durur ve yeşil renkte şık bir **"Sınav Geçti 🏁"** ibaresi belirir.

### 3. Akıllı Pomodoro ve Çalışma Geçmişi ⏱️
*   **Dinamik Tema:** Pomodoro zamanlayıcısı başlattığınızda arayüz tamamen çalışma moduna girer. "Çalışma" süresindeyken konteyner lacivert/kırmızı tonlarında, "Mola" süresine geçildiğinde ise rahatlatıcı bir yeşil tonuna bürünerek kullanıcıyı görsel olarak uyarır.
*   **Dakika Hassasiyetinde Kayıt:** Yapılan çalışmalar sadece saat değil, "Dakika" hassasiyetinde kaydedilebilir. 
*   **Geçmiş Kontrolü:** Geçmiş çalışmalar listesinde çalışma süreniz, çalıştığınız konu ve tarih listelenir. İstenilen geçmiş çalışma, onay penceresi eşliğinde tek tıkla veritabanından kalıcı olarak silinebilir.

### 4. Animasyonlu Motivasyon Panosu ✨
*   Dashboard'un en üstünde her sayfada size eşlik eden bir "Günün Sözü" bulunur.
*   Bu panonun arka planında css ile özel olarak yazılmış, **yavaşça hareket eden parlayan yıldız animasyonları** yer alır.
*   Kutunun üzerine tıkladığınızda rastgele yeni bir motivasyon sözü ekrana yumuşak bir geçişle (fade-in) gelir.

### 5. Kesintisiz Görev Yönetimi ve Canlı Grafikler 📈
*   Görev ekleme, düzenleme (✏️), tamamlama (✔️) ve silme (❌) işlemleri tek Sayfa Uygulaması (SPA) mantığıyla çalışır. Hiçbir işlemde **sayfa yenilenmez**.
*   Görev durumunuz değiştikçe, Dashboard ekranındaki **Chart.js ile çizilen Görev Analizi grafikleri anında** arka planda güncellenir. Arayüzler arası geçişte veri kaybı yaşanmaz veya grafiklerde bozulma/titreme (flicker) olmaz.

### 6. Gece/Gündüz (Dark/Light) Mod Uyumu 🌓
*   Tasarım bütünüyle Modern CSS, Flexbox ve Glassmorphism esintileriyle kodlanmıştır.
*   **İnce Düşünce:** Dark mod açıkken okunamayacak koyu renkli metinler (örneğin çalışma saatleri metni), karanlık moda geçildiğinde otomatik olarak "fosforlu lila/mavi" (#818cf8) tonlarına dönüşerek göz yormadan maksimum okunabilirlik sağlar.

### 7. Kusursuz Mobil Deneyim (Responsive UI) 📱
*   Tüm sayfalar (Açılış, Giriş, Kayıt ve Dashboard) mobil cihazların ekran boyutlarına tam uyumludur.
*   **Akıllı Hamburger Menü:** Dar ekranlarda sol menü (sidebar) otomatik olarak gizlenir. Şık bir menü butonu (☰) ile ekranı karartarak (overlay) soldan kayarak açılır (sliding drawer). Kullanıcı menüden bir seçenek seçtiğinde akıllıca geri kapanır.
*   **Esnek Grid Yapısı:** Tüm veri kartları ve Pomodoro zamanlayıcı metinleri, kullanıcının cihazına (Tablet, Telefon vb.) göre otomatik yeniden boyutlanır. Kırılma ve taşmalar engellenmiştir.

---

## 🛠️ Mimari ve Kullanılan Teknolojiler

Proje modern, ölçeklenebilir ve güvenlik odaklı bir yapıda tasarlanmıştır:

*   **Backend:** Node.js, Express.js
*   **Veritabanı:** PostgreSQL
*   **ORM (Object-Relational Mapping):** Prisma (Şema tabanlı, tip güvenli veritabanı iletişimi)
*   **Frontend:** HTML5, CSS3 (Gelişmiş Animasyonlar ve Medya Sorguları), Vanilla JavaScript, Chart.js
*   **Kimlik Doğrulama:** `express-session` tabanlı, izole edilmiş oturum (session) yönetimi.
*   **Veri Sözlüğü:** Veritabanının tüm mimarisini anlatan bir Veri Sözlüğü (`StudyFlow_Veri_Sozlugu.xlsx`) uygulama dizininde otomatik üretilmiştir.

### Dosya ve Klasör Yapısı
\`\`\`text
studyflow/
├── prisma/                  # Veritabanı şeması (schema.prisma)
├── public/                  # Frontend dosyaları (HTML, CSS, JS)
│   ├── dashboard.html       # Dinamik Ana Panel Arayüzü
│   ├── dashboard.js         # İstemci tarafı SPA mantığı, Hesaplamalar
│   ├── style.css            # Gece/Gündüz modu ve animasyonlar
│   └── ... 
├── src/                     # Backend API Kaynak Kodları
│   ├── controllers/         # Gelen istekleri işleyen kontrolcüler (Gpa, Task, Study)
│   ├── routes/              # Express yönlendiricileri (Router)
│   └── middleware/          # Güvenlik ve Auth katmanları
├── index.js                 # Sunucu başlangıç dosyası
├── .env                     # Çevresel değişkenler (Veritabanı URL'i)
└── README.md
\`\`\`

---

## ⚙️ Kurulum ve Çalıştırma

Proje hem **Vercel** gibi sunucusuz (serverless) ortamlarda barındırılmaya hem de kendi yerel bilgisayarınızda (localhost) çalıştırılmaya uygundur.

### Yerel Ortamda (Localhost) Çalıştırma
1.  **Depoyu Klonlayın:**
    \`\`\`bash
    git clone https://github.com/kullaniciadiniz/studyflow.git
    cd studyflow
    \`\`\`

2.  **Bağımlılıkları Yükleyin:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Çevresel Değişkenleri Ayarlayın:**
    Ana dizinde bir `.env` dosyası oluşturun ve PostgreSQL bağlantınızı girin:
    \`\`\`env
    DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/studyflow?schema=public"
    \`\`\`

4.  **Veritabanını Hazırlayın:**
    Prisma şemasını veritabanına gönderin ve istemciyi oluşturun:
    \`\`\`bash
    npx prisma db push
    npx prisma generate
    \`\`\`

5.  **Uygulamayı Başlatın:**
    \`\`\`bash
    node index.js
    \`\`\`
    Terminalde beliren `http://localhost:5000` (veya ilgili port) linkine tıklayarak asistanınızı kullanmaya başlayabilirsiniz!

---

💡 *StudyFlow, "Hiçkimse başarı merdivenlerini elleri cebinde çıkmamıştır." mottosuyla geliştirilmiştir. İyi çalışmalar dileriz!*
