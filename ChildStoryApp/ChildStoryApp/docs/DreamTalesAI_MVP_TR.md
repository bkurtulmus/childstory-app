# DreamTales AI: MVP Planlama Dokümanı

- Doküman Sürümü: 1.0  
- Tarih: 24 Ekim 2025

Bu doküman, DreamTales AI mobil uygulamasının Gerekli En Düşük Ürün (MVP) sürümünün kapsamını, hedeflerini, teknik gereksinimlerini ve başarı metriklerini tanımlar.

---

## 1. Proje Vizyonu (Genel)
DreamTales AI'ın genel vizyonu, 3-10 yaş arası çocuklar için ebeveynlerin kolayca kişiselleştirilmiş, çok modlu (metin, görsel, ses) ve eğitici uyku vakti hikâyeleri oluşturabildiği, yapay zeka destekli bir mobil platform olmaktır.

## 2. MVP Hedefleri ve Ana Hipotez

### 2.1. MVP Hedefi
Pazara en hızlı şekilde çıkarak, en az geliştirme maliyetiyle temel değer önerisini ("kişiselleştirilmiş, yapay zeka destekli hikayeler") doğrulamak.

### 2.2. Ana Hipotez (Test Edilecek)
"Ebeveynler, çocuklarının adını, seçtikleri bir temayı ve basit bir davranışı içeren, yapay zeka tarafından üretilmiş standart kalitede bir 'Sesli Dijital Kitap' deneyimi için (özellikle hikayeleri kalıcı olarak saklamak amacıyla) aylık abonelik ücreti öder mi?"

## 3. Hedef Kitle (MVP Odağı)
- Birincil Kullanıcı (Alıcı): 3-10 yaş arası çocuklara sahip, teknolojiye yatkın ebeveynler.
- İkincil Kullanıcı (Tüketici): 3-10 yaş arası çocuklar.

## 4. MVP Kapsamı - Dahil Olan Özellikler (User Stories)
MVP, sadece aşağıdaki "Kullanıcı Hikayelerini" (User Stories) karşılayacak şekilde geliştirilecektir.

### Epic 1: Kullanıcı Yönetimi ve Profil Oluşturma
- Ebeveyn Kaydı: Bir ebeveyn olarak, bir e-posta ve şifre kullanarak (veya Google/Apple ile sosyal giriş yaparak) uygulamaya kayıt olabilmeliyim ki hesabımı güvence altına alabileyim.
- Çocuk Profili Yönetimi:
  - Bir ebeveyn olarak, uygulamaya birden fazla çocuk profili ekleyebilmeliyim (Her profil için sadece "İsim" ve "İlgi Alanı" gibi temel bilgiler), böylece her çocuğum için ayrı ayrı hikayeler oluşturabilmeliyim.
  - Bir ebeveyn olarak, mevcut çocuk profillerimi düzenleyebilmeli veya silebilmeliyim.

