# GMMX Client App - Future Vision & Specification

> **Note**: This document captures the long-term vision for the GMMX client mobile application. According to our current MVP priorities (`AGENTS.md`), the mobile app is considered a **future feature**. Development of this app should be deferred until core MVP features are completed and validated.

---

I think you can make the client app much more than just a "gym member app." It can become a personal fitness companion that keeps members engaged every day, which also reduces member churn for gym owners.

---

# Attendance Module (Gym Owner + Client)

## 1. QR Attendance (Primary)

Gym owner gets a unique QR Code.

It can be
* Printed at reception
* Displayed on tablet
* Displayed on TV
* Displayed inside GMMX Owner App

Every gym has a unique encrypted QR.

Instead of only storing Gym ID, generate a **dynamic secure token**.

Example
```
Gym ID
Timestamp
Nonce
Encrypted Signature
```

QR refreshes every **30-60 seconds** to prevent people from taking screenshots and sharing them.

---

## 2. Location Verification

When member scans, check
✅ GPS Location

Within
```
50m
75m
100m
```
radius from gym.

If outside:
```
You are not inside the gym.
Attendance cannot be marked.
```

---

## 3. Time Validation

Gym owner can configure
```
Open: 5 AM
Close: 10 PM
```

Attendance allowed only during gym timings.

---

## 4. Duplicate Protection

One attendance per day.

Optional:
```
Morning
Evening
```
if gym allows two sessions.

---

## 5. Optional WiFi Verification

Even better. If connected to gym WiFi:
```
Confidence: 95%
```
If GPS + WiFi:
```
Confidence: 99%
```

---

## 6. Device Validation

Prevent attendance farming.
Store:
* Device ID
* Phone model
* OS

Flag:
```
20 attendances from same device
```

---

## 7. Face Verification (Future Premium)

Optional selfie. AI checks face. Very useful for premium gyms.

---

## 8. Manual Attendance

Owner / Trainer / Receptionist can manually mark attendance.
Need reason:
```
Forgot phone
Phone battery dead
QR unavailable
New member
```

Activity log stores:
```
Who marked
When
Reason
```

---

## 9. Attendance History

Client can see:
```
Today
Yesterday
This Month
Last Month
Calendar View
```

---

## 10. Attendance Analytics

Owner dashboard shows:
- Today's attendance
- Peak hours
- Most active members
- Inactive members
- Average visits
- Retention

---

# Workout Module

This should become the biggest feature.

## Gym Equipment

Owner adds:
```
Bench Press
Smith Machine
Leg Press
Cable Machine
Lat Pulldown
Treadmill
Cross Trainer
Dumbbells
EZ Bar
Olympic Bar
Bike
Stepper
```

Each equipment has:
* Name
* Category
* Image
* Instructions
* Video
* Muscle Groups
* Maintenance Status

---

## Workout Plans

Owner creates:
```
Push Pull Legs
Beginner
Weight Loss
Strength
Bodybuilding
Women
Senior
Athlete
Home Workout
```
Assign to members.

---

## Exercise Library

Every exercise includes:
```
Name
Muscle
Equipment
Difficulty
Video
Animation
Tips
Common mistakes
```

Example:
```
Bench Press
Chest
Intermediate
Video
3 Sets
12 Reps
```

---

## Workout Tracking

Member taps:
```
Start Workout
```

Then logs:
```
Bench Press
Weight: 60kg
Reps: 12
Sets: 4
Rest: 90 sec
Completed
```

History saved forever.

---

## PR Tracking

Automatically detect:
```
New Personal Record
Bench Press - 70kg
Congratulations 🎉
```

---

## Workout Timer

Built-in timers for:
- Rest timer
- Exercise timer
- Workout duration

---

## Equipment Usage

Interesting feature.
Member logs:
```
Used Lat Pulldown
15 min
5 sets
```

Owner sees:
```
Machine Usage
Peak Time
Maintenance Prediction
```

---

# Diet Module

Owner or Trainer creates:
- Breakfast
- Lunch
- Dinner
- Snack
- Pre-workout
- Post-workout

---

Food database includes items like:
```
Rice, Chicken, Egg, Milk, Paneer, Banana, Apple, Oats, Peanut Butter
```

Each item has data for:
- Calories
- Protein
- Fat
- Carbs
- Fiber
- Sugar
- Sodium
- Micronutrients

---

Daily Intake Tracking:
```
Calories
Protein
Fat
Carbs
Fiber
Water
```
Includes a progress bar.

---

Water Tracker:
```
250ml
500ml
1L
2L
Goal reached
```

---

Weight Tracking:
- Weekly
- Monthly
- Body Fat
- BMI
- Progress graph

---

# Progress Module

