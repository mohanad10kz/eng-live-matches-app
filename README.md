# تطبيق مباريات وقنوات كرة القدم

تطبيق React Native تم إنشاؤه باستخدام Expo يسمح للمستخدمين بمشاهدة مباريات كرة القدم القادمة ومشاهدة القنوات المباشرة.

## الميزات

*   **شاشة المباريات:**
    *   جلب وعرض قائمة بمباريات كرة القدم القادمة.
    *   تجميع المباريات حسب الدوري (مثل الدوري الإنجليزي الممتاز، الدوري الإسباني).
    *   تصميم عصري لكل مباراة على شكل بطاقة، يعرض أسماء الفرق وشعاراتها ووقت المباراة.
    *   يتم تحويل أوقات المباريات إلى التوقيت المحلي للمستخدم.
*   **شاشة القنوات:**
    *   عرض شبكة من القنوات الرياضية المتاحة.
    *   عند النقر على قناة، يتم فتح مشغل فيديو بملء الشاشة لبث المحتوى.
*   **واجهة مستخدم عصرية (UI/UX):**
    *   تصميم نظيف وعصري مع ظلال وزوايا دائرية وتخطيط مناسب لشاشات الأجهزة المختلفة (باستخدام `SafeAreaView`).
    *   تخطيط متجاوب مع أحجام الشاشات المختلفة.

## التقنيات المستخدمة

*   [React Native](https://reactnative.dev/)
*   [Expo](https://expo.dev/)
*   [React Navigation](https://reactnavigation.org/) للتنقل بين الشاشات.
*   [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) لتشغيل الفيديو.
*   [React Native SafeArea Context](https://github.com/th3rdwave/react-native-safe-area-context) للتعامل مع المساحات الآمنة في الشاشة.

## هيكل المشروع

```
e:\Projects\react-native-app\
├───.gitignore
├───App.js
├───app.json
├───index.js
├───package-lock.json
├───package.json
├───.expo\
├───assets\
│   ├───icon.png
│   └───splash-icon.png
├───navigationScreens\
│   └───BottomTabNavigator.js
├───node_modules\
└───screens\
    ├───ChannelsScreen.js
    └───MatchesScreen.js
```

## الإعداد والتثبيت

1.  **استنساخ المستودع:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **الانتقال إلى مجلد المشروع:**
    ```bash
    cd react-native-app
    ```
3.  **تثبيت الاعتماديات:**
    ```bash
    npm install
    ```

## كيفية التشغيل

1.  **بدء خادم تطوير Expo:**
    ```bash
    npm start
    ```
    أو
    ```bash
    expo start
    ```
2.  **التشغيل على جهازك:**
    *   **iOS:** افتح تطبيق الكاميرا وامسح رمز الاستجابة السريعة (QR code) من الطرفية.
    *   **Android:** افتح تطبيق Expo Go وامسح رمز الاستجابة السريعة (QR code) من الطرفية.
