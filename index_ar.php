<?php
session_start();

$isLoggedIn = isset($_SESSION["user_id"]);

$user = null;

if ($isLoggedIn) {
    $user = [
        "id"    => $_SESSION["user_id"],
        "name"  => $_SESSION["user_name"],
        "email" => $_SESSION["user_email"]
    ];
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>جيبي</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="style_ar.css" />
</head>

<body>
  <div class="phone">
    <div class="app">
      <main class="content" id="app-content">

        <!-- SPLASH -->
        <section id="screen-initial" class="screen active" aria-label="الشاشة الأولى">
          <img src="assets/Logo/JIBI LOGO.png" alt="شعار جيبي" />
          <img src="assets/LOGO/LOGO Calcul.png" alt="شعار الحساب" />
        </section>

        <!-- LOGIN -->
        <section id="screen-login" class="screen" aria-label="تسجيل الدخول">
          <div class="logo">
            <img src="assets/Logo/JIBI LOGO.png" alt="شعار جيبي" />
            <img src="assets/LOGO/LOGO Calcul.png" alt="شعار الحساب" />
          </div>
          <h1>تسجيل الدخول</h1>
          <form id="form-login" class="form auth-form" method="POST" action="jibi_php/login.php" autocomplete="on">
            <div class="field">
              <label class="label" for="login-email">البريد الإلكتروني :</label>
              <input id="login-email" name="email" type="email" placeholder="أدخل بريدك الإلكتروني" required />
            </div>
            <div class="field">
              <label class="label" for="login-password">كلمة المرور :</label>
              <input id="login-password" name="password" type="password" placeholder="أدخل كلمة المرور" required />
            </div>
            <div class="row">
              <label class="checkbox">
                <input id="login-remember" type="checkbox" />
                <span>تذكرني</span>
              </label>
            </div>
            <button id="btn-login-next" type="submit">دخول</button>
            <div class="divider"><span>أو</span></div>
            <div class="other-way">
              <button id="btn-login-google" type="button">
                <img src="assets/Icons/google.png" alt="Google" width="30" />
                الدخول عبر Google
              </button>
            </div>
            <div class="other-way">
              <button id="btn-login-facebook" type="button">
                <img src="assets/Icons/facebook.png" alt="Facebook" width="30" />
                الدخول عبر Facebook
              </button>
            </div>
            <p class="hint">
              ليس لديك حساب ؟
              <button id="btn-go-signup" class="linklike" type="button">إنشاء حساب</button>
            </p>
          </form>
        </section>

        <!-- SIGNUP -->
        <section id="screen-signup" class="screen" aria-label="إنشاء حساب">
          <div class="logo">
            <img src="assets/Logo/JIBI LOGO.png" alt="شعار جيبي" />
            <img src="assets/LOGO/LOGO Calcul.png" alt="شعار الحساب" />
          </div>
          <h1>إنشاء حساب</h1>
          <form id="form-signup" class="form auth-form" method="POST" action="jibi_php/signup.php" autocomplete="on">
            <div class="field">
              <label class="label" for="signup-name">الاسم الكامل :</label>
              <input id="signup-name" name="nom" type="text" placeholder="أدخل اسمك الكامل" required />
            </div>
            <div class="field">
              <label class="label" for="signup-email">البريد الإلكتروني :</label>
              <input id="signup-email" name="email" type="email" placeholder="أدخل بريدك الإلكتروني" required />
            </div>
            <div class="field">
              <label class="label" for="signup-password">كلمة المرور :</label>
              <input id="signup-password" name="password" type="password" placeholder="أدخل كلمة المرور" required />
            </div>
            <div class="field">
              <label class="label" for="signup-password2">تأكيد كلمة المرور :</label>
              <input id="signup-password2" name="confirm_password" type="password" placeholder="أعد إدخال كلمة المرور" required />
            </div>
            <button id="btn-create-account" type="submit">إنشاء الحساب</button>
            <p class="hint">
              لديك حساب بالفعل ؟
              <button id="btn-back-login" class="linklike" type="button">العودة لتسجيل الدخول</button>
            </p>
          </form>
        </section>

        <!-- HOME -->
        <section id="screen-home" class="screen" aria-label="الرئيسية">
          <header class="topbar">
            <h1 id="home-title">اليوم</h1>
            <h2 id="home-date">21 سبتمبر 2026</h2>
          </header>
          <div class="cards cards-stats">
            <div class="card-sell-expense">
              <h2>مبيعات اليوم</h2>
              <h3 id="stat-sales-today">0 درهم</h3>
            </div>
            <div class="card-sell-expense">
              <h2>مصاريف اليوم</h2>
              <h3 id="stat-expenses-today">0 درهم</h3>
            </div>
            <div class="card-profit">
              <h2>ربح اليوم</h2>
              <h3 id="stat-profit-today">0 درهم</h3>
            </div>
          </div>
          <div class="cards cards-actions">
            <button class="card action" id="go-cash" type="button">
              <h2>بيع نقدي</h2>
            </button>
            <div class="actions-row">
              <button class="card action" id="go-credit" type="button">
                <h2>بيع بالدين</h2>
              </button>
              <button class="card action" id="go-expense" type="button">
                <h2>مصروف</h2>
              </button>
            </div>
          </div>
        </section>

        <!-- CASH -->
        <section id="screen-cash" class="screen" aria-label="بيع نقدي">
          <header class="topbar">
            <button id="btn-back-home-from-cash" class="iconbtn" type="button">
              <img src="assets/icons/back no click.png" alt="رجوع" class="icon" />
            </button>
            <h1>بيع نقدي</h1>
            <button id="btn-go-credit-from-cash" class="iconbtn" type="button">
              <img src="assets/icons/next click.png" alt="التالي" class="icon" />
            </button>
          </header>
          <form id="form-cash" class="form">
            <div class="field">
              <h2>المقالات :</h2>
              <input id="cash-article-name" type="text" placeholder="اسم المقال" />
            </div>
            <div class="field">
              <input id="cash-article-price" type="number" inputmode="decimal" placeholder="السعر" />
            </div>
            <div class="field">
              <input id="cash-article-qty" type="number" inputmode="numeric" placeholder="الكمية" value="" />
            </div>
            <button id="btn-cash-add-item" class="add" type="button">+ إضافة مقال</button>
            <div id="cash-items" class="items-list"></div>
            <div class="summary">
              <div>المجموع :</div>
              <div id="cash-total">0 درهم</div>
            </div>
            <button id="btn-cash-save" class="save" type="button">تسجيل</button>
          </form>
        </section>

        <!-- CREDIT -->
        <section id="screen-credit" class="screen" aria-label="بيع بالدين">
          <header class="topbar">
            <button id="btn-back-cash-from-credit" class="iconbtn" type="button">
              <img src="assets/icons/back click.png" alt="رجوع" class="icon" />
            </button>
            <h1>بيع بالدين</h1>
            <button id="btn-go-expense-from-credit" class="iconbtn" type="button">
              <img src="assets/icons/next click.png" alt="التالي" class="icon" />
            </button>
          </header>
          <form id="form-credit" class="form">
            <div class="field">
              <h2>الزبون :</h2>
              <input id="credit-client-search" type="search" placeholder="أدخل اسم الزبون" />
              <div id="credit-client-suggestions" class="hidden"></div>
              <div id="credit-selected-client-info" class="hidden"></div>
              <button id="btn-credit-add-client" class="add" type="button">إضافة زبون</button>
            </div>
            <hr />
            <div class="field">
              <h2>المقالات :</h2>
              <input id="credit-article-name" type="text" placeholder="اسم المقال" />
            </div>
            <div class="field">
              <input id="credit-article-price" type="number" inputmode="decimal" placeholder="السعر" />
            </div>
            <div class="field">
              <input id="credit-article-qty" type="number" inputmode="numeric" placeholder="الكمية" value="1" />
            </div>
            <button id="btn-credit-add-item" class="add" type="button">إضافة المقال</button>
            <div id="credit-items" class="items-list"></div>
            <div class="summary">
              <div>المجموع :</div>
              <div id="credit-total">0 درهم</div>
            </div>
            <button id="btn-credit-save" class="save" type="button">تسجيل</button>
          </form>
        </section>

        <!-- EXPENSE -->
        <section id="screen-expense" class="screen" aria-label="مصروف">
          <header class="topbar">
            <button id="btn-back-credit-from-expense" class="iconbtn" type="button">
              <img src="assets/icons/back click.png" alt="رجوع" class="icon" />
            </button>
            <h1>مصروف</h1>
            <button id="btn-invalide" class="iconbtn" type="button">
              <img src="assets/icons/next no click.png" alt="" class="icon" />
            </button>
          </header>
          <form id="form-expense" class="form">
            <div class="field">
              <h2>المصاريف :</h2>
              <input id="expense-type" type="text" placeholder="نوع المصروف" />
            </div>
            <div class="field">
              <input id="expense-amount" type="number" inputmode="decimal" placeholder="المبلغ" />
            </div>
            <div class="field">
              <textarea id="expense-notes" placeholder="ملاحظات..."></textarea>
            </div>
            <button id="go-add-expense" class="addexpense" type="button">+ إضافة نوع مصروف آخر</button>
            <button id="btn-expense-save" class="save" type="button">تسجيل</button>
          </form>
        </section>

        <!-- CLIENTS -->
        <section id="screen-clients" class="screen" aria-label="الزبائن">
          <header class="topbar">
            <h1>الزبائن</h1>
          </header>
          <h4 id="clients-summary">0 زبون • الدين الإجمالي : 0 درهم</h4>
          <div class="searchbar">
            <input id="clients-search" type="text" placeholder="أدخل اسم الزبون :" />
            <img src="assets/Icons/search.png" alt="بحث" width="20px" />
          </div>
          <div id="clients-list" class="clients-list"></div>
          <button id="go-add-client" class="addclient" type="button">+ إضافة زبون</button>
        </section>

        <!-- ADD CLIENT -->
        <section id="screen-add-client" class="screen" aria-label="إضافة زبون">
          <header class="topbar">
            <h1>إضافة زبون</h1>
          </header>
          <form id="form-add-client" class="form" enctype="multipart/form-data">
            <div class="field">
              <label class="label" for="client-name">الاسم الكامل</label>
              <input id="client-name" type="text" placeholder="أدخل اسم الزبون الكامل" required />
            </div>
            <div class="field">
              <label class="label" for="client-phone">رقم الهاتف</label>
              <input id="client-phone" type="tel" placeholder="أدخل رقم هاتف الزبون" required />
            </div>
            <div class="field">
              <label class="label" for="client-limit">حد الدين</label>
              <input id="client-limit" type="number" inputmode="decimal" placeholder="أدخل حد دين الزبون" />
            </div>
            <div class="field">
              <label class="label" for="client-image">صورة الزبون</label>
              <input type="file" id="client-image" accept="image/*" />
            </div>
            <button id="btn-save-client" class="save" type="button">حفظ الزبون</button>
          </form>
        </section>

        <!-- EDIT CLIENT -->
        <section id="screen-edit-client" class="screen" aria-label="تعديل الزبون">
          <header class="topbar">
            <h1>تعديل الزبون</h1>
          </header>
          <form id="form-edit-client" class="form" style="margin-top: 70px;">
            <div class="field">
              <label class="label" for="edit-client-name">الاسم الكامل</label>
              <input id="edit-client-name" type="text" placeholder="الاسم الكامل للزبون" required />
            </div>
            <div class="field">
              <label class="label" for="edit-client-phone">رقم الهاتف</label>
              <input id="edit-client-phone" type="tel" placeholder="رقم الهاتف" required />
            </div>
            <div class="field">
              <label class="label" for="edit-client-limit">حد الدين</label>
              <input id="edit-client-limit" type="number" inputmode="decimal" placeholder="حد الدين" />
            </div>
            <button id="btn-update-client" class="save" type="button">حفظ التعديلات</button>
            <button id="btn-cancel-edit-client" class="save" type="button" style="background-color: #6B7280; margin-top: 10px;">إلغاء</button>
          </form>
        </section>

        <!-- REPORTS -->
        <section id="screen-reports" class="screen" aria-label="التقارير">
          <header class="topbar">
            <h1 id="reports-title">التقارير</h1>
          </header>
          <div id="reports-container" class="reports-container">
            <div id="report-period-card" class="report-card report-period">
              <h2 id="report-period-title">التاريخ</h2>
              <p id="report-date">اليوم - 21 سبتمبر 2026</p>
            </div>
            <div id="report-summary-card" class="report-card report-summary">
              <h2 id="report-summary-title">ملخص اليوم</h2>
              <div id="report-stats" class="report-stats">
                <div id="report-cash-card" class="mini-stat cash">
                  <span id="report-cash-label">مبيعات نقدية</span>
                  <strong id="report-cash-value">0 درهم</strong>
                </div>
                <div id="report-credit-card" class="mini-stat credit">
                  <span id="report-credit-label">مبيعات بالدين</span>
                  <strong id="report-credit-value">0 درهم</strong>
                </div>
                <div id="report-expense-card" class="mini-stat expense">
                  <span id="report-expense-label">المصاريف</span>
                  <strong id="report-expense-value">0 درهم</strong>
                </div>
                <div id="report-profit-card" class="mini-stat profit">
                  <span id="report-profit-label">الربح الصافي</span>
                  <strong id="report-profit-value">0 درهم</strong>
                </div>
              </div>
            </div>
            <div id="report-transactions-card" class="report-card report-transactions">
              <h2 id="report-transactions-title">معاملات اليوم</h2>
              <div id="report-transactions-list" class="report-list"></div>
            </div>
            <div id="report-clients-card" class="report-card report-clients-credit">
              <h2 id="report-clients-title">زبائن الدين</h2>
              <div id="report-clients-list" class="report-list"></div>
            </div>
            <div id="report-balance-card" class="report-card report-balance">
              <h2 id="report-balance-title">الحصيلة النهائية</h2>
              <div class="balance-line">
                <span id="report-total-cash-label">إجمالي المقبوضات اليوم</span>
                <strong id="report-total-cash-value">0 درهم</strong>
              </div>
              <div class="balance-line">
                <span id="report-total-debt-label">إجمالي الديون النشطة</span>
                <strong id="report-total-debt-value">0 درهم</strong>
              </div>
              <button id="btn-export-report" type="button">تصدير التقرير</button>
            </div>
            <div id="report-export-card" class="report-card report-balance" style="margin-top: 16px;">
              <h2>تصدير التقرير</h2>
              <div class="balance-line">
                <span>اختر تاريخ</span>
                <input type="date" id="report-export-date" style="border:none;background:transparent;font-family:var(--font-primary);font-size:var(--fs-body);color:var(--c-first-body-text);font-weight:var(--fw-button-md);cursor:pointer;" />
              </div>
              <button id="btn-export-pdf" type="button" class="report-export-btn">تصدير PDF</button>
            </div>
          </div>
        </section>

        <!-- PROFILE -->
        <section id="screen-profile" class="screen" aria-label="الملف الشخصي">
          <header class="topbar">
            <h1>الملف الشخصي</h1>
          </header>
          <div id="profile-container" class="profile-container">
            <div class="profile-header-card">
              <div class="profile-image-wrap">
                <img id="profile-avatar" src="assets/Icons/user.png" alt="صورة المستخدم" class="profile-avatar" />
              </div>
              <h2 id="profile-display-name"><?php echo htmlspecialchars($user["name"] ?? "المستخدم", ENT_QUOTES, "UTF-8"); ?></h2>
              <p id="profile-role">مدير • <?php echo htmlspecialchars($user["email"] ?? "جيبي", ENT_QUOTES, "UTF-8"); ?></p>
            </div>

            <div class="profile-group">
              <button id="btn-profile-status" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">●</span>
                  <span>حالة النشاط</span>
                </div>
                <div class="profile-item-right">
                  <span id="profile-status-text" class="status-active">نشط</span>
                  <span class="profile-arrow">‹</span>
                </div>
              </button>
            </div>

            <div class="profile-section-title">تخصيص</div>
            <div class="profile-group">
              <button id="btn-profile-personal-details" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">👤</span>
                  <span>المعلومات الشخصية</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
              <button id="btn-profile-store-details" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">🏪</span>
                  <span>معلومات المتجر</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
              <button id="btn-profile-settings" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">⚙</span>
                  <span>الإعدادات</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
            </div>

            <div class="profile-section-title">هل تحتاج مساعدة ؟</div>
            <div class="profile-group">
              <button id="btn-profile-tips" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">✦</span>
                  <span>نصائح وحيل</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
              <button id="btn-profile-faq" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">?</span>
                  <span>الأسئلة الشائعة</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
              <button id="btn-profile-contact" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">✉</span>
                  <span>التواصل معنا</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
            </div>

            <div class="profile-section-title">البيانات</div>
            <div class="profile-group">
              <button id="btn-profile-backup" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">⬆</span>
                  <span>حفظ البيانات</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
              <button id="btn-profile-export" class="profile-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">⤓</span>
                  <span>تصدير التقارير</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
              <button id="btn-profile-logout" class="profile-item danger-item" type="button">
                <div class="profile-item-left">
                  <span class="profile-item-icon">⎋</span>
                  <span>تسجيل الخروج</span>
                </div>
                <span class="profile-arrow">‹</span>
              </button>
            </div>
          </div>
        </section>

        <!-- PERSONAL DETAILS -->
        <section id="screen-personal-details" class="screen" aria-label="المعلومات الشخصية">
          <header class="topbar">
            <button class="btn-back" id="btn-back-personal">›</button>
            <h1>المعلومات الشخصية</h1>
          </header>
          <div class="profile-details-card" style="margin-top:70px;">
            <div class="profile-detail-row">
              <span class="profile-detail-label">الاسم الكامل</span>
              <span class="profile-detail-value" id="personal-name">--</span>
            </div>
            <div class="profile-detail-row">
              <span class="profile-detail-label">البريد الإلكتروني</span>
              <span class="profile-detail-value" id="personal-email">--</span>
            </div>
            <div class="profile-detail-row">
              <span class="profile-detail-label">الدور</span>
              <span class="profile-detail-value">مدير</span>
            </div>
          </div>
        </section>

        <!-- COMMERCE DETAILS -->
        <section id="screen-commerce-details" class="screen" aria-label="معلومات المتجر">
          <header class="topbar">
            <button class="btn-back" id="btn-back-commerce">›</button>
            <h1>معلومات المتجر</h1>
          </header>
          <div style="margin-top:70px; padding: 0 20px;">
            <div class="field">
              <label class="label" for="commerce-nom">اسم المتجر</label>
              <input id="commerce-nom" type="text" placeholder="مثال: بقالة الأمل" />
            </div>
            <div class="field">
              <label class="label" for="commerce-adresse">العنوان</label>
              <input id="commerce-adresse" type="text" placeholder="مثال: شارع الحسن الثاني، الرباط" />
            </div>
            <div class="field">
              <label class="label" for="commerce-telephone">الهاتف</label>
              <input id="commerce-telephone" type="tel" placeholder="مثال: 0612345678" />
            </div>
            <button id="btn-save-commerce" class="save" type="button">حفظ</button>
          </div>
        </section>

        <!-- PARAMETRES -->
        <section id="screen-parametres" class="screen" aria-label="الإعدادات">
          <header class="topbar">
            <button class="btn-back" id="btn-back-parametres">›</button>
            <h1>الإعدادات</h1>
          </header>
          <div style="margin-top:70px; padding: 0 20px;">
            <p class="profile-section-label">اللغة</p>
            <div class="profile-menu-card">
              <div class="profile-menu-item" id="btn-lang-fr">
                <span>🇫🇷 Français</span>
                <span class="lang-check" id="check-fr"></span>
              </div>
              <div class="profile-menu-item" id="btn-lang-ar">
                <span>🇲🇦 العربية</span>
                <span class="lang-check" id="check-ar">✓</span>
              </div>
            </div>
          </div>
        </section>

        <!-- TIPS -->
        <section id="screen-tips" class="screen" aria-label="نصائح وحيل">
          <header class="topbar">
            <button class="btn-back" id="btn-back-tips">›</button>
            <h1>نصائح وحيل</h1>
          </header>
          <div style="margin-top:70px; padding: 0 20px;">
            <div class="tip-card">
              <span class="tip-icon">💡</span>
              <div>
                <p class="tip-title">سجّل كل بيعة فوراً</p>
                <p class="tip-desc">لا تتراكم المبيعات غير المسجلة. أدخل كل معاملة فور حدوثها للحصول على تقرير دقيق.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-icon">👥</span>
              <div>
                <p class="tip-title">تابع زبائن الدين بانتظام</p>
                <p class="tip-desc">راجع قائمة المدينين في التقارير بانتظام. ذكّر زبائنك فور تجاوز دينهم للحد المحدد.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-icon">📊</span>
              <div>
                <p class="tip-title">راجع تقريرك كل مساء</p>
                <p class="tip-desc">اجعل مراجعة تقرير اليوم عادة يومية قبل الإغلاق. ستتمكن من كشف الأخطاء وتتبع تقدمك.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-icon">💰</span>
              <div>
                <p class="tip-title">سجّل جميع المصاريف</p>
                <p class="tip-desc">حتى المصاريف الصغيرة مهمة. بتسجيلها كلها سيكون ربحك المحسوب أكثر دقة.</p>
              </div>
            </div>
            <div class="tip-card">
              <span class="tip-icon">💾</span>
              <div>
                <p class="tip-title">احفظ بياناتك بانتظام</p>
                <p class="tip-desc">صدّر ملف CSV مرة في الأسبوع. في حالة أي مشكل تقني لن تفقد شيئاً.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section id="screen-faq" class="screen" aria-label="الأسئلة الشائعة">
          <header class="topbar">
            <button class="btn-back" id="btn-back-faq">›</button>
            <h1>الأسئلة الشائعة</h1>
          </header>
          <div style="margin-top:70px; padding: 0 20px;" id="faq-list">
            <div class="faq-item">
              <button class="faq-question" onclick="toggleFaq(this)">
                كيف أضيف زبوناً ؟ <span class="faq-arrow">‹</span>
              </button>
              <p class="faq-answer hidden">اذهب إلى شاشة الزبائن، اضغط على زر + في الأسفل، أدخل الاسم والهاتف وحد الدين، ثم احفظ.</p>
            </div>
            <div class="faq-item">
              <button class="faq-question" onclick="toggleFaq(this)">
                كيف أسجل بيعة بالدين ؟ <span class="faq-arrow">‹</span>
              </button>
              <p class="faq-answer hidden">اذهب إلى شاشة البيع بالدين، أضف المقالات، اختر الزبون من القائمة، ثم اضغط تسجيل. سيتم تحديث دين الزبون تلقائياً.</p>
            </div>
            <div class="faq-item">
              <button class="faq-question" onclick="toggleFaq(this)">
                كيف أسجل دفع زبون ؟ <span class="faq-arrow">‹</span>
              </button>
              <p class="faq-answer hidden">اذهب إلى الزبائن، اضغط على الزبون المعني، ثم اضغط "الزبون يريد الدفع". أدخل المبلغ وأكد.</p>
            </div>
            <div class="faq-item">
              <button class="faq-question" onclick="toggleFaq(this)">
                أين أجد ربح اليوم ؟ <span class="faq-arrow">‹</span>
              </button>
              <p class="faq-answer hidden">في شاشة التقارير ستجد الربح محسوباً تلقائياً: إجمالي المبيعات ناقص إجمالي المصاريف.</p>
            </div>
            <div class="faq-item">
              <button class="faq-question" onclick="toggleFaq(this)">
                كيف أصدّر بياناتي ؟ <span class="faq-arrow">‹</span>
              </button>
              <p class="faq-answer hidden">اذهب إلى الملف الشخصي ← البيانات ← حفظ البيانات لتحميل ملف CSV، أو تصدير التقارير للحصول على PDF.</p>
            </div>
            <div class="faq-item">
              <button class="faq-question" onclick="toggleFaq(this)">
                كيف أعدّل معلومات متجري ؟ <span class="faq-arrow">‹</span>
              </button>
              <p class="faq-answer hidden">اذهب إلى الملف الشخصي ← تخصيص ← معلومات المتجر. عدّل المعلومات واضغط حفظ.</p>
            </div>
          </div>
        </section>

        <!-- CONTACT -->
        <section id="screen-contact" class="screen" aria-label="التواصل معنا">
          <header class="topbar">
            <button class="btn-back" id="btn-back-contact">›</button>
            <h1>التواصل معنا</h1>
          </header>
          <div style="margin-top:70px; padding: 0 20px;">
            <div class="contact-card">
              <div class="contact-row">
                <span class="contact-icon">✉️</span>
                <div>
                  <p class="contact-label">البريد الإلكتروني للدعم</p>
                  <a class="contact-value" href="mailto:kiom25982@gmail.com">kiom25982@gmail.com</a>
                </div>
              </div>
              <div class="contact-row">
                <span class="contact-icon">📞</span>
                <div>
                  <p class="contact-label">هاتف الدعم</p>
                  <a class="contact-value" href="tel:0609763680">0609763680</a>
                </div>
              </div>
            </div>
            <p class="contact-note">متاح من الاثنين إلى الجمعة، 9ص - 6م</p>
          </div>
        </section>

      </main>

      <!-- BOTTOM NAV -->
      <nav class="bottom-nav" aria-label="التنقل الرئيسي">
        <button class="nav-item is-active" type="button" aria-label="الرئيسية">
          <img class="nav-icon icon-default" src="assets/Icons/home no click.png" alt="الرئيسية" />
          <img class="nav-icon icon-active" src="assets/Icons/home click.png" alt="الرئيسية" />
          <span class="nav-label">الرئيسية</span>
        </button>
        <button class="nav-item" type="button" aria-label="المبيعات">
          <img class="nav-icon icon-default" src="assets/Icons/bloc-notes no click.png" alt="المبيعات" />
          <img class="nav-icon icon-active" src="assets/Icons/bloc-notes click.png" alt="المبيعات" />
          <span class="nav-label">المبيعات</span>
        </button>
        <button class="nav-item" type="button" aria-label="الزبائن">
          <img class="nav-icon icon-default" src="assets/Icons/customers no click.png" alt="الزبائن" />
          <img class="nav-icon icon-active" src="assets/Icons/customers click.png" alt="الزبائن" />
          <span class="nav-label">الزبائن</span>
        </button>
        <button class="nav-item" type="button" aria-label="التقارير">
          <img class="nav-icon icon-default" src="assets/Icons/rapport no click.png" alt="التقارير" />
          <img class="nav-icon icon-active" src="assets/Icons/rapport click.png" alt="التقارير" />
          <span class="nav-label">التقارير</span>
        </button>
        <button class="nav-item" type="button" aria-label="الملف الشخصي">
          <img class="nav-icon icon-default" src="assets/Icons/user no click.png" alt="الملف الشخصي" />
          <img class="nav-icon icon-active" src="assets/Icons/user click.png" alt="الملف الشخصي" />
          <span class="nav-label">الملف</span>
        </button>
      </nav>

      <!-- OVERLAY -->
      <div id="overlay" class="overlay hidden" aria-hidden="true">
        <div class="overlay-backdrop" id="overlay-close-area"></div>
        <div class="overlay-content" role="dialog" aria-modal="true">

          <!-- CLIENT INFO -->
          <div id="overlay-client-info" class="overlay-panel hidden">
            <div class="card-ui client-info-card">
              <div class="card-header">
                <div class="header-top"></div>
                <div class="header-accent"></div>
                <img id="overlay-client-img" class="avatar" src="assets/Icons/user.png" alt="صورة الزبون" />
              </div>
              <h2 id="overlay-client-name" class="title">الزبون</h2>
              <div class="client-info-list">
                <div class="client-info-row">
                  <p class="info-label">الرقم</p>
                  <p id="overlay-client-id" class="info-value">: --</p>
                </div>
                <div class="client-info-row">
                  <p class="info-label">رقم الهاتف</p>
                  <p id="overlay-client-phone" class="info-value">: --</p>
                </div>
                <div class="client-info-row">
                  <p class="info-label">حد الدين</p>
                  <p id="overlay-client-limit" class="info-value">: --</p>
                </div>
                <div class="client-info-row">
                  <p class="info-label">المستهلك هذا الشهر</p>
                  <p id="overlay-client-consumed" class="info-value">: --</p>
                </div>
                <div class="client-info-row">
                  <p class="info-label">المدفوع</p>
                  <p id="overlay-client-paid" class="info-value">: --</p>
                </div>
                <div class="client-info-row">
                  <p class="info-label">المتبقي</p>
                  <p id="overlay-client-remaining" class="info-value">: --</p>
                </div>
              </div>
              <div class="client-actions">
                <button id="btn-open-payment" class="btn-primary" type="button">الزبون يريد الدفع</button>
                <button id="btn-open-report" class="btn-secondary" type="button">تقرير اليوم</button>
                <button id="btn-edit-client" class="btn-secondary" type="button">تعديل الزبون</button>
                <button id="btn-delete-client" class="btn-danger" type="button">حذف الزبون</button>
                <button id="btn-overlay-close-1" class="btn-ghost" type="button">إغلاق</button>
              </div>
            </div>
          </div>

          <!-- PAYMENT -->
          <div id="overlay-payment" class="overlay-panel hidden">
            <div class="card-ui payment-card">
              <div class="card-header">
                <div class="header-top"></div>
                <div class="header-accent"></div>
                <img id="payment-client-img" class="avatar" src="assets/Icons/user.png" alt="صورة الزبون" />
              </div>
              <h2 id="payment-client-name" class="title">الزبون</h2>
              <div class="payment-summary">
                <p class="payment-caption">المتبقي للدفع :</p>
                <h3 id="payment-remaining" class="payment-amount">0 درهم</h3>
              </div>
              <div class="payment-form-block">
                <label class="payment-label" for="payment-amount">المبلغ</label>
                <input id="payment-amount" class="payment-input" type="number" inputmode="decimal" placeholder="أدخل المبلغ الذي يريد الزبون دفعه" />
              </div>
              <div class="payment-actions">
                <button id="btn-payment-save" class="btn-primary" type="button">تسجيل الدفع</button>
                <button id="btn-overlay-close-2" class="btn-ghost" type="button">إغلاق</button>
              </div>
            </div>
          </div>

          <!-- REPORT OVERLAY -->
          <div id="overlay-report" class="overlay-panel hidden">
            <div class="card-ui overlay-report-card">
              <div class="overlay-report-header">
                <div class="overlay-report-header-top"></div>
                <div class="overlay-report-header-accent"></div>
                <img id="overlay-report-client-img" class="overlay-report-avatar" src="assets/Icons/user.png" alt="صورة الزبون" />
              </div>
              <div class="overlay-report-heading">
                <h2 class="overlay-report-title">تقرير <span id="overlay-report-client-name">الزبون</span></h2>
                <p id="overlay-report-date" class="overlay-report-date">--</p>
              </div>
              <p class="overlay-report-time-text">المقالات المشتراة (<span id="overlay-report-time">--:--</span>)</p>
              <div class="overlay-report-items-wrap">
                <div id="overlay-report-items-list"></div>
                <div class="overlay-report-total-row">
                  <strong>المجموع</strong>
                  <strong id="overlay-report-total">0 درهم</strong>
                </div>
              </div>
              <div class="overlay-report-pay">
                <p>إجمالي المستحق :</p>
                <h3 id="overlay-report-to-pay">0 درهم</h3>
              </div>
              <button id="btn-overlay-close-3" class="overlay-report-close-btn" type="button">إغلاق</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <script>
    window.JIBI_SESSION = {
      isLoggedIn: <?php echo $isLoggedIn ? "true" : "false"; ?>,
      user: <?php echo json_encode($user, JSON_UNESCAPED_UNICODE); ?>
    };
  </script>
  <script type="module" src="js/main.js"></script>
  <script>
    window.addEventListener("load", function () {
      if (!window.JIBI_SESSION || !window.JIBI_SESSION.isLoggedIn) return;
      setTimeout(function () {
        document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
        var home = document.getElementById("screen-home");
        if (home) home.classList.add("active");
        var navButtons = document.querySelectorAll(".bottom-nav .nav-item");
        navButtons.forEach(function (btn) { btn.classList.remove("is-active"); });
        if (navButtons[0]) navButtons[0].classList.add("is-active");
      }, 1700);
    });
  </script>
  <script>
    function toggleFaq(btn) {
      const answer = btn.nextElementSibling;
      const arrow  = btn.querySelector(".faq-arrow");
      answer.classList.toggle("hidden");
      arrow.style.transform = answer.classList.contains("hidden") ? "rotate(0deg)" : "rotate(90deg)";
    }
  </script>
</body>
</html>