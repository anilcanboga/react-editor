# React Editor

Tarayıcıda çalışan, çok dosyalı bir React kod editörü ve canlı önizleme ortamı.
Kullanıcı `App.jsx`, `styles.css` ve `index.jsx` dosyalarını düzenler; Sandpack
projeyi tarayıcı içinde derleyerek sonucu izole bir önizleme alanında gösterir.

## Özellikler

- React ve JSX kodunu canlı derleme
- Dosya gezgini ve sekmeli CodeMirror editörü
- Satır numaraları ve satır içi hata gösterimi
- İzole canlı önizleme
- Tarayıcı console çıktıları
- Derleme durumu: Başlatılıyor, Derleniyor, Hazır ve Hata var
- Değişiklikleri otomatik olarak yerel kaydetme
- Örnek projeye dönme ve projeyi elle yeniden çalıştırma
- Masaüstü, tablet ve mobil uyumlu arayüz

## Kullanılan teknolojiler

- React 19
- Vite 7
- Sandpack React
- CodeMirror
- ESLint

Sandpack kullanıcıya hazır bir CodeSandbox arayüzü olarak gösterilmez. Uygulamanın
dosya gezgini, üst menüsü, editör yerleşimi, önizleme alanı ve durum göstergeleri
bu projeye özel olarak hazırlanmıştır.

## Yerel kayıt

Uygulamanın kullanıcı hesabı, özel backend'i veya veritabanı yoktur. Düzenlenen
proje 500 ms gecikmeyle tarayıcının `localStorage` alanına kaydedilir.

Kullanılan anahtar:

```text
react-editor:project:v1
```

Bu yaklaşım sayesinde sayfa yenilendiğinde veya tarayıcı yeniden açıldığında
çalışmaya devam edilebilir. Ancak şu sınırlamalar geçerlidir:

- Proje yalnızca aynı tarayıcı ve domain üzerinde kullanılabilir.
- Farklı cihazlar arasında senkronizasyon yapılmaz.
- Tarayıcı verileri temizlenirse yerel proje silinir.
- Paylaşılabilir proje bağlantısı ve sürüm geçmişi bulunmaz.
- Sandpack çalışma motorunun ve bağımlılıkların ilk yüklenmesi için internet
  bağlantısı gerekir.

`Örneğe dön` butonu yerel değişiklikleri başlangıç projesiyle değiştirir.

## Kurulum

Vite 7 nedeniyle Node.js `20.19+` veya `22.12+` gereklidir.

```bash
yarn install
yarn dev
```

Uygulama geliştirme sunucusunun terminalde gösterdiği yerel adreste açılır.

## Komutlar

```bash
# Geliştirme sunucusu
yarn dev

# ESLint kontrolü
yarn lint

# Üretim paketi
yarn build

# Üretim çıktısını yerelde önizleme
yarn preview
```

Üretim dosyaları `dist/` klasörüne yazılır.

## Proje yapısı

```text
react-editor/
├── src/
│   ├── App.jsx       # Sandpack kurulumu, yerel kayıt ve editör davranışı
│   ├── App.css       # Editör çalışma alanı ve responsive görünüm
│   ├── index.css     # Global stiller
│   └── main.jsx      # React başlangıç noktası
├── index.html        # Sayfa meta bilgileri
├── package.json      # Komutlar ve bağımlılıklar
└── vite.config.js    # Vite yapılandırması
```

## Çalışma akışı

```text
React dosyaları
      ↓
Sandpack çalışma motoru
      ↓
Canlı önizleme iframe'i
      ↓
Console ve hata çıktıları
```

Editörde yapılan değişiklikler Sandpack'e iletilir, 500 ms'lik beklemeden sonra
yeniden derlenir ve aynı zamanda `localStorage` içine kaydedilir.

## Yayına alma

Proje statik bir Vite uygulamasıdır; veritabanı kurulumu gerektirmez. `yarn build`
sonucunda oluşan `dist/` klasörü statik site destekleyen bir hosting hizmetine
yüklenebilir. Yayın ortamının Sandpack çalışma motoruna ve npm bağımlılıklarına
erişebilmesi gerekir.
