import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;

/// Local SQLite database manager.
/// Handles table creation, versioning, and migration.
class LocalDatabase {
  static Database? _database;
  static const String _dbName = 'gmmx_member.db';
  static const int _dbVersion = 1;

  /// Get or initialize the database instance.
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final documentsDir = await getApplicationDocumentsDirectory();
    final path = p.join(documentsDir.path, _dbName);

    return await openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  /// Create all tables on first install.
  Future<void> _onCreate(Database db, int version) async {
    // ── Attendance Cache ──
    await db.execute('''
      CREATE TABLE IF NOT EXISTS attendance_cache (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        member_id TEXT NOT NULL,
        check_in_time TEXT NOT NULL,
        method TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        device_id TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    ''');

    // ── Workout Log Cache ──
    await db.execute('''
      CREATE TABLE IF NOT EXISTS workout_log_cache (
        id TEXT PRIMARY KEY,
        member_id TEXT NOT NULL,
        workout_plan_id TEXT,
        exercise_id TEXT NOT NULL,
        exercise_name TEXT NOT NULL,
        sets_data TEXT NOT NULL,
        duration_seconds INTEGER,
        notes TEXT,
        synced INTEGER DEFAULT 0,
        logged_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    // ── Nutrition Log Cache ──
    await db.execute('''
      CREATE TABLE IF NOT EXISTS nutrition_log_cache (
        id TEXT PRIMARY KEY,
        member_id TEXT NOT NULL,
        food_id TEXT,
        food_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        calories REAL,
        protein REAL,
        carbs REAL,
        fat REAL,
        quantity REAL,
        unit TEXT,
        synced INTEGER DEFAULT 0,
        logged_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    ''');

    // ── Water Intake Cache ──
    await db.execute('''
      CREATE TABLE IF NOT EXISTS water_log_cache (
        id TEXT PRIMARY KEY,
        member_id TEXT NOT NULL,
        amount_ml INTEGER NOT NULL,
        synced INTEGER DEFAULT 0,
        logged_at TEXT NOT NULL
      )
    ''');

    // ── Offline Sync Queue ──
    await db.execute('''
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        payload TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 5,
        created_at TEXT NOT NULL
      )
    ''');
  }

  /// Handle database version upgrades.
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Future migrations go here
  }

  /// Insert a record into the sync queue for background upload.
  Future<void> enqueueSync({
    required String tableName,
    required String recordId,
    required String operation,
    required String payload,
  }) async {
    final db = await database;
    await db.insert('sync_queue', {
      'table_name': tableName,
      'record_id': recordId,
      'operation': operation,
      'payload': payload,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  /// Get all pending sync items.
  Future<List<Map<String, dynamic>>> getPendingSyncs() async {
    final db = await database;
    return await db.query(
      'sync_queue',
      where: 'retry_count < max_retries',
      orderBy: 'created_at ASC',
    );
  }

  /// Remove a successfully synced item from the queue.
  Future<void> removeSyncItem(int id) async {
    final db = await database;
    await db.delete('sync_queue', where: 'id = ?', whereArgs: [id]);
  }

  /// Increment retry count for a failed sync.
  Future<void> incrementRetry(int id) async {
    final db = await database;
    await db.rawUpdate(
      'UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?',
      [id],
    );
  }

  /// Close the database.
  Future<void> close() async {
    final db = await database;
    await db.close();
    _database = null;
  }
}

/// Provider for local database singleton.
final localDatabaseProvider = Provider<LocalDatabase>((ref) {
  return LocalDatabase();
});
