# 📊 Sơ Đồ Phân Tích & Thiết Kế Hệ Thống PHIHub

> Tài liệu này trình bày các sơ đồ UML 2.5 cho hệ thống PHIHub - Personal Health Intelligence Hub

---

## 📋 Mục Lục

1. [Sơ đồ Use Case (Use Case Diagram)](#1-sơ-đồ-use-case-use-case-diagram)
2. [Sơ đồ Thực thể kết hợp (ERD)](#2-sơ-đồ-thực-thể-kết-hợp-erd)
3. [Sơ đồ Tuần tự (Sequence Diagram)](#3-sơ-đồ-tuần-tự-sequence-diagram)
4. [Sơ đồ Hoạt động (Activity Diagram)](#4-sơ-đồ-hoạt-động-activity-diagram)
5. [Sơ đồ Lớp (Class Diagram)](#5-sơ-đồ-lớp-class-diagram)
6. [Sơ đồ Kiến trúc MERN Stack](#6-sơ-đồ-kiến-trúc-mern-stack)
7. [Sơ đồ Triển khai Docker (Deployment Diagram)](#7-sơ-đồ-triển-khai-docker-deployment-diagram)

---

## 1. Sơ đồ Use Case (Use Case Diagram)

### 1.1 Sơ đồ Use Case Tổng Quát

```plantuml
@startuml PHIHub_UseCase_General
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome

actor "Người dùng\n(User)" as User
actor "Quản trị viên\n(Admin)" as Admin

rectangle "Hệ thống PHIHub" {
    ' Authentication
    package "Xác thực" {
        usecase "Đăng ký tài khoản" as UC1
        usecase "Đăng nhập" as UC2
        usecase "Đăng xuất" as UC3
        usecase "Quên mật khẩu" as UC4
    }
    
    ' Profile Management
    package "Quản lý Hồ sơ" {
        usecase "Xem hồ sơ cá nhân" as UC5
        usecase "Cập nhật thông tin cơ bản" as UC6
        usecase "Cập nhật thông tin y tế" as UC7
        usecase "Thay đổi avatar" as UC8
    }
    
    ' Health Metrics
    package "Quản lý Chỉ số Sức khỏe" {
        usecase "Nhập chỉ số sức khỏe" as UC9
        usecase "Xem lịch sử chỉ số" as UC10
        usecase "Xem biểu đồ thống kê" as UC11
        usecase "Xuất dữ liệu CSV" as UC12
    }
    
    ' Goals
    package "Quản lý Mục tiêu" {
        usecase "Tạo mục tiêu mới" as UC13
        usecase "Theo dõi tiến độ" as UC14
        usecase "Cập nhật mục tiêu" as UC15
        usecase "Xóa mục tiêu" as UC16
    }
    
    ' Nutrition
    package "Theo dõi Dinh dưỡng" {
        usecase "Ghi nhật ký bữa ăn" as UC17
        usecase "Xem thống kê dinh dưỡng" as UC18
        usecase "Tính toán macros" as UC19
    }
    
    ' Mood
    package "Nhật ký Tâm trạng" {
        usecase "Ghi nhật ký tâm trạng" as UC20
        usecase "Xem xu hướng tâm trạng" as UC21
    }
    
    ' Knowledge
    package "Góc Kiến thức" {
        usecase "Xem danh sách bài viết" as UC22
        usecase "Đọc chi tiết bài viết" as UC23
        usecase "Tìm kiếm bài viết" as UC24
    }
    
    ' Recommendations
    package "Tư vấn Thông minh" {
        usecase "Nhận khuyến nghị sức khỏe" as UC25
        usecase "Xem cảnh báo sức khỏe" as UC26
    }
    
    ' Reminders
    package "Nhắc nhở" {
        usecase "Tạo nhắc nhở" as UC27
        usecase "Quản lý nhắc nhở" as UC28
    }
    
    ' Admin Functions
    package "Quản trị Hệ thống" {
        usecase "Quản lý bài viết" as UC29
        usecase "Quản lý người dùng" as UC30
        usecase "Xem thống kê hệ thống" as UC31
    }
}

' User relationships
User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7
User --> UC8
User --> UC9
User --> UC10
User --> UC11
User --> UC12
User --> UC13
User --> UC14
User --> UC15
User --> UC16
User --> UC17
User --> UC18
User --> UC19
User --> UC20
User --> UC21
User --> UC22
User --> UC23
User --> UC24
User --> UC25
User --> UC26
User --> UC27
User --> UC28

' Admin relationships (inherits User functions)
Admin --|> User
Admin --> UC29
Admin --> UC30
Admin --> UC31

' Include/Extend relationships
UC9 ..> UC25 : <<include>>
UC9 ..> UC26 : <<include>>
UC11 <.. UC10 : <<extend>>

@enduml
```

### 1.2 Sơ đồ Use Case Chi Tiết - Quản lý Chỉ số Sức khỏe

```plantuml
@startuml PHIHub_UseCase_HealthMetrics
left to right direction
skinparam packageStyle rectangle

actor "Người dùng" as User

rectangle "Quản lý Chỉ số Sức khỏe" {
    usecase "Nhập chỉ số sức khỏe" as UC1
    usecase "Nhập cân nặng" as UC1_1
    usecase "Nhập huyết áp" as UC1_2
    usecase "Nhập nhịp tim" as UC1_3
    usecase "Nhập giấc ngủ" as UC1_4
    usecase "Nhập bước chân" as UC1_5
    usecase "Nhập đường huyết" as UC1_6
    usecase "Nhập lượng nước" as UC1_7
    usecase "Nhập thời gian tập luyện" as UC1_8
    
    usecase "Xem lịch sử chỉ số" as UC2
    usecase "Lọc theo loại chỉ số" as UC2_1
    usecase "Lọc theo khoảng thời gian" as UC2_2
    usecase "Xem dạng bảng" as UC2_3
    usecase "Xem dạng biểu đồ" as UC2_4
    
    usecase "Xuất dữ liệu" as UC3
    usecase "Xuất CSV" as UC3_1
    
    usecase "Xóa chỉ số" as UC4
    
    usecase "Tính toán BMI tự động" as UC5
    usecase "Phân tích xu hướng" as UC6
    usecase "Tạo cảnh báo tự động" as UC7
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4

' Generalization (Nhập chỉ số)
UC1_1 --|> UC1
UC1_2 --|> UC1
UC1_3 --|> UC1
UC1_4 --|> UC1
UC1_5 --|> UC1
UC1_6 --|> UC1
UC1_7 --|> UC1
UC1_8 --|> UC1

' Include relationships
UC1 ..> UC5 : <<include>>
UC2 ..> UC6 : <<include>>
UC1 ..> UC7 : <<include>>

' Extend relationships
UC2_1 <.. UC2 : <<extend>>
UC2_2 <.. UC2 : <<extend>>
UC2_3 <.. UC2 : <<extend>>
UC2_4 <.. UC2 : <<extend>>
UC3_1 <.. UC3 : <<extend>>

@enduml
```

---

## 2. Sơ đồ Thực thể kết hợp (ERD)

### 2.1 ERD - Entity Relationship Diagram (MongoDB Collections)

```plantuml
@startuml PHIHub_ERD
skinparam linetype ortho

entity "users" as Users {
    * _id : ObjectId <<PK>>
    --
    * name : String
    * email : String <<unique>>
    * password : String (hashed)
    dob : Date
    gender : String
    avatar : String
    phone : String
    address : String
    --
    medicalInfo : Object
    ├── height : Number
    ├── bloodType : String
    ├── chronicConditions : Array
    ├── allergies : Array
    ├── medications : Array
    ├── emergencyContact : Object
    └── doctor : Object
    --
    createdAt : Date
    updatedAt : Date
}

entity "health_metrics" as HealthMetrics {
    * _id : ObjectId <<PK>>
    --
    * userId : ObjectId <<FK>>
    * metricType : String
    * value : Number
    * unit : String
    timestamp : Date
    notes : String
    metadata : Map
    --
    createdAt : Date
    updatedAt : Date
}

entity "goals" as Goals {
    * _id : ObjectId <<PK>>
    --
    * userId : ObjectId <<FK>>
    * title : String
    description : String
    * goalType : String
    * targetValue : Number
    startValue : Number
    currentValue : Number
    * unit : String
    startDate : Date
    * targetDate : Date
    status : String
    progress : Number
    milestones : Array
    --
    createdAt : Date
    updatedAt : Date
}

entity "articles" as Articles {
    * _id : ObjectId <<PK>>
    --
    * title : String
    * content : String
    * category : String
    excerpt : String
    imageUrl : String
    source : String
    publishedAt : Date
    views : Number
    --
    createdAt : Date
    updatedAt : Date
}

entity "nutrition_logs" as NutritionLogs {
    * _id : ObjectId <<PK>>
    --
    * userId : ObjectId <<FK>>
    * date : Date
    * mealType : String
    foodItems : Array
    ├── name : String
    ├── quantity : Number
    ├── unit : String
    ├── calories : Number
    └── macros : Object
    totalCalories : Number
    totalProtein : Number
    totalCarbs : Number
    totalFat : Number
    notes : String
    --
    createdAt : Date
    updatedAt : Date
}

entity "mood_logs" as MoodLogs {
    * _id : ObjectId <<PK>>
    --
    * userId : ObjectId <<FK>>
    * date : Date
    * mood : String
    * moodScore : Number
    energy : String
    energyScore : Number
    stress : String
    stressScore : Number
    anxiety : Number
    activities : Array
    emotions : Array
    journal : String
    gratitude : Array
    --
    createdAt : Date
    updatedAt : Date
}

entity "reminders" as Reminders {
    * _id : ObjectId <<PK>>
    --
    * userId : ObjectId <<FK>>
    * title : String
    * message : String
    * type : String
    * frequency : String
    * time : String
    days : Array
    startDate : Date
    endDate : Date
    enabled : Boolean
    lastTriggered : Date
    nextTrigger : Date
    --
    createdAt : Date
    updatedAt : Date
}

entity "alerts" as Alerts {
    * _id : ObjectId <<PK>>
    --
    * userId : ObjectId <<FK>>
    * type : String
    * category : String
    * title : String
    * message : String
    * severity : String
    metricType : String
    metricValue : Number
    threshold : Object
    isRead : Boolean
    isResolved : Boolean
    resolvedAt : Date
    --
    createdAt : Date
    updatedAt : Date
}

' Relationships
Users ||--o{ HealthMetrics : "1:N"
Users ||--o{ Goals : "1:N"
Users ||--o{ NutritionLogs : "1:N"
Users ||--o{ MoodLogs : "1:N"
Users ||--o{ Reminders : "1:N"
Users ||--o{ Alerts : "1:N"

note right of HealthMetrics
    metricType:
    - weight, height, bmi
    - bloodPressure, heartRate
    - sleep, sleepQuality
    - steps, exercise, calories
    - water, bloodSugar
end note

note right of Goals
    status:
    - active
    - completed
    - failed
    - cancelled
end note

note right of NutritionLogs
    mealType:
    - breakfast
    - lunch
    - dinner
    - snack
end note

@enduml
```

---

## 3. Sơ đồ Tuần tự (Sequence Diagram)

### 3.1 Luồng Đăng nhập (Login Flow)

```plantuml
@startuml PHIHub_Sequence_Login
skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

actor "Người dùng" as User
participant "React\nFrontend" as React
participant "Express\nBackend" as Express
database "MongoDB" as DB

User -> React : Nhập email & password
activate React

React -> Express : POST /api/auth/login\n{email, password}
activate Express

Express -> DB : findOne({email})
activate DB
DB --> Express : User document
deactivate DB

alt Không tìm thấy user
    Express --> React : 401 Unauthorized\n"Email không tồn tại"
    React --> User : Hiển thị lỗi
else Tìm thấy user
    Express -> Express : bcrypt.compare(password, hash)
    
    alt Mật khẩu sai
        Express --> React : 401 Unauthorized\n"Mật khẩu không đúng"
        React --> User : Hiển thị lỗi
    else Mật khẩu đúng
        Express -> Express : Tạo JWT token
        Express --> React : 200 OK\nSet-Cookie: token (HttpOnly)\n{user data}
        React -> React : Lưu user vào AuthContext
        React --> User : Chuyển đến Dashboard
    end
end

deactivate Express
deactivate React

@enduml
```

### 3.2 Luồng Nhập Chỉ số Cân nặng và Nhận Tư vấn

```plantuml
@startuml PHIHub_Sequence_Weight
skinparam sequenceMessageAlign center

actor "Người dùng" as User
participant "React\nFrontend" as React
participant "Express\nBackend" as Express
participant "Recommendation\nService" as RecService
database "MongoDB" as DB

User -> React : Nhập cân nặng (70 kg)
activate React

React -> Express : POST /api/metrics\n{metricType: "weight", value: 70, unit: "kg"}
activate Express

Express -> Express : Xác thực JWT token

Express -> DB : Lấy chiều cao từ User
activate DB
DB --> Express : height = 170 cm
deactivate DB

Express -> Express : Tính BMI = 70 / (1.7^2) = 24.2

Express -> DB : Lưu weight metric
activate DB
DB --> Express : OK
deactivate DB

Express -> DB : Lưu BMI metric (tự động)
activate DB
DB --> Express : OK
deactivate DB

Express -> RecService : generateRecommendations(userId)
activate RecService

RecService -> DB : Lấy metrics 7 ngày gần nhất
activate DB
DB --> RecService : [weight, bmi, sleep, ...]
deactivate DB

RecService -> RecService : Chạy json-rules-engine\n(15 health rules)

alt BMI >= 25 (Thừa cân)
    RecService -> DB : Tạo Alert (warning)\n"Chỉ số BMI cao"
    RecService -> RecService : Tạo recommendation\n"Nên tăng cường vận động"
else BMI < 18.5 (Thiếu cân)
    RecService -> DB : Tạo Alert (warning)\n"Chỉ số BMI thấp"
    RecService -> RecService : Tạo recommendation\n"Nên bổ sung dinh dưỡng"
else BMI bình thường
    RecService -> RecService : Tạo recommendation\n"Duy trì lối sống lành mạnh"
end

RecService --> Express : recommendations[]
deactivate RecService

Express --> React : 201 Created\n{metric, bmi, recommendations}
deactivate Express

React -> React : Cập nhật Dashboard\nHiển thị biểu đồ mới

React --> User : Hiển thị kết quả\n+ Khuyến nghị sức khỏe

deactivate React

@enduml
```

### 3.3 Luồng Xem Biểu đồ Thống kê

```plantuml
@startuml PHIHub_Sequence_Chart
skinparam sequenceMessageAlign center

actor "Người dùng" as User
participant "React\nFrontend" as React
participant "Express\nBackend" as Express
database "MongoDB" as DB

User -> React : Truy cập Dashboard
activate React

React -> Express : GET /api/metrics?metricType=weight&days=30
activate Express

Express -> Express : Xác thực JWT token

Express -> DB : aggregate([\n  {$match: {userId, metricType, timestamp >= 30d}},\n  {$sort: {timestamp: 1}}\n])
activate DB
DB --> Express : [30 weight records]
deactivate DB

Express --> React : 200 OK\n{data: [...], stats: {avg, min, max}}
deactivate Express

React -> React : Recharts render\nLineChart với data

React --> User : Hiển thị biểu đồ\ncân nặng 30 ngày

deactivate React

@enduml
```

---

## 4. Sơ đồ Hoạt động (Activity Diagram)

### 4.1 Quy trình Đưa ra Tư vấn Tự động (Recommendation Engine)

```plantuml
@startuml PHIHub_Activity_Recommendation
start

:Nhận dữ liệu chỉ số sức khỏe mới;

:Lấy metrics 7 ngày gần nhất từ DB;

fork
    :Phân tích BMI;
    if (BMI >= 30?) then (yes)
        :Tạo Alert "Béo phì"\n(severity: high);
        :Khuyến nghị: Giảm cân,\ntập luyện, tư vấn bác sĩ;
    elseif (BMI >= 25?) then (yes)
        :Tạo Alert "Thừa cân"\n(severity: medium);
        :Khuyến nghị: Tăng cường\nvận động, ăn uống lành mạnh;
    elseif (BMI < 18.5?) then (yes)
        :Tạo Alert "Thiếu cân"\n(severity: medium);
        :Khuyến nghị: Bổ sung\ndinh dưỡng;
    else (18.5 <= BMI < 25)
        :BMI bình thường;
        :Khuyến nghị: Duy trì\nlối sống hiện tại;
    endif
fork again
    :Phân tích Huyết áp;
    if (Systolic > 140 OR Diastolic > 90?) then (yes)
        :Tạo Alert "Huyết áp cao"\n(severity: high);
        :Khuyến nghị: Giảm muối,\ntập thể dục, khám bác sĩ;
    elseif (Systolic < 90 OR Diastolic < 60?) then (yes)
        :Tạo Alert "Huyết áp thấp"\n(severity: medium);
        :Khuyến nghị: Uống đủ nước,\nđứng dậy từ từ;
    else (Bình thường)
        :Huyết áp ổn định;
    endif
fork again
    :Phân tích Giấc ngủ;
    if (Avg sleep < 6h?) then (yes)
        :Tạo Alert "Thiếu ngủ"\n(severity: medium);
        :Khuyến nghị: Ngủ sớm hơn,\ngiảm caffeine, giảm screen time;
    elseif (Avg sleep > 9h?) then (yes)
        :Tạo Alert "Ngủ quá nhiều"\n(severity: low);
        :Khuyến nghị: Kiểm tra\nsức khỏe;
    else (6-9h)
        :Giấc ngủ tốt;
    endif
fork again
    :Phân tích Bước chân;
    if (Avg steps < 5000?) then (yes)
        :Tạo Alert "Ít vận động"\n(severity: medium);
        :Khuyến nghị: Đi bộ thêm,\ndùng cầu thang bộ;
    else (>= 5000)
        :Hoạt động đủ;
    endif
fork again
    :Phân tích Đường huyết;
    if (Blood sugar > 126?) then (yes)
        :Tạo Alert "Đường huyết cao"\n(severity: critical);
        :Khuyến nghị: Khám bác sĩ\nngay, kiểm soát đường;
    elseif (Blood sugar < 70?) then (yes)
        :Tạo Alert "Đường huyết thấp"\n(severity: high);
        :Khuyến nghị: Ăn nhẹ ngay,\nmang theo đường;
    else (70-126)
        :Đường huyết ổn;
    endif
end fork

:Tổng hợp danh sách recommendations;

:Lưu Alerts vào DB;

:Trả về recommendations cho Frontend;

stop

@enduml
```

### 4.2 Quy trình Nhập và Xử lý Chỉ số Sức khỏe

```plantuml
@startuml PHIHub_Activity_MetricEntry
start

:Người dùng chọn loại chỉ số;

switch (Loại chỉ số?)
case (Cân nặng)
    :Nhập giá trị (kg);
case (Huyết áp)
    :Nhập Systolic (mmHg);
    :Nhập Diastolic (mmHg);
case (Nhịp tim)
    :Nhập giá trị (bpm);
case (Giấc ngủ)
    :Nhập số giờ;
case (Bước chân)
    :Nhập số bước;
case (Đường huyết)
    :Nhập giá trị (mg/dL);
case (Nước uống)
    :Nhập lượng (ml/L);
endswitch

:Chọn ngày/giờ ghi nhận;

:Thêm ghi chú (tùy chọn);

:Xác nhận và gửi;

:Frontend validate dữ liệu;

if (Dữ liệu hợp lệ?) then (yes)
    :Gửi request đến Backend;
    
    :Backend xác thực JWT;
    
    if (Token hợp lệ?) then (yes)
        :Lưu metric vào MongoDB;
        
        if (Là cân nặng?) then (yes)
            :Tính BMI tự động;
            :Lưu BMI metric;
        endif
        
        :Chạy Recommendation Engine;
        
        if (Có cảnh báo?) then (yes)
            :Tạo Alert;
            :Thông báo người dùng;
        endif
        
        :Trả về thành công;
        :Cập nhật Dashboard;
        
    else (no)
        :Trả về 401 Unauthorized;
        :Chuyển về trang Login;
    endif
    
else (no)
    :Hiển thị lỗi validation;
endif

stop

@enduml
```

---

## 5. Sơ đồ Lớp (Class Diagram)

### 5.1 Sơ đồ Lớp - Models (MongoDB Schemas)

```plantuml
@startuml PHIHub_Class_Models
skinparam classAttributeIconSize 0

class User {
    -_id: ObjectId
    -name: String
    -email: String
    -password: String
    -dob: Date
    -gender: String
    -avatar: String
    -phone: String
    -address: String
    -medicalInfo: MedicalInfo
    -createdAt: Date
    -updatedAt: Date
    --
    +comparePassword(password): Boolean
    +generateAuthToken(): String
}

class MedicalInfo {
    -height: Number
    -bloodType: String
    -chronicConditions: ChronicCondition[]
    -allergies: Allergy[]
    -medications: Medication[]
    -emergencyContact: EmergencyContact
    -doctor: Doctor
}

class HealthMetric {
    -_id: ObjectId
    -userId: ObjectId
    -metricType: String
    -value: Number
    -unit: String
    -timestamp: Date
    -notes: String
    -metadata: Map<String, Mixed>
    -createdAt: Date
    -updatedAt: Date
    --
    +calculateBMI(): Number
}

class Goal {
    -_id: ObjectId
    -userId: ObjectId
    -title: String
    -description: String
    -goalType: String
    -targetValue: Number
    -startValue: Number
    -currentValue: Number
    -unit: String
    -startDate: Date
    -targetDate: Date
    -status: String
    -progress: Number
    -milestones: Milestone[]
    -createdAt: Date
    -updatedAt: Date
    --
    +calculateProgress(): Number
    +checkStatus(): String
}

class Article {
    -_id: ObjectId
    -title: String
    -content: String
    -category: String
    -excerpt: String
    -imageUrl: String
    -source: String
    -publishedAt: Date
    -views: Number
    -createdAt: Date
    -updatedAt: Date
    --
    +incrementViews(): void
}

class NutritionLog {
    -_id: ObjectId
    -userId: ObjectId
    -date: Date
    -mealType: String
    -foodItems: FoodItem[]
    -totalCalories: Number
    -totalProtein: Number
    -totalCarbs: Number
    -totalFat: Number
    -notes: String
    -createdAt: Date
    -updatedAt: Date
    --
    +calculateTotals(): void
}

class FoodItem {
    -name: String
    -quantity: Number
    -unit: String
    -calories: Number
    -macros: Macros
}

class MoodLog {
    -_id: ObjectId
    -userId: ObjectId
    -date: Date
    -mood: String
    -moodScore: Number
    -energy: String
    -energyScore: Number
    -stress: String
    -stressScore: Number
    -anxiety: Number
    -activities: String[]
    -emotions: String[]
    -journal: String
    -gratitude: String[]
    -createdAt: Date
    -updatedAt: Date
}

class Reminder {
    -_id: ObjectId
    -userId: ObjectId
    -title: String
    -message: String
    -type: String
    -frequency: String
    -time: String
    -days: String[]
    -startDate: Date
    -endDate: Date
    -enabled: Boolean
    -lastTriggered: Date
    -nextTrigger: Date
    -createdAt: Date
    -updatedAt: Date
    --
    +calculateNextTrigger(): Date
}

class Alert {
    -_id: ObjectId
    -userId: ObjectId
    -type: String
    -category: String
    -title: String
    -message: String
    -severity: String
    -metricType: String
    -metricValue: Number
    -threshold: Threshold
    -isRead: Boolean
    -isResolved: Boolean
    -resolvedAt: Date
    -createdAt: Date
    -updatedAt: Date
    --
    +markAsRead(): void
    +resolve(): void
}

' Relationships
User "1" -- "*" HealthMetric : has
User "1" -- "*" Goal : creates
User "1" -- "*" NutritionLog : logs
User "1" -- "*" MoodLog : records
User "1" -- "*" Reminder : sets
User "1" -- "*" Alert : receives
User "1" -- "1" MedicalInfo : contains

NutritionLog "1" -- "*" FoodItem : contains

@enduml
```

### 5.2 Sơ đồ Lớp - Controllers & Services

```plantuml
@startuml PHIHub_Class_Controllers
skinparam classAttributeIconSize 0

package "Controllers" {
    class AuthController {
        +register(req, res): Response
        +login(req, res): Response
        +logout(req, res): Response
        +getMe(req, res): Response
        +forgotPassword(req, res): Response
    }
    
    class MetricsController {
        +createMetric(req, res): Response
        +getMetrics(req, res): Response
        +getMetricStats(req, res): Response
        +updateMetric(req, res): Response
        +deleteMetric(req, res): Response
    }
    
    class GoalController {
        +createGoal(req, res): Response
        +getGoals(req, res): Response
        +getGoalById(req, res): Response
        +updateGoal(req, res): Response
        +deleteGoal(req, res): Response
        +getGoalStats(req, res): Response
    }
    
    class NutritionController {
        +createNutritionLog(req, res): Response
        +getNutritionLogs(req, res): Response
        +getNutritionStats(req, res): Response
        +updateNutritionLog(req, res): Response
        +deleteNutritionLog(req, res): Response
    }
    
    class MoodController {
        +createMoodLog(req, res): Response
        +getMoodLogs(req, res): Response
        +getMoodStats(req, res): Response
    }
    
    class ArticleController {
        +getArticles(req, res): Response
        +getArticleById(req, res): Response
        +createArticle(req, res): Response
        +updateArticle(req, res): Response
        +deleteArticle(req, res): Response
    }
    
    class RecommendationController {
        +getRecommendations(req, res): Response
    }
    
    class AlertController {
        +getAlerts(req, res): Response
        +markAsRead(req, res): Response
        +resolveAlert(req, res): Response
    }
}

package "Services" {
    class RecommendationService {
        -engine: Engine
        -rules: Rule[]
        --
        +generateRecommendations(userId): Recommendation[]
        -setupRules(): void
        -analyzeMetrics(metrics): Analysis
        -createHealthRules(): Rule[]
    }
    
    class AlertService {
        +createAlert(userId, alertData): Alert
        +checkThresholds(metric): void
    }
}

package "Middleware" {
    class AuthMiddleware {
        +protect(req, res, next): void
        +verifyToken(token): User
    }
    
    class ErrorHandler {
        +handleError(err, req, res, next): void
    }
}

' Dependencies
MetricsController --> RecommendationService : uses
MetricsController --> AlertService : uses
RecommendationController --> RecommendationService : uses
AuthController --> AuthMiddleware : uses

@enduml
```

---

## 6. Sơ đồ Kiến trúc MERN Stack

### 6.1 Kiến trúc Tổng quan MERN Stack

```plantuml
@startuml PHIHub_MERN_Architecture
skinparam componentStyle uml2
skinparam backgroundColor #FEFEFE

title Kiến trúc MERN Stack - PHIHub

' Define colors
skinparam component {
    BackgroundColor<<frontend>> #61DAFB
    BackgroundColor<<backend>> #68A063
    BackgroundColor<<database>> #4DB33D
    BackgroundColor<<external>> #FFD700
}

' Client Layer
package "Client Layer (Browser)" {
    component [React 18\n+ Vite] as React <<frontend>>
    component [React Router\nDOM v6] as Router <<frontend>>
    component [Recharts\n(Charts)] as Charts <<frontend>>
    component [Axios\n(HTTP Client)] as Axios <<frontend>>
    component [Tailwind CSS\n(Styling)] as Tailwind <<frontend>>
    component [AuthContext\n(State)] as Context <<frontend>>
}

' Server Layer
package "Server Layer (Node.js Runtime)" {
    component [Express.js\n(Web Framework)] as Express <<backend>>
    component [JWT\n(Authentication)] as JWT <<backend>>
    component [bcryptjs\n(Password Hash)] as Bcrypt <<backend>>
    component [json-rules-engine\n(Recommendations)] as RulesEngine <<backend>>
    component [Multer\n(File Upload)] as Multer <<backend>>
    component [Cookie Parser] as CookieParser <<backend>>
}

' Data Layer
package "Data Layer" {
    database "MongoDB 7.0\n(NoSQL Database)" as MongoDB <<database>>
    component [Mongoose\n(ODM)] as Mongoose <<backend>>
}

' External Services
package "External Services" {
    cloud "UI Avatars\nAPI" as AvatarAPI <<external>>
    cloud "Unsplash\n(Images)" as Unsplash <<external>>
}

' Connections - Frontend
React --> Router : routing
React --> Charts : visualization
React --> Axios : HTTP requests
React --> Tailwind : styling
React --> Context : state management

' Connections - Frontend to Backend
Axios --> Express : REST API\n(HTTP/HTTPS)

' Connections - Backend
Express --> JWT : token verify
Express --> Bcrypt : password hash
Express --> RulesEngine : health analysis
Express --> Multer : avatar upload
Express --> CookieParser : cookie handling
Express --> Mongoose : data operations

' Connections - Backend to Database
Mongoose --> MongoDB : queries

' Connections - External
React --> AvatarAPI : default avatars
React --> Unsplash : article images

note right of React
    **Frontend Stack**
    - React 18 với Hooks
    - Vite build tool
    - Single Page Application
    - Responsive Design
end note

note right of Express
    **Backend Stack**
    - RESTful API
    - MVC Pattern
    - Middleware-based
    - Error handling
end note

note right of MongoDB
    **Database**
    - 8 Collections
    - Indexed queries
    - Aggregation pipelines
end note

@enduml
```

### 6.2 Luồng Dữ liệu Chi tiết

```plantuml
@startuml PHIHub_DataFlow
skinparam backgroundColor #FEFEFE

title Luồng Dữ liệu trong MERN Stack

' Actors
actor "Người dùng" as User

' Components
rectangle "**Frontend (React)**\nPort: 8080" as Frontend {
    component [Pages\n(Dashboard, Goals,\nNutrition, Mood...)] as Pages
    component [Components\n(Navbar, Footer,\nCharts...)] as Components
    component [Services\n(API calls)] as Services
    component [Context\n(AuthContext)] as AuthCtx
}

rectangle "**Backend (Express)**\nPort: 5000" as Backend {
    component [Routes\n(/api/auth, /api/metrics,\n/api/goals...)] as Routes
    component [Controllers\n(Business Logic)] as Controllers
    component [Middleware\n(Auth, Error)] as Middleware
    component [Services\n(Recommendation)] as BackendServices
    component [Models\n(Mongoose Schemas)] as Models
}

database "**MongoDB**\nPort: 27017" as Database {
    storage "users" as UsersCol
    storage "health_metrics" as MetricsCol
    storage "goals" as GoalsCol
    storage "articles" as ArticlesCol
    storage "nutrition_logs" as NutritionCol
    storage "mood_logs" as MoodCol
    storage "reminders" as RemindersCol
    storage "alerts" as AlertsCol
}

' User interactions
User --> Pages : 1. Tương tác UI
Pages --> Components : 2. Render components
Pages --> Services : 3. Gọi API service

' Frontend to Backend
Services --> Routes : 4. HTTP Request\n(Axios + JWT Cookie)
Routes --> Middleware : 5. Xác thực & validate
Middleware --> Controllers : 6. Xử lý request
Controllers --> BackendServices : 7. Business logic
Controllers --> Models : 8. Data operations

' Backend to Database
Models --> Database : 9. MongoDB queries

' Database collections
Database --> UsersCol
Database --> MetricsCol
Database --> GoalsCol
Database --> ArticlesCol
Database --> NutritionCol
Database --> MoodCol
Database --> RemindersCol
Database --> AlertsCol

' Response flow
Models --> Controllers : 10. Data response
Controllers --> Routes : 11. Format response
Routes --> Services : 12. HTTP Response\n(JSON)
Services --> AuthCtx : 13. Update state
AuthCtx --> Pages : 14. Re-render
Pages --> User : 15. Hiển thị kết quả

@enduml
```

### 6.3 Chi tiết API Endpoints

```plantuml
@startuml PHIHub_API_Structure
skinparam backgroundColor #FEFEFE

title Cấu trúc REST API - PHIHub

package "API Routes (/api)" {
    
    package "/auth" <<Rectangle>> {
        usecase "POST /register" as Auth1
        usecase "POST /login" as Auth2
        usecase "POST /logout" as Auth3
        usecase "GET /me" as Auth4
    }
    
    package "/users" <<Rectangle>> {
        usecase "GET /profile" as User1
        usecase "PUT /profile" as User2
        usecase "PUT /medical-info" as User3
        usecase "POST /avatar" as User4
    }
    
    package "/metrics" <<Rectangle>> {
        usecase "GET /" as Metric1
        usecase "POST /" as Metric2
        usecase "GET /stats" as Metric3
        usecase "PUT /:id" as Metric4
        usecase "DELETE /:id" as Metric5
    }
    
    package "/goals" <<Rectangle>> {
        usecase "GET /" as Goal1
        usecase "POST /" as Goal2
        usecase "GET /stats" as Goal3
        usecase "PUT /:id" as Goal4
        usecase "DELETE /:id" as Goal5
    }
    
    package "/nutrition" <<Rectangle>> {
        usecase "GET /" as Nutr1
        usecase "POST /" as Nutr2
        usecase "GET /stats" as Nutr3
        usecase "DELETE /:id" as Nutr4
    }
    
    package "/mood" <<Rectangle>> {
        usecase "GET /" as Mood1
        usecase "POST /" as Mood2
        usecase "GET /stats" as Mood3
    }
    
    package "/articles" <<Rectangle>> {
        usecase "GET /" as Art1
        usecase "GET /:id" as Art2
    }
    
    package "/recommendations" <<Rectangle>> {
        usecase "GET /" as Rec1
    }
    
    package "/alerts" <<Rectangle>> {
        usecase "GET /" as Alert1
        usecase "PUT /:id/read" as Alert2
        usecase "PUT /:id/resolve" as Alert3
    }
    
    package "/reminders" <<Rectangle>> {
        usecase "GET /" as Rem1
        usecase "POST /" as Rem2
        usecase "PUT /:id" as Rem3
        usecase "DELETE /:id" as Rem4
    }
}

note bottom of "/auth"
    Public endpoints
    (No authentication required)
end note

note bottom of "/metrics"
    Protected endpoints
    (JWT required)
end note

@enduml
```

---

## 7. Sơ đồ Triển khai Docker (Deployment Diagram)

### 7.1 Sơ đồ Triển khai Docker Compose

```plantuml
@startuml PHIHub_Docker_Deployment
skinparam backgroundColor #FEFEFE

title Sơ đồ Triển khai Docker - PHIHub

' Define nodes
node "Host Machine\n(Development/Production Server)" as Host {
    
    node "Docker Engine" as DockerEngine {
        
        ' Docker Network
        frame "Docker Network: phihub-network\n(bridge)" as Network {
            
            ' MongoDB Container
            artifact "Container: phihub-mongo" as MongoContainer {
                component [MongoDB 7.0\nAlpine] as MongoDB
                storage "Volume:\nphihub-mongo-data" as MongoVolume
            }
            
            ' Server Container
            artifact "Container: phihub-server" as ServerContainer {
                component [Node.js 18\nAlpine] as NodeJS
                component [Express.js\nApp] as ExpressApp
                folder "Environment Variables" as EnvVars {
                    file "MONGO_URI" as MongoURI
                    file "JWT_SECRET" as JWTSecret
                    file "NODE_ENV" as NodeEnv
                }
            }
            
            ' Client Container
            artifact "Container: phihub-client" as ClientContainer {
                component [Nginx 1.25\nAlpine] as Nginx
                folder "/usr/share/nginx/html" as NginxHtml {
                    file "React Build\n(Static files)" as ReactBuild
                }
            }
        }
    }
    
    ' Port mappings
    interface "Port 27017" as Port27017
    interface "Port 5000" as Port5000
    interface "Port 8080" as Port8080
}

' External access
cloud "Internet\n(Người dùng)" as Internet

' Connections
Internet --> Port8080 : HTTP Request
Port8080 --> Nginx : Forward
Nginx --> ReactBuild : Serve static
Nginx --> Port5000 : Proxy /api/*

Port5000 --> ExpressApp : Forward
ExpressApp --> MongoDB : mongoose\n(port 27017)
MongoDB --> MongoVolume : persist data

NodeJS --> ExpressApp : runs
MongoURI --> ExpressApp : config

' Dependencies
ServerContainer ..> MongoContainer : depends_on\n(healthy)
ClientContainer ..> ServerContainer : depends_on

note right of MongoContainer
    **MongoDB Container**
    Image: mongo:7.0-alpine
    Port: 27017
    Volume: Persistent data
    Healthcheck: mongosh --eval
end note

note right of ServerContainer
    **Server Container**
    Image: node:18-alpine
    Port: 5000
    Build: Multi-stage
    Restart: unless-stopped
end note

note right of ClientContainer
    **Client Container**
    Image: nginx:1.25-alpine
    Port: 8080
    Build: Multi-stage
    (Node build → Nginx serve)
end note

@enduml
```

### 7.2 Chi tiết Docker Compose Configuration

```plantuml
@startuml PHIHub_Docker_Compose_Detail
skinparam backgroundColor #FEFEFE

title Docker Compose Configuration - PHIHub

package "docker-compose.yml" {
    
    package "services:" {
        
        card "mongo" as MongoService {
            card "image: mongo:7.0-alpine"
            card "container_name: phihub-mongo"
            card "ports: 27017:27017"
            card "volumes: mongo-data:/data/db"
            card "networks: phihub-network"
            card "healthcheck:\n  test: mongosh --eval 'db.runCommand(\"ping\")'\n  interval: 10s\n  timeout: 5s\n  retries: 5"
            card "restart: unless-stopped"
        }
        
        card "server" as ServerService {
            card "build: ../src/server"
            card "container_name: phihub-server"
            card "ports: 5000:5000"
            card "environment:\n  - NODE_ENV=production\n  - MONGO_URI=mongodb://mongo:27017/phihub\n  - JWT_SECRET=***\n  - JWT_EXPIRE=7d"
            card "depends_on:\n  mongo:\n    condition: service_healthy"
            card "networks: phihub-network"
            card "restart: unless-stopped"
        }
        
        card "client" as ClientService {
            card "build: ../src/client"
            card "container_name: phihub-client"
            card "ports: 8080:80"
            card "depends_on: server"
            card "networks: phihub-network"
            card "restart: unless-stopped"
        }
    }
    
    package "volumes:" {
        storage "mongo-data:\n  driver: local" as VolumeData
    }
    
    package "networks:" {
        cloud "phihub-network:\n  driver: bridge" as NetworkConfig
    }
}

MongoService --> VolumeData : mounts
ServerService --> MongoService : depends
ClientService --> ServerService : depends

MongoService --> NetworkConfig : connects
ServerService --> NetworkConfig : connects
ClientService --> NetworkConfig : connects

@enduml
```

### 7.3 Multi-stage Dockerfile Build Process

```plantuml
@startuml PHIHub_Docker_Build
skinparam backgroundColor #FEFEFE

title Multi-stage Docker Build - PHIHub Client

' Stage 1: Build
rectangle "**Stage 1: Build**\n(node:18-alpine)" as BuildStage {
    folder "WORKDIR /app" as WorkDir1 {
        file "package.json\npackage-lock.json" as PackageFiles
        file "Source files\n(src/, public/)" as SourceFiles
        file "node_modules/\n(npm ci)" as NodeModules
        file "dist/\n(npm run build)" as DistFolder
    }
}

' Stage 2: Production
rectangle "**Stage 2: Production**\n(nginx:1.25-alpine)" as ProdStage {
    folder "WORKDIR /usr/share/nginx/html" as WorkDir2 {
        file "dist/*\n(from build stage)" as StaticFiles
    }
    file "nginx.conf\n(custom config)" as NginxConf
}

' Build flow
PackageFiles --> NodeModules : npm ci
SourceFiles --> DistFolder : npm run build
DistFolder --> StaticFiles : COPY --from=build

note right of BuildStage
    **Build Stage**
    1. Copy package*.json
    2. Run npm ci (clean install)
    3. Copy source files
    4. Run npm run build (Vite)
    5. Output: /app/dist
end note

note right of ProdStage
    **Production Stage**
    1. Copy dist from build
    2. Copy nginx.conf
    3. Expose port 80
    4. Serve static files
    
    Final image size: ~25MB
    (vs ~800MB if single stage)
end note

@enduml
```

### 7.4 Nginx Reverse Proxy Configuration

```plantuml
@startuml PHIHub_Nginx_Config
skinparam backgroundColor #FEFEFE

title Nginx Configuration - PHIHub Client

actor "Người dùng" as User
participant "Browser" as Browser
participant "Nginx\n(phihub-client:80)" as Nginx
participant "Express\n(phihub-server:5000)" as Express
database "MongoDB\n(phihub-mongo:27017)" as MongoDB

== Request trang web (Static files) ==
User -> Browser : Truy cập http://localhost:8080
Browser -> Nginx : GET /
Nginx -> Nginx : Serve index.html\nfrom /usr/share/nginx/html
Nginx --> Browser : HTML + JS + CSS
Browser --> User : Render React App

== API Request (Proxy) ==
User -> Browser : Đăng nhập
Browser -> Nginx : POST /api/auth/login
Nginx -> Nginx : Match location /api/
Nginx -> Express : Proxy pass to\nhttp://phihub-server:5000/api/auth/login
Express -> MongoDB : Query user
MongoDB --> Express : User data
Express --> Nginx : JSON response + Set-Cookie
Nginx --> Browser : Forward response
Browser --> User : Chuyển đến Dashboard

== SPA Routing (try_files) ==
User -> Browser : Truy cập /dashboard
Browser -> Nginx : GET /dashboard
Nginx -> Nginx : try_files $uri /index.html
Nginx --> Browser : index.html
Browser -> Browser : React Router\nhandle /dashboard
Browser --> User : Render DashboardPage

note over Nginx
    **nginx.conf highlights:**
    - listen 80
    - root /usr/share/nginx/html
    - location /api/ { proxy_pass http://phihub-server:5000; }
    - location / { try_files $uri $uri/ /index.html; }
    - gzip compression enabled
end note

@enduml
```

### 7.5 Tổng quan Triển khai Production

```plantuml
@startuml PHIHub_Production_Overview
skinparam backgroundColor #FEFEFE

title Tổng quan Triển khai Production - PHIHub

' External
cloud "Internet" as Internet
actor "Người dùng" as Users

' Infrastructure
node "Production Server\n(VPS/Cloud)" as Server {
    
    node "Docker Host" as DockerHost {
        
        ' Containers
        artifact "phihub-client\n(Nginx)" as Client {
            portin "80" as Port80
        }
        
        artifact "phihub-server\n(Node.js)" as Backend {
            portin "5000" as Port5000Int
        }
        
        artifact "phihub-mongo\n(MongoDB)" as DB {
            portin "27017" as Port27017Int
        }
        
        ' Network
        frame "phihub-network\n(bridge)" as Network
        
        ' Volume
        storage "mongo-data\n(persistent)" as Volume
    }
    
    ' Exposed ports
    portout "8080" as Port8080Ext
    portout "5000" as Port5000Ext
    portout "27017" as Port27017Ext
}

' Connections
Users --> Internet
Internet --> Port8080Ext : HTTP
Port8080Ext --> Port80 : Docker port mapping

Port80 ..> Port5000Int : /api/* proxy\n(internal network)
Port5000Int ..> Port27017Int : mongoose\n(internal network)
Port27017Int --> Volume : data persistence

Client --> Network
Backend --> Network
DB --> Network

' Optional external access (development)
Port5000Ext -.-> Port5000Int : (optional)
Port27017Ext -.-> Port27017Int : (optional)

note right of Server
    **Deployment Commands:**
    ```
    cd docker/
    docker-compose up -d --build
    ```
    
    **Check status:**
    ```
    docker-compose ps
    docker-compose logs -f
    ```
end note

legend right
    | Symbol | Meaning |
    | --> | External traffic |
    | ..> | Internal traffic |
    | -.-> | Optional/Dev only |
endlegend

@enduml
```

---

## 📝 Ghi chú

### Công cụ vẽ sơ đồ
- **PlantUML**: Tất cả sơ đồ trên được viết bằng cú pháp PlantUML
- **Render online**: [plantuml.com](https://www.plantuml.com/plantuml/uml)
- **VS Code Extension**: PlantUML extension để preview

### Cách render sơ đồ
1. Copy nội dung giữa `@startuml` và `@enduml`
2. Paste vào [PlantUML Online Server](https://www.plantuml.com/plantuml/uml)
3. Hoặc sử dụng VS Code với extension PlantUML

### Quy ước ký hiệu

| Ký hiệu | Ý nghĩa |
|---------|---------|
| `*` | Bắt buộc (required) |
| `<<PK>>` | Primary Key |
| `<<FK>>` | Foreign Key |
| `<<include>>` | Use case bao gồm |
| `<<extend>>` | Use case mở rộng |
| `1:N` | Quan hệ một-nhiều |
| `1:1` | Quan hệ một-một |

---

**Tác giả:** Phan Đăng Khoa  
**MSSV:** 110122227  
**Cập nhật lần cuối:** 25/12/2025
