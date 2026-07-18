/// Input validation functions for forms across the app.
class Validators {
  Validators._();

  /// Validate email address.
  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }
    final emailRegex =
        RegExp(r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$');
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Please enter a valid email';
    }
    return null;
  }

  /// Validate password (minimum 6 characters).
  static String? password(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }

  /// Validate required field.
  static String? required(String? value, [String fieldName = 'This field']) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  /// Validate phone number (10 digits).
  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Phone number is required';
    }
    final digits = value.replaceAll(RegExp(r'[^\d]'), '');
    if (digits.length < 10 || digits.length > 15) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  /// Validate numeric input.
  static String? numeric(String? value, [String fieldName = 'Value']) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    if (double.tryParse(value) == null) {
      return 'Please enter a valid number';
    }
    return null;
  }

  /// Validate positive number.
  static String? positiveNumber(String? value, [String fieldName = 'Value']) {
    final numError = numeric(value, fieldName);
    if (numError != null) return numError;
    if (double.parse(value!) <= 0) {
      return '$fieldName must be greater than 0';
    }
    return null;
  }

  /// Validate weight (1–500 kg).
  static String? weight(String? value) {
    final numError = positiveNumber(value, 'Weight');
    if (numError != null) return numError;
    final w = double.parse(value!);
    if (w > 500) return 'Please enter a valid weight';
    return null;
  }

  /// Validate height (30–300 cm).
  static String? height(String? value) {
    final numError = positiveNumber(value, 'Height');
    if (numError != null) return numError;
    final h = double.parse(value!);
    if (h > 300) return 'Please enter a valid height';
    return null;
  }
}