### Epic 2: Hikaye Oluşturma ("Hızlı Mod")
- Mod Seçimi: Bir ebeveyn olarak, ana ekranda hikaye oluşturma akışını başlatan net bir "Hikaye Yarat" butonu görmeliyim. (MVP'de sadece "Hızlı Mod" olacağı için mod seçimi adımı yoktur).
- Parametre Seçimi:
  - Bir ebeveyn olarak, hikayeyi hangi çocuğum için oluşturacağımı (kayıtlı profillerim arasından) seçebilmeliyim.
  - Bir ebeveyn olarak, önceden tanımlanmış bir "Tema" listesinden (örn: Uzay, Dinozorlar, Orman) seçim yapabilmeliyim.
  - Bir ebeveyn olarak, önceden tanımlanmış bir "Davranışsal Ders" listesinden (örn: Paylaşmak, Cesaret, Diş Fırçalamak) seçim yapabilmeliyim.
- Üretim: Bir ebeveyn olarak, seçimlerimi yaptıktan sonra "Oluştur" butonuna bastığımda, hikayenin hazırlandığını gösteren bir yükleme göstergesi (loading indicator) görmeliyim.

### Epic 3: Hikaye Tüketimi (Sesli Dijital Kitap Arayüzü)
- Arayüz: Bir kullanıcı olarak, oluşturulan hikayeyi açtığımda, o sahneye ait görseli, altındaki hikaye metnini ve basit kontrol butonlarını (Oynat/Duraklat, Sonraki Sayfa, Önceki Sayfa) görebilmeliyim.
- Seslendirme (TTS): Bir kullanıcı olarak, "Oynat" butonuna bastığımda, standart ve sakinleştirici bir sesin hikaye metnini (o sayfa için) okuduğunu duyabilmeliyim.
- Görseller: Bir kullanıcı olarak, her sayfada hikayeyle ilgili, yapay zeka tarafından üretilmiş standart kalitede bir görsel görmeliyim.

### Epic 4: Kütüphane (Freemium Modeli Testi)
- Premium Kullanıcı:
  - Premium aboneliğe sahip bir ebeveyn olarak, oluşturduğum tüm hikayelerin "Uyku Vakti Kütüphanesi" adlı bir bölümde kalıcı olarak listelendiğini görebilmeliyim.
  - Premium bir ebeveyn olarak, kütüphanemdeki bir hikayeye tıklayarak onu tekrar tekrar açabilmeliyim.
- Ücretsiz Kullanıcı:
  - Ücretsiz bir kullanıcı olarak, kütüphaneye gittiğimde, hikayelerin kalıcı olarak saklanmasının premium bir özellik olduğunu belirten bir "yükseltme" (upsell) mesajı görmeliyim.
  - Ücretsiz bir kullanıcı olarak, oluşturduğum hikayenin 24 saat sonra silineceği (veya hiç saklanmayacağı) konusunda net bir şekilde bilgilendirilmeliyim.

## 5. MVP Kapsamı - Bilinçli Olarak DAHİL EDİLMEYEN Özellikler (Out of Scope)
Aşağıdaki özellikler, ana hipotezi test etmek için kritik değildir ve geliştirme süresini/maliyetini önemli ölçüde artıracağı için MVP'ye DAHİL EDİLMEYECEKTİR.

- "Yaratıcı Mod" (Serbest Metin Girdisi): İçerik güvenliği (child safety) ve API maliyet riskleri nedeniyle ertelenmiştir.
- "Slayt Gösterisi" (Video Çıktısı): Üretim süresi, karmaşıklığı ve maliyeti nedeniyle ertelenmiştir.
- Avatar Oluşturma / Görsel Tutarlılık: MVP'nin en büyük teknik zorluğudur. MVP'de, hikayenin farklı sahnelerindeki karakterlerin birbirine benzememesi kabul edilebilir bir durumdur.
- Yüksek Kalite (HQ) Çıktılar: Maliyetleri düşük tutmak için standart kalite (SD) görseller ve standart TTS sesleri kullanılacaktır.
- Ses Tipi Seçimi: (Örn: Kadın/Erkek sesi, farklı tonlar). MVP'de tek bir standart ses kullanılacaktır.
- Çizim Stili Seçimi: (Örn: Suluboya, Çizgi Film). MVP'de tek bir standart görsel stili kullanılacaktır.
- Telifli Karakterler (Mario vb.): "Hızlı Mod"daki jenerik temalarla bu yasal risk yönetilecektir.

## 6. Teknik Gereksinimler (Yüksek Seviye)
- Mobil Platform: Cross-platform (React Native veya Flutter) - Tek bir kod tabanı ile hem iOS hem de Android'e hızlı çıkış yapmak için.
- Backend & Veritabanı: Firebase (Authentication, Firestore, Cloud Functions) - Hızlı geliştirme (Rapid Prototyping) ve ölçeklenebilirlik için.
- Yapay Zeka API'leri (3. Parti):
  - Metin (LLM): OpenAI (GPT-4o/GPT-4-Turbo) veya Google Gemini (Güvenli ve yapılandırılmış JSON çıktısı verebilen bir model).
  - Görsel (T2I): OpenAI (DALL-E 3) veya Stability AI (Standart kalite).
  - Ses (TTS): OpenAI TTS (alloy, shimmer vb.) veya Google TTS (Sakinleştirici tek bir ses modeli).

## 7. İş Modeli ve Test Planı (MVP)
Model, "Freemium" üzerine kuruludur ve doğrudan Ana Hipotezi (Madde 2.2) test eder.

- "Ücretsiz Paket"
  - Günde 1 adet "Hızlı Mod" hikaye oluşturma hakkı.
  - Oluşturulan hikayeler kütüphanede saklanmaz (veya sadece 24 saat saklanır).

- "Premium Paket" (Aylık Abonelik)
  - Günde 10 adet "Hızlı Mod" hikaye oluşturma hakkı.
  - Oluşturulan tüm hikayelerin "Uyku Vakti Kütüphanesi"nde kalıcı olarak saklanması.

## 8. Başarı Metrikleri (MVP için)
MVP'nin başarısı (ve Ana Hipotezin doğrulanması) şu metriklerle ölçülecektir:

- Dönüşüm Oranı (Conversion Rate) - [En Önemli Metrik]:
  - Tanım: Ücretsiz paketi indiren kullanıcıların, Premium pakete geçiş yüzdesi (%).
  - Hedef: Bu oranın yüksek olması, "Kütüphane" özelliğinin ve günlük hak artışının değerli bulunduğunu gösterir.
- Elde Tutma Oranı (Retention Rate):
  - Tanım: Uygulamayı yükleyen kullanıcıların % kaçının 1. Gün, 7. Gün ve 30. Gün sonra hala aktif olduğu.
- Etkileşim (Engagement):
  - Tanım: Günlük aktif kullanıcı başına oluşturulan ortalama hikaye sayısı. (Ücretsiz kullanıcılar için bu 1'e yakın olmalıdır).