Track:
- Weekly photos
- Body measurements (Chest, Waist, Arms, Legs)
- Weight
- Body Fat

Graph visualization:
```
Weight ↓
Body Fat ↓
Muscle ↑
```

---

# Google Fit Integration

Connect Google Fit (or Android Health Connect, which is Google's recommended replacement for direct Google Fit integrations on Android).

Fetch:
* Steps
* Distance
* Calories burned
* Heart rate (if available)
* Active minutes
* Sleep (optional)

Display:
```
Today's Steps: 8,542
Goal: 10,000 (85%)
```
Also sync workout calories.

---

# Achievements

Gamification features:
```
7 Day Streak
30 Day Streak
100 Visits
100 Workouts
First Bench Press
First PR
10kg Lost
Marathon Completed
```
Include Badges.

---

# Challenges

Owner creates challenges:
```
30 Day Fat Loss
100 Pushups
10 Visits
Summer Challenge
```
Include a Leaderboard.

---

# Notifications

* Workout reminder
* Meal reminder
* Water reminder
* Membership renewal
* Trainer message
* Gym announcements

---

# Social (Optional)

Members can:
- Share PR
- Like workouts
- Comment
- Participate in a private gym community

---

# AI Coach (Future Premium)

Ask queries like:
```
I want bigger shoulders.
Suggest today's workout.
How many calories should I eat?
Create a PPL plan.
Review my progress.
```

---

# Dashboard

Show summary view:
```
Good Evening Nitheesh 👋
Today's Workout
Calories
Protein
Attendance
Steps
Current Streak
Upcoming Renewal
Trainer Message
Progress Graph
Achievements
```

---

# Premium Features

* Wear OS smartwatch support
* Apple Watch support (future)
* Health Connect integration
* Offline workout logging
* QR attendance
* Face attendance
* Smart reminders
* AI diet suggestions
* AI workout recommendations
* Smart attendance insights
* Equipment maintenance analytics
* Export workout history
* PDF progress reports

---

# Production-Ready Development Prompt

> **Build a production-ready Flutter client application for GMMX (Gym Management & Fitness Platform). The app is exclusively for registered gym members—there is no public registration. Users authenticate using Google Sign-In or email/password after being invited by their gym owner.**
>
> **Attendance:** Implement secure QR-code attendance with rotating encrypted QR tokens, GPS geofencing (50–100m configurable radius), gym-hours validation, duplicate attendance prevention, optional Wi-Fi verification, offline retry handling, attendance history (calendar/list), manual attendance by authorized staff with audit logs, and real-time attendance status.
>
> **Dashboard:** Display today's attendance, assigned workout, daily calorie target, step count (via Health Connect/Google Fit where available), current streak, upcoming membership renewal, trainer messages, announcements, progress graphs, and achievements.
>
> **Workout Management:** Provide an exercise library with images/videos, muscle groups, difficulty, instructions, and common mistakes. Support trainer-assigned workout plans, workout logging (sets, reps, weight, duration, rest timer, notes), personal record detection, workout history, estimated one-rep max, and progress charts.
>
> **Equipment Management:** Display gym equipment added by the owner with categories, descriptions, availability, usage instructions, and maintenance status. Allow members to log equipment usage time and completed sets for analytics.
>
> **Nutrition:** Include meal plans assigned by trainers, food logging, calorie/macronutrient/micronutrient tracking, hydration tracking, weight tracking, body measurements, BMI, body-fat progress, and nutrition summaries with charts.
>
> **Health Integration:** Integrate Android Health Connect (preferred) with support for steps, distance, active calories, heart rate, sleep, and active minutes, while maintaining compatibility with Google Fit where appropriate. Synchronize workout calories and activity metrics.
>
> **Gamification:** Implement daily and weekly streaks, achievement badges, gym challenges, leaderboards, milestones, and motivational notifications.
>
> **Communication:** Support trainer messaging, gym announcements, push notifications for workouts, meals, hydration, attendance reminders, and membership renewals.
>
> **Architecture:** Use Flutter with Riverpod, GoRouter, clean architecture, offline-first data synchronization, background sync, secure local storage, biometric login support, responsive Material 3 UI, dark/light themes, localization, accessibility, analytics, crash reporting, and scalable production-ready code with reusable components. Ensure all modules are optimized for performance, security, and future expansion to wearables and AI-powered coaching.

If GMMX is positioned as a platform for **gyms, yoga studios, dance academies, swimming centers, martial arts schools, and fitness clubs**, this client app architecture will work across all of them by making activities, equipment, attendance methods, and workout plans configurable rather than hard-coded for gyms alone. That gives you a single product that can serve multiple fitness businesses without maintaining separate apps.
