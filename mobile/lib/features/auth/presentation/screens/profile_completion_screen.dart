import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfileCompletionScreen extends StatefulWidget {
  const ProfileCompletionScreen({super.key});

  @override
  State<ProfileCompletionScreen> createState() => _ProfileCompletionScreenState();
}

class _ProfileCompletionScreenState extends State<ProfileCompletionScreen> {
  final _formKey = GlobalKey<FormState>();

  void _saveProfile() {
    if (_formKey.currentState?.validate() ?? false) {
      // Save data and go to dashboard
      context.go('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Complete Profile'),
        centerTitle: true,
        automaticallyImplyLeading: false, // Prevent going back to login
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Stack(
                    children: [
                      const CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors.grey,
                        child: Icon(Icons.person, size: 50, color: Colors.white),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: CircleAvatar(
                          backgroundColor: Theme.of(context).colorScheme.primary,
                          radius: 18,
                          child: IconButton(
                            icon: const Icon(Icons.camera_alt, size: 18, color: Colors.white),
                            onPressed: () {
                              // TODO: Pick image
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                _buildTextField('Gender', Icons.wc),
                const SizedBox(height: 16),
                _buildTextField('Date of Birth', Icons.calendar_today),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildTextField('Height (cm)', Icons.height)),
                    const SizedBox(width: 16),
                    Expanded(child: _buildTextField('Weight (kg)', Icons.monitor_weight)),
                  ],
                ),
                const SizedBox(height: 16),
                _buildTextField('Emergency Contact', Icons.phone),
                const SizedBox(height: 16),
                _buildTextField('Medical Conditions (if any)', Icons.medical_services, maxLines: 3),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _saveProfile,
                  child: const Text('Save & Continue'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, IconData icon, {int maxLines = 1}) {
    return TextFormField(
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: maxLines == 1 ? Icon(icon) : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Required';
        }
        return null;
      },
    );
  }
}
